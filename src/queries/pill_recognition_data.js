const { PillRecognitionDataModel } = require('../models');

/**
 * 알약 식별 정보를 업데이트
 * @param {object} data 알약 식별 정보 데이터
 */
async function updatePillRecognitionData(data) {
  await PillRecognitionDataModel.updateOne({ ITEM_SEQ: data.ITEM_SEQ }, data, {
    new: true,
    upsert: true,
  });
}

/**
 * 알약 식별 정보를 검색하기 위한 데이터를 조회
 * @param {object} operation 검색 조건
 * @param {object} field 조회할 컬럼
 * @param {{skip: number, limit: number}} option 쿼리 옵션
 * @returns {object[]}
 */
function readPillRecognitionData(operation, field, option) {
  return PillRecognitionDataModel.find(operation, field)
    .skip(option?.skip || 0)
    .limit(option?.limit || 0);
}

module.exports = {
  updatePillRecognitionData,
  readPillRecognitionData,
};
