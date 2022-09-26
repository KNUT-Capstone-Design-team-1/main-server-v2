const { SearchHistoryModel } = require('../models');

/**
 * 검색 저장 INSERT 쿼리
 * @param {String} type 기능 타입 ex) recognition
 * @param {Object} data request로 보낸 데이터 ex) { ITEM_SEQ: ... }
 */
async function insertSearchHistory(type, data) {
  await SearchHistoryModel.create({
    type,
    data,
    date: new Date(),
  });
}

module.exports = {
  insertSearchHistory,
};
