const { logger } = require('../util');
const { PillRecognitionDataModel } = require('../models');

/**
 * 알약 식별 정보를 업데이트
 * @param {Object} data 알약 식별 정보 데이터
 */
async function updatePillRecognitionData(data) {
  try {
    await PillRecognitionDataModel.updateOne(
      { ITEM_SEQ: data.ITEM_SEQ },
      data,
      { new: true, upsert: true }
    );
  } catch (e) {
    logger.error(
      `[UPDATE-RECOG-DATA] Fail to update.\n${JSON.stringify(data)}.\n${
        e.stack
      }`
    );
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
    CHARTIN: 1,
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
