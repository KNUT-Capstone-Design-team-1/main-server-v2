import mongoose from 'mongoose';

/**
 * 완제 의약품 허가 상세 데이터 모델
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
      ETC_OTC_CODE: String, // 전문일반
      CHART: String, // 성상
      BAR_CODE: String, // 표준코드
      MATERIAL_NAME: String, // 원료 성분
      EE_DOC_ID: String, // 효능 효과 URL
      UD_DOC_ID: String, // 용법 용량 URL
      NB_DOC_ID: String, // 주의사항 URL
      INSERT_FILE: String, // 첨부 문서 URL
      VALID_TERM: String, // 유효 기간
      STORAGE_METHOD: String, // 저장 방법
      REEXAM_TARGET: String, // 재심사 대상
      REEXAM_DATE: String, // 재심사 기간
      PACK_UNIT: String, // 포장 단위
      EDI_CODE: String, // 보험 코드
      PERMIT_KIND: String, // 신고/허가구분
      ENTP_NO: String, // 업 허가 번호
      NARCOTIC_KIND: String, // 마약 종류 코드
      NEWDRUG_CLASS_NAME: String, // 신약
      INDUTY_TYPE: String, // 업종 구분
      MAIN_ITEM_INGR: String, // 주성분명
      INGR_NAME: String, // 첨가제명
    },
    { collection: 'DrugPermissionData' }
  )
);

export default DrugPermissionDataModel;
