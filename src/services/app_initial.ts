import { CONFIG, logger } from '../util';
import msg from '../../res/ko-KR.json';
import ConfigModel from '../schema/config';

/**
 * 데이터베이스의 업데이트 날짜를 조회한다
 * @returns
 */
export async function readDBUpdateDate() {
  try {
    const updateDateConfig = await ConfigModel.findOne({ id: CONFIG.DB_UPDATE_DATE });

    return { success: true, data: { updateDate: updateDateConfig?.value || '0000-00-00' } };
  } catch (e) {
    logger.error('[APP-INITIAL] Fail to read DB update date. %s', e.stack || e);

    return { success: false, message: msg['app-initial.error.read-update-date'] };
  }
}
