import mongoose from 'mongoose';
import { logger } from '../util';
// import { updateDatabaseFromResource } from './loader';

mongoose.set('strictQuery', true);

/**
 * 데이터베이스 연결
 */
export function connectOnDatabase() {
  const { DB_URL } = process.env;

  mongoose.connect(DB_URL as string);

  const db = mongoose.connection;
  db.on('error', (e) => {
    logger.error('[DATABASE] Database connection fail.\n%s', e.stack || e);
    throw e;
  });

  db.once('open', () => {
    logger.info('[DATABASE] Database connection success');
    // updateDatabaseFromResource();
  });
}
