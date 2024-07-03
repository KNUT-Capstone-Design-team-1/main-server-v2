import mongoose from 'mongoose';

/**
 * 의약품 낱알식별정보 데이터 모델
 */
const PillRecognitionDataModel = mongoose.model(
  'PillRecognitionData',
  new mongoose.Schema(
    {
      ITEM_SEQ: { type: String, require: true, unique: true }, // 품목 일련 번호
      ITEM_NAME: { type: String, require: true }, // 품목명
      ENTP_SEQ: { type: String }, // 업체 일련 번호
      ENTP_NAME: { type: String, require: true }, // 업체명
      CHARTIN: { type: String }, // 제형
      ITEM_IMAGE: String, // 큰 제품 이미지
      PRINT_FRONT: String, // 글자 앞
      PRINT_BACK: String, // 글자 뒤
      DRUG_SHAPE: { type: String }, // 모양
      COLOR_CLASS1: { type: String }, // 색깔 (앞)
      COLOR_CLASS2: String, // 색깔 뒤
      LINE_FRONT: String, // 분할선 (앞)
      LINE_BACK: String, // 분할선 (뒤)
      LENG_LONG: String, // 크기 (장축)
      LENG_SHORT: String, // 크기 (단축)
      THICK: String, // 두께
      IMG_REGIST_TS: String, // 약학 정보원 이미지 생성일
      CLASS_NO: String, // 분류 번호
      ETC_OTC_CODE: String, // 전문/일반
      ITEM_PERMIT_DATE: String, // 품목 허가 일자
      SHAPE_CODE: String, // 제형 코드
      MARK_CODE_FRONT_ANAL: String, // 마크 내용 (앞)
      MARK_CODE_BACK_ANAL: String, // 마크 내용 (뒤)
      MARK_CODE_FRONT_IMG: String, // 마크 이미지 (앞)
      MARK_CODE_BACK_IMG: String, // 마크 이미지 (뒤)
      ITEM_ENG_NAME: String, // 제품 영문명
      EDI_CODE: String, // 보험 코드
    },
    { collection: 'PillRecognitionData' }
  )
);

export default PillRecognitionDataModel;
