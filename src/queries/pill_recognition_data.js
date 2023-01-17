const { PillRecognitionDataModel } = require('../models');

/**
 * 알약 식별 정보를 업데이트
 * @param {Object} data 알약 식별 정보 데이터
 */
async function updatePillRecognitionData(data) {
  await PillRecognitionDataModel.updateOne({ ITEM_SEQ: data.ITEM_SEQ }, data, {
    new: true,
    upsert: true,
  });
}

/**
 * 알약 식별 정보를 검색하기 위한 데이터를 조회
 * @param {Object} value 알약의 모양, 제형 등 외형 정보 ex) { PRINT: "...", ... }
 * @param {Object} fileds 조회할 컬럼
 * @param {Integer} func 페이징 등 쿼리에 실행할 연산 ex) { skip: 0, limit: 10 }
 * @returns 쿼리 결과
 */
async function readPillRecognitionData(value, fileds, func) {
  const result = await PillRecognitionDataModel.find(value, fileds)
    .skip(func?.skip || 0)
    .limit(func?.limit || 10);
  return result;
}

module.exports = {
  updatePillRecognitionData,
  readPillRecognitionData,
};
