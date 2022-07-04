const { ConfigModel } = require('../models/config');
const config = require('../config/config.json');

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
        { new: true, upsert: true },
      );
    });
  } catch (e) {
    throw new Error(e);
  }
}

updateConfig();

module.exports = {
  readConfig,
  updateConfig,
};
