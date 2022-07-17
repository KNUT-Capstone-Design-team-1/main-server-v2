const axios = require('axios');
const ConfigQuery = require('../queries/config');
const { logger } = require('../util/logger');

async function getOverview() {
  try {
    const configs = (await ConfigQuery.readConfig(['overview']))[0].value;

    const result = await axios.get(
      `${configs.url}?serviceKey=${
        configs.encServiceKey
      }&trustEntpName=${encodeURI(
        '한미약품(주)'
      )}&pageNo=1&startPage=1&numOfRows=3`
    );

    console.log(result.data);
  } catch (e) {
    logger.error(`[RECOG-SERVICE] fail to get over view ${e}`);
  }
}

module.exports = {
  getOverview,
};
