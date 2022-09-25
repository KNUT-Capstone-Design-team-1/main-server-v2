const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const db = require('./loader/database');
const { logger } = require('./util/logger');
const PillSearchApi = require('./api/pill_search');
const loader = require('./loader/loader');

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
    loader.updateDrugPermissionData();
  } catch (e) {
    logger.error(`[APP-INIT] ${e}`);
    throw e;
  }
}

main();
