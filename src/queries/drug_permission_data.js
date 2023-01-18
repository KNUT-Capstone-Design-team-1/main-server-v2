const { DrugPermissionDataModel } = require('../models');

/**
 * 의약품 허가정보 업데이트
 * @param {object} data 의약품 허가 정보
 */
async function updateDrugPermissionData(data) {
  await DrugPermissionDataModel.updateOne({ ITEM_SEQ: data.ITEM_SEQ }, data, {
    new: true,
    upsert: true,
  });
}

/**
 * 의약품 허가 정보를 검색하기 위한 데이터를 조회
 * @param {object} operation 검색 조건
 * @param {object} field 조회할 컬럼
 * @param {{skip: number, limit: number}} option 쿼리 옵션
 * @returns {object[]}
 */
function readDrugPermissionData(operation, fieled, option) {
  return DrugPermissionDataModel.find(operation, fieled)
    .skip(option?.skip || 0)
    .limit(option?.limit || 0);
}

module.exports = {
  updateDrugPermissionData,
  readDrugPermissionData,
};
