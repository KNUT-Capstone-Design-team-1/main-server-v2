const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const { logger } = require('./util');
const { PillSearchApi } = require('./api');
const { Loader, Database } = require('./loader');

const port = 17261;
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/pill-search', PillSearchApi);

/**
 * 서버 시작
 */
function main() {
  app.listen(port, () => {
    logger.info(
      `[APP-INIT] Server Running on ${port} port. env: ${process.env.NODE_ENV}`
    );
  });

  Database.connectOnDatabase();
  Loader.updateConfig();
  Loader.updatePillRecognitionData();
  Loader.updateDrugPermissionData();
}

main();
