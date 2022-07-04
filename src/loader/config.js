const ConfigQuery = require('../queries/config');

const { logger } = require('../util/logger');

async function updateConfig() {
  try {
    await ConfigQuery.updateConfig();
  } catch (e) {
    logger.error(`[UPDATE-CONFIG-SERVICE] ${e}`);
  }
}

module.exports = {
  updateConfig,
};
