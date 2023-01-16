const DrugPermissionDataModel = require('./drug_permission_data');
const PillRecognitionDataModel = require('./pill_recognition_data');
const SearchHistoryModel = require('./search_history');

module.exports = {
  ...DrugPermissionDataModel,
  ...PillRecognitionDataModel,
  ...SearchHistoryModel,
};
