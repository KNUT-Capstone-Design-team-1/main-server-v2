const ConfigQuery = require('../queries/config');
const PillrecognitionQuery = require('../queries/pill_recognition_data');

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

module.exports = {
  updateConfig,
  updatePillRecognitionData,
};
