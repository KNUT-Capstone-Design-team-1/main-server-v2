const { ConfigModel } = require('../models/config');
const { logger } = require('../util/logger');
const config = require('../res/config.json');

/**
 * 설정 데이터 조회
 * @param {array} names 찾을 설정의 이름들
 * @returns 설정 데이터
 */
async function readConfig(names) {
  if (names) {
    const wheres = names.map((v) => ({ name: v }));
    return ConfigModel.find({ $or: wheres });
  }
  return ConfigModel.find({});
}

/**
 * 설정 업데이트
 */
async function updateConfig() {
  try {
    const names = Object.keys(config);

    names.forEach(async (name) => {
      await ConfigModel.updateOne(
        { name },
        { name, value: config[name] },
        { new: true, upsert: true }
      );
    });
  } catch (e) {
    logger.error(`[LOADER] fail to update config\n${e}`);
  }
}

module.exports = {
  readConfig,
  updateConfig,
};
