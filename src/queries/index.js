const DrugPermissionDataQuery = require('./drug_permission_data');
const PillRecognitionDataQuery = require('./pill_recognition_data');
const SearchHistoryQuery = require('./search_history');
const DatabaseQuery = require('./database');

module.exports = {
  ...DrugPermissionDataQuery,
  ...PillRecognitionDataQuery,
  ...SearchHistoryQuery,
  ...DatabaseQuery,
};
