/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { updateDrugPermissionData } = require('../queries');
const { logger, getJsonFromExcelFile } = require('../util');

/**
 * DB에 여러 항목의 의약품 허가 정보 데이터 업데이트 요청
 * @param {Object[]} datas 의약품 허가정보 데이터 배열
 */
async function requestUpdateDrugPermissionDatas(datas) {
  if (datas.length === 0) {
    logger.warn(`[REQ-UPDATE-DRUG-PERM-DATA] No data from excel file.`);
    return;
  }

  try {
    for (const data of datas) {
      await updateDrugPermissionData(data);
    }
  } catch (e) {
    logger.error(
      `[REQ-UPDATE-DRUG-PERM-DATA] Fail to update datas.\n${e.stack}`
    );
  }
}

/**
 * 엑셀파일을 읽어 의약품 허가 정보 초기화
 */
async function initDrugPermissionData() {
  const schema = {
    품목일련번호: { prop: 'ITEM_SEQ', type: String, required: true },
    품목명: { prop: 'ITEM_NAME', type: String, required: true },
    업체명: { prop: 'ENTP_NAME', type: String, required: true },
    허가일자: { prop: 'ITEM_PERMIT_DATE', type: String },
    위탁제조업체: { prop: 'CNSGN_MANUF', type: String },
    전문일반: { prop: 'ETC_OTC_CODE', type: String },
    성상: { prop: 'CHART', type: String },
    표준코드: { prop: 'BAR_CODE', type: String },
    원료성분: { prop: 'MATERIAL_NAME', type: String },
    효능효과: { prop: 'EE_DOC_ID', type: String },
    용법용량: { prop: 'UD_DOC_ID', type: String },
    주의사항: { prop: 'NB_DOC_ID', type: String },
    첨부문서: { prop: 'INSERT_FILE', type: String },
    유효기간: { prop: 'VALID_TERM', type: String },
    저장방법: { prop: 'STORAGE_METHOD', type: String },
    '재심사 대상': { prop: 'REEXAM_TARGET', type: String },
    '재심사 기간': { prop: 'REEXAM_DATE', type: String },
    포장단위: { prop: 'PACK_UNIT', type: String },
    보험코드: { prop: 'EDI_CODE', type: String },
    '신고/허가 구분': { prop: 'PERMIT_KIND', type: String },
    '마약 종류 코드': { prop: 'NARCOTIC_KIND', type: String },
    신약: { prop: 'NEWDRUG_CLASS_NAME', type: String },
    '업종 구분': { prop: 'INDUTY_TYPE', type: String },
    주성분명: { prop: 'MAIN_ITEM_INGR', type: String },
    첨가제명: { prop: 'INGR_NAME', type: String },
  };
  const excelJson = await getJsonFromExcelFile(schema, 'res/drug_permission/');
  await requestUpdateDrugPermissionDatas(excelJson);
}

module.exports = {
  requestUpdateDrugPermissionDatas,
  initDrugPermissionData,
};
