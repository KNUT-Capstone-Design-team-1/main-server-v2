const express = require('express');

const app = express();
const db = require('./src/loader/database');
const { logger } = require('./src/util/logger');
const PillRecogApi = require('./src/api/pill_recognition');
const ConfigUpdater = require('./src/loader/config');

const port = 17260;
app.use('/pill-recognition', PillRecogApi);

async function main() {
  app.listen(port, () => {
    logger.info(`Server Running on ${port} port`);
  });

  try {
    await db.connectOnDatabase();
    await ConfigUpdater.updateConfig();
  } catch (e) {
    logger.error(`[APP-INIT] ${e}`);
  }
}

main();
