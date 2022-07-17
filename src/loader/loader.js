const ConfigQuery = require('../queries/config');
const PillrecognitionQuery = require('../queries/pill_recognition');

/**
 * 설정 데이터 로드
 */
async function updateConfig() {
  await ConfigQuery.updateConfig();
}

/**
 * Pill Recognition Data 로드
 */
async function updateRecognitionData() {
  await PillrecognitionQuery.updateRecognitionData();
}

module.exports = {
  updateConfig,
  updateRecognitionData,
};
