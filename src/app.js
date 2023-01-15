/* eslint-disable no-restricted-syntax */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const { logger } = require('./util');
const { PillSearchApi } = require('./api');
const { Loader, Database } = require('./loader');
const { DatabaseQuery } = require('./queries');

const port = 17261;
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/pill-search', PillSearchApi);

/**
 * 데이터베이스 세팅
 */
function initDatabase() {
  logger.info('[INIT-DATABASE] Initial Database');
  Loader.loadPillRecognitionData();
  Loader.loadDrugPermissionData();
}

/**
 * 서버 시작
 */
async function main() {
  app.listen(port, () => {
    logger.info(
      `[APP-INIT] Server Running on ${port} port. env: ${process.env.NODE_ENV}`
    );
  });

  Database.connectOnDatabase();

  const documentsCount = await DatabaseQuery.countDocuments();
  const noneDataCollections = documentsCount.filter((v) => v.documets === 0);

  if (noneDataCollections.length > 0) {
    logger.info(
      '[APP-INIT] Has no essential datas or init mode. do collection update'
    );

    for (const collection of noneDataCollections) {
      switch (collection.model) {
        case 'PillRecognitionDataModel':
          Loader.loadPillRecognitionData();
          break;

        case 'DrugPermissionDataModel':
          Loader.loadDrugPermissionData();
          break;

        default:
      }
    }
  } else if (process.env.NODE_ENV === 'init') {
    initDatabase();
  }
}

main();
