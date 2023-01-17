const mongoose = require('mongoose');

/**
 * 의약품 허가 정보 모델
 */
const DrugPermissionDataModel = mongoose.model(
  'DrugPermissionData',
  new mongoose.Schema(
    {
      ITEM_SEQ: { type: String, require: true, unique: true }, // 품목 일련 번호
      ITEM_NAME: { type: String, require: true }, // 품목명
      ENTP_NAME: { type: String, require: true }, // 업체명
      ITEM_PERMIT_DATE: String, // 허가 일자
      CNSGN_MANUF: String, // 위탁제조업체
      CHART: String, // 성상
      MATERIAL_NAME: String, // 원료 성분
      EE_DOC_ID: String, // 효능 효과 URL
      UD_DOC_ID: String, // 용법 용량 URL
      NB_DOC_ID: String, // 주의사항 URL
      INSERT_FILE: String, // 첨부 문서 URL
      VALID_TERM: String, // 유효 기간
      STORAGE_METHOD: String, // 저장 방법
      PACK_UNIT: String, // 포장 단위
      MAIN_ITEM_INGR: String, // 주성분명
      INGR_NAME: String, // 첨가제명
    },
    { collection: 'DrugPermissionData' }
  )
);

module.exports = {
  DrugPermissionDataModel,
};
