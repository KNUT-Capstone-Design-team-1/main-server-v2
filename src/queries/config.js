const { ConfigModel } = require('../models');
const config = require('../../res/config.json');

/**
 * 설정 데이터 조회
 * @param {Array} names 찾을 설정의 이름들 ex) ['url']
 * @returns {Array}
 */
async function readConfig(names) {
  const wheres = names ? { $or: names.map((v) => ({ name: v })) } : {};
  const result = (await ConfigModel.find(wheres)).map((v) => v?.value);
  return result;
}

/**
 * 설정 업데이트
 */
async function updateConfig() {
  const names = Object.keys(config);

  names.forEach(async (name) => {
    await ConfigModel.updateOne(
      { name },
      { name, value: config[name] },
      { new: true, upsert: true }
    );
  });
}

module.exports = {
  readConfig,
  updateConfig,
};
