const { SearchHistoryModel } = require('../models');

/**
 * 검색 저장 INSERT 쿼리
 * @param {string} searchType 검색 타입
 * @param {object} where 검색할 데이터
 */
async function insertSearchHistory(searchType, where) {
  await SearchHistoryModel.create({
    searchType,
    where,
    date: new Date(),
  });
}

module.exports = {
  insertSearchHistory,
};
