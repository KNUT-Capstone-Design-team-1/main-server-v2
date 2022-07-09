const mongoose = require('mongoose');

const PillRecognitionDataModel = mongoose.model(
  'PillRecognitionData',
  new mongoose.Schema(
    {
      name: {
        type: String,
        require: true,
        unique: true,
      },
      value: {
        type: Object,
        require: true,
      },
    },
    { collection: "PillRecognitionData" },
  ),
);

module.exports = {
  PillRecognitionDataModel,
};
