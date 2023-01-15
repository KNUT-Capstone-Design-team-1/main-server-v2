const { logger } = require('../util');
const { DrugPermissionDataModel } = require('../models');

/**
 * 의약품 허가정보 업데이트
 * @param {Object} data 의약품 허가 정보
 */
async function updateDrugPermissionData(data) {
  try {
    await DrugPermissionDataModel.updateOne({ ITEM_SEQ: data.ITEM_SEQ }, data, {
      new: true,
      upsert: true,
    });
  } catch (e) {
    logger.error(
      `[UPDATE-PERM-DATA] Fail to update.\n${JSON.stringify(data)}.\n${e.stack}`
    );
  }
}

/**
 * 의약품 허가 정보를 검색하기 위한 데이터를 조회
 * @param {Object} value 검색하기 위한 연산자
 * @param {Integer} func 페이징 등 쿼리에 실행할 연산 ex) { skip: 0, limit: 10 }
 * @returns 쿼리 결과
 */
async function readDrugPermissionData(value, func) {
  const fileds = {
    ITEM_SEQ: 1,
    ITEM_PERMIT_DATE: 1,
    ETC_OTC_CODE: 1,
    MATRIAL_NAME: 1,
    STORAGE_NAME: 1,
    PACK_UNIT: 1,
    NARCOTIC_KIND_CODE: 1,
    NEWDRUG_CLASS_NAME: 1,
    TOTAL_CONTENT: 1,
    MAIN_ITEM_INGR: 1,
    INGR_NAME: 1,
  };

  const { skip, limit } = func;
  const result = await DrugPermissionDataModel.find(value, fileds)
    .skip(skip || 0)
    .limit(limit || 10);
  return result;
}

module.exports = {
  updateDrugPermissionData,
  readDrugPermissionData,
};
