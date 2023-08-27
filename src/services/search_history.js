const { insertSearchHistory } = require('../queries');
const { logger } = require('../util');

/**
 * 검색 히스토리 저장
 * @param {string} searchType 검색 타입
 * @param {object} where 검색할 데이터
 */
async function writeSearchHistory(searchType, where) {
  try {
    await insertSearchHistory(searchType, where);
  } catch (e) {
    logger.error(
      '[SEARCH-HISTORY-SERVICE] Fail to insert search history.\nsearch type: %s\ndata: %s\n%s',
      searchType,
      JSON.stringify(where),
      e.stack || e
    );
  }
}

module.exports = {
  writeSearchHistory,
};
