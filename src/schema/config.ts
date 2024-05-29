import mongoose from 'mongoose';

/**
 * 구성 모델
 */
const ConfigModel = mongoose.model(
  'Config',
  new mongoose.Schema(
    {
      id: { type: String, require: true, unique: true }, // ID
      value: { type: String, require: true }, // 값
      type: { type: String, require: true }, // 타입
    },
    { collection: 'Config' }
  )
);

export default ConfigModel;
