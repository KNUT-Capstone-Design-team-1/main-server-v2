const { logger, distributeFromExtension } = require('../util');
const { PillRecognitionDataModel } = require('../models');

/**
 * 엑셀파일을 읽어 알약 식별 정보 업데이트
 */
async function updatePillRecognitionData() {
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

  const result = await distributeFromExtension(schema, 'res/pill_recognition/');

  const upsert = async (data) => {
    await PillRecognitionDataModel.updateOne(
      { ITEM_SEQ: data.ITEM_SEQ },
      data,
      {
        new: true,
        upsert: true,
      }
    );
  };

  try {
    if (result.xlsx.length > 0) {
      result.xlsx.forEach(async (data) => {
        await upsert(data);
      });
    }

    if (result.csv.length > 0) {
      result.csv.forEach(async (data) => {
        await upsert(data);
      });
    }
  } catch (e) {
    logger.error(`[QUERY] Fail to change file to json.\n${e.stack}`);
  }
}

/**
 * 알약 식별 정보를 검색하기 위한 데이터를 조회
 * @param {Object} value 알약의 모양, 제형 등 외형 정보 ex) { PRINT: "...", ... }
 * @param {Integer} func 페이징 등 쿼리에 실행할 연산 ex) { skip: 0, limit: 10 }
 * @returns 쿼리 결과
 */
async function readPillRecognitionData(value, func) {
  const fileds = {
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

  const { skip, limit } = func;
  const result = await PillRecognitionDataModel.find(value, fileds)
    .skip(skip || 0)
    .limit(limit || 10);
  return result;
}

module.exports = {
  updatePillRecognitionData,
  readPillRecognitionData,
};
