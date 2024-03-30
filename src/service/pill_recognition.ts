import { PillRecognitionDataModel } from '../schema';
import { TResourceMapper } from '../@types/common';
import { TPillRecognitionData } from '../@types/pill_recognition';
import { TSearchQueryOption } from '../@types/pill_search';
import { logger, generateQueryFilterForPillSearch } from '../util';

/**
 * 식별 검색을 위한 낱알 식별 데이터 조회
 * @param where 검색할 데이터
 * @param option 쿼리 옵션
 * @returns
 */
export async function getRecognitionDataForSearch(
  where: Partial<TPillRecognitionData>,
  option?: Partial<TSearchQueryOption>
) {
  // 조회할 컬럼
  const field = {
    ITEM_SEQ: 1,
    ITEM_NAME: 1,
    ENTP_NAME: 1,
    CHARTIN: 1,
    ITEM_IMAGE: 1,
    DRUG_SHAPE: 1,
    COLOR_CLASS1: 1,
    COLOR_CLASS2: 1,
    LINE_FRONT: 1,
    LINE_BACK: 1,
  };

  const findQuery = await generateQueryFilterForPillSearch(where);

  const { skip, limit } = option || {};

  const recognitionDatas = await PillRecognitionDataModel.find(findQuery, field)
    .skip(skip || 0)
    .limit(limit || 0);

  return recognitionDatas;
}

/**
 * DB에 여러 항목의 알약 식별 정보 데이터 업데이트 요청
 * @param datas 알약 식별 정보 데이터 배열
 */
export async function requestUpdatePillRecognitionDatas(datas: Partial<TPillRecognitionData>[]) {
  if (datas.length === 0) {
    logger.warn(`[PILL-RECOGNITION-SERVICE] No data from excel file.`);
    return;
  }

  try {
    for (const data of datas) {
      await PillRecognitionDataModel.updateOne({ ITEM_SEQ: data.ITEM_SEQ }, data, {
        new: true,
        upsert: true,
      });
    }
  } catch (e) {
    logger.error('[PILL-RECOGNITION-SERVICE] Fail to update datas.\n%s', e.stack || e);
  }
}

/**
 * 엑셀파일을 읽어 알약 식별 정보 업데이트
 */
export function getPillrecognitionResourceMapper() {
  const mapper: TResourceMapper = {
    ITEM_SEQ: { colunmOfResource: 'ITEM_SEQ', required: true },
    ITEM_NAME: { colunmOfResource: 'ITEM_NAME', required: true },
    ENTP_SEQ: { colunmOfResource: 'ENTP_SEQ', required: true },
    ENTP_NAME: { colunmOfResource: 'ENTP_NAME', required: true },
    CHARTIN: { colunmOfResource: 'CHARTIN', required: true },
    ITEM_IMAGE: { colunmOfResource: 'ITEM_IMAGE' },
    PRINT_FRONT: { colunmOfResource: 'PRINT_FRONT' },
    PRINT_BACK: { colunmOfResource: 'PRINT_BACK' },
    DRUG_SHAPE: { colunmOfResource: 'DRUG_SHAPE', required: true },
    COLOR_CLASS1: { colunmOfResource: 'COLOR_CLASS1', required: true },
    COLOR_CLASS2: { colunmOfResource: 'COLOR_CLASS2' },
    LINE_FRONT: { colunmOfResource: 'LINE_FRONT' },
    LINE_BACK: { colunmOfResource: 'LINE_BACK' },
    LENG_LONG: { colunmOfResource: 'LENG_LONG' },
    LENG_SHORT: { colunmOfResource: 'LENG_SHORT' },
    THICK: { colunmOfResource: 'THICK' },
    IMG_REGIST_TS: { colunmOfResource: 'IMG_REGIST_TS' },
    CLASS_NO: { colunmOfResource: 'CLASS_NO' },
    ETC_OTC_CODE: { colunmOfResource: 'ETC_OTC_CODE' },
    ITEM_PERMIT_DATE: { colunmOfResource: 'ITEM_PERMIT_DATE' },
    SHAPE_CODE: { colunmOfResource: 'SHAPE_CODE' },
    MARK_CODE_FRONT_ANAL: { colunmOfResource: 'MARK_CODE_FRONT_ANAL' },
    MARK_CODE_BACK_ANAL: { colunmOfResource: 'MARK_CODE_BACK_ANAL' },
    MARK_CODE_FRONT_IMG: { colunmOfResource: 'MARK_CODE_FRONT_IMG' },
    MARK_CODE_BACK_IMG: { colunmOfResource: 'MARK_CODE_BACK_IMG' },
    ITEM_ENG_NAME: { colunmOfResource: 'ITEM_ENG_NAME' },
    EDI_CODE: { colunmOfResource: 'EDI_CODE' },
  };

  return mapper;
}
