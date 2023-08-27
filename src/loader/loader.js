const {
  initPillRecognitionData,
  initDrugPermissionData,
} = require('../services');
const { logger } = require('../util');

/**
 * 알약 식별 정보 업데이트
 */
async function loadPillRecognitionData() {
  await initPillRecognitionData();
  logger.info('[LOADER] pill recognition data load complete');
}

/**
 * 의약품 허가 정보 업데이트
 */
async function loadDrugPermissionData() {
  await initDrugPermissionData();
  logger.info('[LOADER] drug permission data load complete');
}

module.exports = {
  loadPillRecognitionData,
  loadDrugPermissionData,
};
