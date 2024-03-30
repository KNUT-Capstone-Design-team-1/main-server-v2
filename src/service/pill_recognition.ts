import { PillRecognitionDataModel } from '../schema';
import { TResourceSchema } from '../@types/common';
import { TPillRecognitionData } from '../@types/pill_recognition';
import { TSearchQueryOption } from '../@types/pill_search';
import { logger } from '../util';
import { generateQueryFilterForPillSearch } from './util';

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
    logger.error('[PILL-RECOGNITION-SERVICE] Fail to update datas. %s', e.stack || e);
  }
}

/**
 * 엑셀파일을 읽어 알약 식별 정보 업데이트
 */
export function getPillrecognitionResourceSchema() {
  const mapper: TResourceSchema = {
    ITEM_SEQ: { prop: 'ITEM_SEQ', type: String, required: true },
    ITEM_NAME: { prop: 'ITEM_NAME', type: String, required: true },
    ENTP_SEQ: { prop: 'ENTP_SEQ', type: String },
    ENTP_NAME: { prop: 'ENTP_NAME', type: String, required: true },
    CHARTN: { prop: 'CHARTN', type: String },
    ITEM_IMAGE: { prop: 'ITEM_IMAGE', type: String },
    PRINT_FRONT: { prop: 'PRINT_FRONT', type: String },
    PRINT_BACK: { prop: 'PRINT_BACK', type: String },
    DRUG_SHAPE: { prop: 'DRUG_SHAPE', type: String },
    COLOR_CLASS1: { prop: 'COLOR_CLASS1', type: String },
    COLOR_CLASS2: { prop: 'COLOR_CLASS2', type: String },
    LINE_FRONT: { prop: 'LINE_FRONT', type: String },
    LINE_BACK: { prop: 'LINE_BACK', type: String },
    LENG_LONG: { prop: 'LENG_LONG', type: String },
    LENG_SHORT: { prop: 'LENG_SHORT', type: String },
    THICK: { prop: 'THICK', type: String },
    IMG_REGIST_TS: { prop: 'IMG_REGIST_TS', type: String },
    CLASS_NO: { prop: 'CLASS_NO', type: String },
    ETC_OTC_CODE: { prop: 'ETC_OTC_CODE', type: String },
    ITEM_PERMIT_DATE: { prop: 'ITEM_PERMIT_DATE', type: String },
    SHAPE_CODE: { prop: 'SHAPE_CODE', type: String },
    MARK_CODE_FRONT_ANAL: { prop: 'MARK_CODE_FRONT_ANAL', type: String },
    MARK_CODE_BACK_ANAL: { prop: 'MARK_CODE_BACK_ANAL', type: String },
    MARK_CODE_FRONT_IMG: { prop: 'MARK_CODE_FRONT_IMG', type: String },
    MARK_CODE_BACK_IMG: { prop: 'MARK_CODE_BACK_IMG', type: String },
    ITEM_ENG_NAME: { prop: 'ITEM_ENG_NAME', type: String },
    EDI_CODE: { prop: 'EDI_CODE', type: String },
  };

  return mapper;
}
