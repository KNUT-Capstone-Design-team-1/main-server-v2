/* eslint-disable no-restricted-syntax */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const { logger } = require('./util');
const { PillSearchApi } = require('./api');
const {
  loadPillRecognitionData,
  loadDrugPermissionData,
  connectOnDatabase,
} = require('./loader');

const port = process.env.SERVER_PORT;
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/pill-search', PillSearchApi);
require('dotenv').config();

/**
 * 데이터베이스 초기화 및 업데이트
 */
function initDatabase() {
  logger.info('[INIT-DATABASE] Initial Database');
  loadPillRecognitionData();
  loadDrugPermissionData();
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

  connectOnDatabase();

  if (process.env.NODE_ENV === 'init') {
    initDatabase();
  }
}

main();
