const ConfigQuery = require('../queries/config');
const PillrecognitionQuery = require('../queries/pill_recognition_data');
const DrugPermissionQuery = require('../queries/drug_permission_data');

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
  PillrecognitionQuery.updatePillRecognitionData();
}

/**
 * 의약품 허가 정보 업데이트
 */
function updateDrugPermissionData() {
  DrugPermissionQuery.updateDrugPermissionData();
}

module.exports = {
  updateConfig,
  updatePillRecognitionData,
  updateDrugPermissionData,
};
