const { DrugPermissionDataModel } = require('../models');

/**
 * 의약품 허가정보 업데이트
 * @param {Object} data 의약품 허가 정보
 */
async function updateDrugPermissionData(data) {
  await DrugPermissionDataModel.updateOne({ ITEM_SEQ: data.ITEM_SEQ }, data, {
    new: true,
    upsert: true,
  });
}

/**
 * 의약품 허가 정보를 검색하기 위한 데이터를 조회
 * @param {Object} value 검색하기 위한 연산자
 * @param {Object} fileds 조회할 컬럼
 * @param {Integer} func 페이징 등 쿼리에 실행할 연산 ex) { skip: 0, limit: 10 }
 * @returns 쿼리 결과
 */
async function readDrugPermissionData(where, fileds, func) {
  const result = await DrugPermissionDataModel.find(where, fileds)
    .skip(func?.skip || 0)
    .limit(func?.limit || 10);
  return result;
}

module.exports = {
  updateDrugPermissionData,
  readDrugPermissionData,
};
