const {
  ConfigQuery,
  PillRecognitionDataQuery,
  DrugPermissionDataQuery,
} = require('../queries');

/**
 * 설정 데이터 업데이트
 */
function updateConfig() {
  ConfigQuery.updateConfig();
}

/**
 * 알약 식별 정보 업데이트
 */
function updatePillRecognitionData() {
  PillRecognitionDataQuery.updatePillRecognitionData();
}

/**
 * 의약품 허가 정보 업데이트
 */
function updateDrugPermissionData() {
  DrugPermissionDataQuery.updateDrugPermissionData();
}

module.exports = {
  updateConfig,
  updatePillRecognitionData,
  updateDrugPermissionData,
};
