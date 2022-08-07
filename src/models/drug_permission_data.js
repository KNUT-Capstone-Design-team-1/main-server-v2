const mongoose = require('mongoose');

const DrugPermissionDataModel = mongoose.model(
  'DrugPermissionData',
  new mongoose.Schema(
    {
      ITEM_NAME: { type: String, require: true }, // 품목명
      ITEM_SEQ: { type: String, require: true, unique: true }, // 품목 일련 번호
      PERMIT_KIND_NAME: String, // 허가/신고 구분
      CANCEL_NAME: String, // 취소 상태
      CANCEL_DATE: String, // 취소 일자
      CHANGE_DATE: String, // 변경 일자
      ENTP_NAME: { type: String, require: true }, // 업체명
      ITEM_PERMIT_DATE: String, // 허가 일자
      ETC_OTC_CODE: String, // 전문 일반
      CHART: String, // 성상
      BAR_CODE: String, // 표준 코드
      MATRIAL_NAME: String, // 원료 성분
      EE_DOC_ID: String, // 효능 효과 URL
      UD_DOC_ID: String, // 용법 용량 URL
      NB_DOC_ID: String, // 주의사항 URL
      INSERT_FILE: String, // 첨부 문서 URL
      STRAGE_METHOD: String, // 저장 방법 URL
      VALID_TERM: String, // 유효 기간
      REEXAM_TARGET: String, // 재심사 대상
      REEXAM_DATE: String, // 재심사 기간
      PACK_UNIT: String, // 포장 단위
      EDI_CODE: String, // 보험 코드
      NARCOTIC_KIND_CODE: String, // 마약류 분류
      MAKE_MATRIAL_FLAG: String, // 완제 원료 구분
      NEWDRUG_CLASS_NAME: String, // 신약 여부
      GBN_NAME: String, // 변경 내용
      TOTAL_CONTENT: String, // 총량
      MAIN_ITEM_INGR: String, // 주성분명
      INGR_NAME: String, // 첨가제명
      ATC_CODE: String, // ATC 코드
      REGESTRANT_ID: String, // 등록자 ID
    },
    { collection: 'DrugPermissionData' }
  )
);

module.exports = {
  DrugPermissionDataModel,
};
