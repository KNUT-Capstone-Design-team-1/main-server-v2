const { ConfigModel } = require('../models/config');
const { logger } = require('../util/logger');
const config = require('../res/config.json');

async function readConfig(name) {
  try {
    return name ? ConfigModel.findOne({ name }) : ConfigModel.find({});
  } catch (e) {
    throw new Error(e);
  }
}

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
