import express from 'express';

import * as dotenv from 'dotenv';
import * as Router from './router';
import { DataBase } from './loader';
import { logger } from './util';

dotenv.config();
export const app = express();

/**
 * 서버 시작
 */
async function main() {
  const { MAIN_SERVER_PORT, NODE_ENV } = process.env;

  app.listen(MAIN_SERVER_PORT, () => {
    logger.info('[APP] Server Running on %s port. env: %s', MAIN_SERVER_PORT, NODE_ENV);
  });

  Router.init(app);

  DataBase.connectOnDatabase();
}

main();
