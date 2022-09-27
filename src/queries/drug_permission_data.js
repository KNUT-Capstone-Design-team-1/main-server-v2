const { logger, distributeFromExtension } = require('../util');
const { DrugPermissionDataModel } = require('../models');

/**
 * 엑셀파일을 읽어 의약품 허가 정보 업데이트
 */
async function updateDrugPermissionData() {
  const schema = {
    품목명: { prop: 'ITEM_NAME', type: String, required: true },
    품목일련번호: { prop: 'ITEM_SEQ', type: String, required: true },
    '허가/신고구분': { prop: 'PERMIT_KIND_NAME', type: String },
    취소상태: { prop: 'CANCEL_NAME', type: String },
    취소일자: { prop: 'CANCEL_DATE', type: String },
    변경일자: { prop: 'CHANGE_DATE', type: String },
    업체명: { prop: 'ENTP_NAME', type: String, required: true },
    허가일자: { prop: 'ITEM_PERMIT_DATE', type: String },
    전문일반: { prop: 'ETC_OTC_CODE', type: String },
    성상: { prop: 'CHART', type: String },
    표준코드: { prop: 'BAR_CODE', type: String, required: true },
    원료성분: { prop: 'MATRIAL_NAME', type: String },
    효능효과: { prop: 'EE_DOC_ID', type: String },
    용법용량: { prop: 'UD_DOC_ID', type: String },
    주의사항: { prop: 'NB_DOC_ID', type: String },
    첨부문서: { prop: 'INSERT_FILE', type: String },
    저장방법: { prop: 'STRAGE_METHOD', type: String },
    유효기간: { prop: 'VALID_TERM', type: String },
    재심사대상: { prop: 'REEXAM_TARGET', type: String },
    재심사기간: { prop: 'REEXAM_DATE', type: String },
    포장단위: { prop: 'PACK_UNIT', type: String },
    보험코드: { prop: 'EDI_CODE', type: String },
    마약류분류: { prop: 'NARCOTIC_KIND_CODE', type: String },
    완제원료구분: { prop: 'MAKE_MATRIAL_FLAG', type: String },
    신약여부: { prop: 'NEWDRUG_CLASS_NAME', type: String },
    변경내용: { prop: 'GBN_NAME', type: String },
    총량: { prop: 'TOTAL_CONTENT', type: String },
    주성분명: { prop: 'MAIN_ITEM_INGR', type: String },
    첨가제명: { prop: 'INGR_NAME', type: String },
    ATC코드: { prop: 'ATC_CODE', type: String },
    등록자ID: { prop: 'REGESTRANT_ID', type: String },
  };

  const result = await distributeFromExtension(schema, 'res/drug_permission/');

  const upsert = async (data) => {
    await DrugPermissionDataModel.updateOne({ ITEM_SEQ: data.ITEM_SEQ }, data, {
      new: true,
      upsert: true,
    });
  };

  try {
    if (result.xlsx.length > 0) {
      result.xlsx.forEach(async (data) => {
        await upsert(data);
      });
    }

    if (result.csv.length > 0) {
      result.csv.forEach(async (data) => {
        await upsert(data);
      });
    }
  } catch (e) {
    logger.error(`[PERMISSION-QUERY] Fail to change file to json.\n${e.stack}`);
  }
}

/**
 * 의약품 허가 정보를 검색하기 위한 데이터를 조회
 * @param {Object} value 검색하기 위한 연산자
 * @param {Integer} func 페이징 등 쿼리에 실행할 연산 ex) { skip: 0, limit: 10 }
 * @returns 쿼리 결과
 */
async function readDrugPermissionData(value, func) {
  const fileds = {
    ITEM_SEQ: 1,
    ITEM_PERMIT_DATE: 1,
    ETC_OTC_CODE: 1,
    MATRIAL_NAME: 1,
    STORAGE_NAME: 1,
    PACK_UNIT: 1,
    NARCOTIC_KIND_CODE: 1,
    NEWDRUG_CLASS_NAME: 1,
    TOTAL_CONTENT: 1,
    MAIN_ITEM_INGR: 1,
    INGR_NAME: 1,
  };

  const { skip, limit } = func;
  const result = await DrugPermissionDataModel.find(value, fileds)
    .skip(skip || 0)
    .limit(limit || 10);
  return result;
}

module.exports = {
  updateDrugPermissionData,
  readDrugPermissionData,
};
