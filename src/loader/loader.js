const ConfigQuery = require('../queries/config');
const PillrecognitionQuery = require('../queries/pill_recognition');

const { logger } = require('../util/logger');

/**
 * 설정 데이터 로드
 */
async function updateConfig() {
  try {
    await ConfigQuery.updateConfig();
  } catch (e) {
    logger.error(`[LOADER] fail to update config\n${e}`);
  }
}

/**
 * Pill Recognition Data 로드
 */
async function readPillRecognitionData() {
  try {
    await PillrecognitionQuery.updateRecognitionData();
  } catch (e) {
    logger.error(`[LOADER] fail to update pill recognition data\n${e}`);
  }
}

module.exports = {
  updateConfig,
  readPillRecognitionData,
};
