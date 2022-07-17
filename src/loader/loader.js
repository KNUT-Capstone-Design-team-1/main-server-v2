const ConfigQuery = require('../queries/config');
const PillrecognitionQuery = require('../queries/pill_recognition');

/**
 * 설정 데이터 업데이트
 */
async function updateConfig() {
  await ConfigQuery.updateConfig();
}

/**
 * 알약 식별 정보 업데이트
 */
async function updateRecognitionData() {
  await PillrecognitionQuery.updateRecognitionData();
}

module.exports = {
  updateConfig,
  updateRecognitionData,
};
