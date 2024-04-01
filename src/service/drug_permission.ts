import { DrugPermissionDataModel } from '../schema';
import { TDrugPermissionData } from '../@types/drug_permission';
import { TSearchQueryOption, TPillSearchParam } from '../@types/pill_search';
import { logger } from '../util';
import { generateQueryFilter } from '../util';

/**
 * 식별 검색을 위한 의약품 허가 정보 조회
 * @param param 검색 속성
 * @param option 검색 옵션
 * @returns
 */
export async function getPermissionDataForSearch(
  param: TPillSearchParam,
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

  const findQuery = await generateQueryFilter(param);

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
    for await (const data of datas) {
      await DrugPermissionDataModel.updateOne({ ITEM_SEQ: data.ITEM_SEQ }, data, {
        new: true,
        upsert: true,
      });
    }
  } catch (e) {
    logger.error('[DRUG-PERMISSION-SERVICE] Fail to update datas. %s', e.stack || e);
  }
}
