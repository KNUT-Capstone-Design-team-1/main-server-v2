const mongoose = require('mongoose');

const ConfigModel = mongoose.model(
  'ConfigModel',
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
    { collection: 'Config' },
  ),
);

module.exports = {
  ConfigModel,
};
