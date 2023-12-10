import express from 'express';

import * as dotenv from 'dotenv';
import { logger } from './util';
import { connectOnDatabase } from './loader';
import { loadRouter } from './router';

// env 파일 사용
dotenv.config();

// express 서버 정의
const app = express();

/**
 * 서버 시작
 */
async function main() {
  const { MAIN_SERVER_PORT, NODE_ENV } = process.env;

  app.listen(MAIN_SERVER_PORT, () => {
    logger.info('[APP] Server Running on %s port. env: %s', MAIN_SERVER_PORT, NODE_ENV);
  });

  loadRouter(app);

  connectOnDatabase();
}

main();

export { app };
