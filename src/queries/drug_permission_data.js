const { logger } = require('../util/logger');
const { DrugPermissionModel } = require('../models/drug_permission_data');
const { distributeFromExtension } = require('../util/util');

/**
 * 엑셀파일을 읽어 의약품 허가 정보 업데이트
 */
async function updateDrugPermissionData() {
  const schema = {
    ITEM_NAME: { prop: 'ITEM_NAME', type: String, required: true },
    ITEM_SEQ: { prop: 'ITEM_SEQ', type: String, required: true },
    PERMIT_KIND_NAME: { prop: 'PERMIT_KIND_NAME', type: String },
    CANCEL_NAME: { prop: 'CANCEL_NAME', type: String },
    CANCEL_DATE: { prop: 'CANCEL_DATE', type: String },
    CHANGE_DATE: { prop: 'CHANGE_DATE', type: String },
    ENTP_NAME: { prop: 'ENTP_NAME', type: String, required: true },
    ITEM_PERMIT_DATE: { prop: 'ITEM_PERMIT_DATE', type: String },
    ETC_OTC_CODE: { prop: 'ETC_OTC_CODE', type: String },
    CHART: { prop: 'CHART', type: String },
    BAR_CODE: { prop: 'BAR_CODE', type: String, required: true },
    MATRIAL_NAME: { prop: 'MATRIAL_NAME', type: String },
    EE_DOC_ID: { prop: 'EE_DOC_ID', type: String },
    UD_DOC_ID: { prop: 'UD_DOC_ID', type: String },
    NB_DOC_ID: { prop: 'NB_DOC_ID', type: String },
    INSERT_FILE: { prop: 'INSERT_FILE', type: String },
    STRAGE_METHOD: { prop: 'STRAGE_METHOD', type: String },
    VALID_TERM: { prop: 'VALID_TERM', type: String },
    REEXAM_TARGET: { prop: 'REEXAM_TARGET', type: String },
    REEXAM_DATA: { prop: 'REEXAM_DATA', type: String },
    PACK_UNIT: { prop: 'PACK_UNIT', type: String },
    EDI_CODE: { prop: 'EDI_CODE', type: String },
    NARCOTIC_KIND_CODE: { prop: 'NARCOTIC_KIND_CODE', type: String },
    MAKE_MATRIAL_FLAG: { prop: 'MAKE_MATRIAL_FLAG', type: String },
    NEWDRUG_CLASS_NAME: { prop: 'NEWDRUG_CLASS_NAME', type: String },
    GBN_NAME: { prop: 'GBN_NAME', type: String },
    TOTAL_CONTENT: { prop: 'TOTAL_CONTENT', type: String },
    MAIN_ITEM_INGR: { prop: 'MAIN_ITEM_INGR', type: String },
    INGR_NAME: { prop: 'INGR_NAME', type: String },
    ATC_CODE: { prop: 'ATC_CODE', type: String },
    REGESTRANT_ID: { prop: 'REGESTRANT_ID', type: String },
  };

  const result = await distributeFromExtension(schema, 'res/drug_permission');
  const upsert = async (data) => {
    await DrugPermissionModel.updateOne({ ITEM_SEQ: data.ITEM_SEQ }, data, {
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
    logger.error(
      `[PERMISSION-QUERY] Fail to change file to json.\n%s`,
      e.stack
    );
  }
}

/**
 * 의약품 허가 정보를 검색하기 위한 데이터를 조회
 * @param {object} value 검색하기 위한 연산자
 * @returns 쿼리 결과
 */
async function readDrugPermissionData(value) {
  const fileds =
    'ITEM_SEQ ITEM_PERMIT_DATE ETC_OTC_CODE CHART MATRIAL_NAME STORAGE_NAME PACK_UNIT NARCOTIC_KIND_CODE NEWDRUG_CLASS_NAME TOTAL_CONTENT MAIN_ITEM_INGR INGR_NAME';
  const result = await DrugPermissionModel.find(value).select(fileds);
  return result;
}

module.exports = {
  updateDrugPermissionData,
  readDrugPermissionData,
};
