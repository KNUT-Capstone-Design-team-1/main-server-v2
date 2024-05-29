import mongoose from 'mongoose';
import { logger } from '../util';
import * as Resource from './resource';
import { Config } from '.';

mongoose.set('strictQuery', true);

/**
 * 데이터베이스 연결
 */
export function connectOnDatabase() {
  const option = { socketTimeoutMS: 30000 };

  mongoose.connect(process.env.DBMS_ADDRESS as string, option);

  const db = mongoose.connection;
  db.on('error', (e) => {
    logger.error('[DATABASE] Database connection fail. %s', e.stack || e);
    throw e;
  });

  db.once('open', async () => {
    logger.info('[DATABASE] Database connection success');

    // DB에 연결된 뒤 리소스 업데이트를 해야하기 때문에 이 위치에서 업데이트를 수행한다
    const isUpdated = await Resource.update();

    if (isUpdated) {
      await Config.upsertDBUpdateDate();
    }
  });
}
