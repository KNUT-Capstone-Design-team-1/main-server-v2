const mongoose = require('mongoose');

/**
 * 검색 저장 모델
 */
const SearchHistoryModel = mongoose.model(
  'SearchHistory',
  new mongoose.Schema(
    {
      type: { type: String, require: true },
      data: { type: Object, require: true },
      date: { type: Date, require: true },
    },
    { collection: 'SearchHistory' }
  )
);

module.exports = {
  SearchHistoryModel,
};
