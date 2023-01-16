const PillSearchService = require('./pill_search');
const DrugPermissionService = require('./drug_permission');
const PillRecognitionService = require('./pill_recognition');

module.exports = {
  ...PillSearchService,
  ...DrugPermissionService,
  ...PillRecognitionService,
};
