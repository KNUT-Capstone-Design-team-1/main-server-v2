import { DrugPermissionDataModel } from '../schema';
import { TResourceSchema } from '../@types/common';
import { TDrugPermissionData } from '../@types/drug_permission';
import { TSearchQueryOption } from '../@types/pill_search';
import { logger } from '../util';
import { generateQueryFilterForPillSearch } from './util';

/**
 * 식별 검색을 위한 의약품 허가 정보 조회
 * @param where 검색할 데이터
 * @param option 검색 옵션
 * @returns
 */
export async function getPermissionDataForSearch(
  where: Partial<TDrugPermissionData>,
  option?: Partial<TSearchQueryOption>
) {
  // 조회할 컬럼
  const field = {
    ITEM_SEQ: 1,
    DRUG_SHAPE: 1,
    MAIN_ITEM_INGR: 1,
    INGR_NAME: 1,
    MATERIAL_NAME: 1,
    PACK_UNIT: 1,
    VALID_TERM: 1,
    STORAGE_METHOD: 1,
  };

  const { skip, limit } = option || {};

  const findQuery = await generateQueryFilterForPillSearch(where);

  const drugpermissionDatas = await DrugPermissionDataModel.find(findQuery, field)
    .skip(skip || 0)
    .limit(limit || 0);

  return drugpermissionDatas;
}

/**
 * DB에 여러 항목의 의약품 허가 정보 데이터 업데이트 요청
 * @param datas 의약품 허가정보 데이터 배열
 */
export async function requestUpdateDrugPermissionDatas(datas: Partial<TDrugPermissionData>[]) {
  if (datas.length === 0) {
    logger.warn(`[DRUG-PERMISSION-SERVICE] No data from excel file.`);
    return;
  }

  try {
    for (const data of datas) {
      await DrugPermissionDataModel.updateOne({ ITEM_SEQ: data.ITEM_SEQ }, data, {
        new: true,
        upsert: true,
      });
    }
  } catch (e) {
    logger.error('[DRUG-PERMISSION-SERVICE] Fail to update datas.\n%s', e.stack || e);
  }
}

/**
 * 엑셀파일을 읽어 의약품 허가 정보 초기화
 */
export function getDrugPermissionResourceSchema() {
  const mapper: TResourceSchema = {
    ITEM_SEQ: { prop: 'ITEM_SEQ', type: String, required: true },
    ITEM_NAME: { prop: 'ITEM_NAME', type: String, required: true },
    ENTP_NAME: { prop: 'ENTP_NAME', type: String, required: true },
    ITEM_PERMIT_DATE: { prop: 'ITEM_PERMIT_DATE', type: String },
    CNSGN_MANUF: { prop: 'CNSGN_MANUF', type: String },
    ETC_OTC_CODE: { prop: 'ETC_OTC_CODE', type: String },
    CHART: { prop: 'CHART', type: String },
    BAR_CODE: { prop: 'BAR_CODE', type: String },
    MATERIAL_NAME: { prop: 'MATERIAL_NAME', type: String },
    EE_DOC_ID: { prop: 'EE_DOC_ID', type: String },
    UD_DOC_ID: { prop: 'UD_DOC_ID', type: String },
    NB_DOC_ID: { prop: 'NB_DOC_ID', type: String },
    INSERT_FILE: { prop: 'INSERT_FILE', type: String },
    VALID_TERM: { prop: 'VALID_TERM', type: String },
    STORAGE_METHOD: { prop: 'STORAGE_METHOD', type: String },
    REEXAM_TARGET: { prop: 'REEXAM_TARGET', type: String },
    REEXAM_DATE: { prop: 'REEXAM_DATE', type: String },
    PACK_UNIT: { prop: 'PACK_UNIT', type: String },
    EDI_CODE: { prop: 'EDI_CODE', type: String },
    PERMIT_KIND: { prop: 'PERMIT_KIND', type: String },
    NARCOTIC_KIND: { prop: 'NARCOTIC_KIND', type: String },
    NEWDRUG_CLASS_NAME: { prop: 'NEWDRUG_CLASS_NAME', type: String },
    INDUTY_TYPE: { prop: 'INDUTY_TYPE', type: String },
    MAIN_ITEM_INGR: { prop: 'MAIN_ITEM_INGR', type: String },
    INGR_NAME: { prop: 'INGR_NAME', type: String },
  };

  return mapper;
}
