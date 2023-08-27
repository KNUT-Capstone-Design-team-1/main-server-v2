/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const {
  updatePillRecognitionData,
  readPillRecognitionData,
} = require('../queries');

const {
  logger,
  getJsonFromExcelFile,
  generateOperatorForRecognition,
} = require('../util');

/**
 * @type {import('../data_type/recog_search')}
 */

/**
 * 식별 검색을 위한 낱알 식별 데이터 조회
 * @param {RECOG_SEARCH_REQ_DATA} where 검색할 데이터
 * @param {{skip: number, limit: number}} option 쿼리 옵션
 * @returns {object[]}
 */
function getRecognitionDataForSearch(where, option) {
  // DB 쿼리 조건
  const operation = generateOperatorForRecognition(where);

  // 조회할 컬럼
  const field = {
    ITEM_SEQ: 1,
    ITEM_NAME: 1,
    ENTP_NAME: 1,
    CHARTN: 1,
    ITEM_IMAGE: 1,
    DRUG_SHAPE: 1,
    COLOR_CLASS1: 1,
    COLOR_CLASS2: 1,
    LINE_FRONT: 1,
    LINE_BACK: 1,
  };
  return readPillRecognitionData(operation, field, option);
}

/**
 * DB에 여러 항목의 알약 식별 정보 데이터 업데이트 요청
 * @param {object[]} datas 알약 식별 정보 데이터 배열
 */
async function requestUpdatePillRecognitionDatas(datas) {
  if (datas.length === 0) {
    logger.warn(`[PILL-RECOGNITION-SERVICE] No data from excel file.`);
    return;
  }

  try {
    for (const data of datas) {
      await updatePillRecognitionData(data);
    }
  } catch (e) {
    logger.error(
      '[PILL-RECOGNITION-SERVICE] Fail to update datas.\n%s',
      e.stack || e
    );
  }
}

/**
 * 엑셀파일을 읽어 알약 식별 정보 업데이트
 */
async function initPillRecognitionData() {
  const schema = {
    ITEM_SEQ: { prop: 'ITEM_SEQ', type: String, required: true },
    ITEM_NAME: { prop: 'ITEM_NAME', type: String, required: true },
    ENTP_SEQ: { prop: 'ENTP_SEQ', type: String, required: true },
    ENTP_NAME: { prop: 'ENTP_NAME', type: String, required: true },
    CHARTN: { prop: 'CHARTN', type: String, required: true },
    ITEM_IMAGE: { prop: 'ITEM_IMAGE', type: String },
    PRINT_FRONT: { prop: 'PRINT_FRONT', type: String },
    PRINT_BACK: { prop: 'PRINT_BACK', type: String },
    DRUG_SHAPE: { prop: 'DRUG_SHAPE', type: String, required: true },
    COLOR_CLASS1: { prop: 'COLOR_CLASS1', type: String, required: true },
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
  const excelJson = await getJsonFromExcelFile(schema, 'res/pill_recognition/');
  await requestUpdatePillRecognitionDatas(excelJson);
}

module.exports = {
  getRecognitionDataForSearch,
  requestUpdatePillRecognitionDatas,
  initPillRecognitionData,
};
