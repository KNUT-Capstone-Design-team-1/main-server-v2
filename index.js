const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const db = require('./src/loader/database');
const { logger } = require('./src/util/logger');
const PillSearchApi = require('./src/api/pill_search');
const loader = require('./src/loader/loader');

const port = 17261;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/pill-search', PillSearchApi);

function main() {
  app.listen(port, () => {
    logger.info(
      `[APP-INIT] Server Running on ${port} port. env: ${process.env.NODE_ENV}`
    );
  });

  try {
    db.connectOnDatabase();
    loader.updateConfig();
    loader.updatePillRecognitionData();
  } catch (e) {
    logger.error(`[APP-INIT] ${e}`);
    throw e;
  }
}

main();
