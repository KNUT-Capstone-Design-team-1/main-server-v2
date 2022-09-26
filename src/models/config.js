const mongoose = require('mongoose');

/**
 * 구성 값 모델
 */
const ConfigModel = mongoose.model(
  'Config',
  new mongoose.Schema(
    {
      name: { type: String, require: true, unique: true },
      value: { type: Object, require: true },
    },
    { collection: 'Config' }
  )
);

module.exports = {
  ConfigModel,
};
