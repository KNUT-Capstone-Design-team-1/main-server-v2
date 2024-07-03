import dayJs from 'dayjs';
import ConfigModel from '../schema/config';
import { CONFIG, CONFIG_TYPE, logger } from '../utils';

/**
 * 데이터베이스 업데이트 날짜 기록
 */
export async function upsertDBUpdateDate() {
  try {
    await ConfigModel.updateOne(
      { id: CONFIG.DB_UPDATE_DATE },
      {
        id: CONFIG.DB_UPDATE_DATE,
        value: dayJs(new Date()).format('YYYY-MM-DD'),
        type: CONFIG_TYPE.STRING,
      },
      { new: true, upsert: true }
    );
  } catch (e) {
    logger.error('[LOADER] Fail to upsert DB update date. %s', e.stack || e);
  }
}
