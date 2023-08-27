/* eslint-disable no-restricted-syntax */
const express = require('express');
const bodyParser = require('body-parser');

const { logger } = require('./util');
const { PillSearchApi } = require('./api');
const {
  loadPillRecognitionData,
  loadDrugPermissionData,
  connectOnDatabase,
} = require('./loader');

// express 서버 정의
const app = express();
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

// API 정의
app.use('/pill-search', PillSearchApi);
require('dotenv').config();

/**
 * 데이터베이스 초기화 및 업데이트
 */
function initDatabase() {
  logger.info('[APP] Initial Database');
  loadPillRecognitionData();
  loadDrugPermissionData();
}

/**
 * 서버 시작
 */
async function main() {
  const { MAIN_SERVER_PORT, NODE_ENV } = process.env;

  app.listen(MAIN_SERVER_PORT, () => {
    logger.info(
      '[APP] Server Running on %s port. env: %s',
      MAIN_SERVER_PORT,
      NODE_ENV
    );
  });

  connectOnDatabase();

  if (NODE_ENV === 'init') {
    initDatabase();
  }
}

main();
