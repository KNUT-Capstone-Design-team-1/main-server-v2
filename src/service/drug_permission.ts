import { DrugPermissionDataModel } from '../schema';
import { TResourceMapper } from '../type/common';
import { TDrugPermissionData } from '../type/drug_permission';
import { TSearchQueryOption } from '../type/pill_search';
import { generateQueryFilterForPillSearch, logger } from '../util';

/**
 * 식별 검색을 위한 의약품 허가 정보 조회
 * @param where 검색할 데이터
 * @param option 검색 옵션
 * @returns
 */
async function getPermissionDataForSearch(
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
async function requestUpdateDrugPermissionDatas(datas: Partial<TDrugPermissionData>[]) {
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
function getDrugPermissionResourceMapper() {
  const mapper = {
    ITEM_SEQ: { colunmOfResource: '품목일련번호', required: true },
    ITEM_NAME: { colunmOfResource: '품목명', required: true },
    ENTP_NAME: { colunmOfResource: '업체명', required: true },
    ITEM_PERMIT_DATE: { colunmOfResource: '허가일자' },
    CNSGN_MANUF: { colunmOfResource: '위탁제조업체' },
    ETC_OTC_CODE: { colunmOfResource: '전문일반' },
    CHART: { colunmOfResource: '성상' },
    BAR_CODE: { colunmOfResource: '표준코드' },
    MATERIAL_NAME: { colunmOfResource: '원료성분' },
    EE_DOC_ID: { colunmOfResource: '효능효과' },
    UD_DOC_ID: { colunmOfResource: '용법용량' },
    NB_DOC_ID: { colunmOfResource: '주의사항' },
    INSERT_FILE: { colunmOfResource: '첨부문서' },
    VALID_TERM: { colunmOfResource: '유효기간' },
    STORAGE_METHOD: { colunmOfResource: '저장방법' },
    REEXAM_TARGET: { colunmOfResource: '재심사 대상' },
    REEXAM_DATE: { colunmOfResource: '재심사 기간' },
    PACK_UNIT: { colunmOfResource: '포장단위' },
    EDI_CODE: { colunmOfResource: '보험코드' },
    PERMIT_KIND: { colunmOfResource: '신고/허가 구분' },
    NARCOTIC_KIND: { colunmOfResource: '마약 종류 코드' },
    NEWDRUG_CLASS_NAME: { colunmOfResource: '신약' },
    INDUTY_TYPE: { colunmOfResource: '업종 구분' },
    MAIN_ITEM_INGR: { colunmOfResource: '주성분명' },
    INGR_NAME: { colunmOfResource: '첨가제명' },
  } as TResourceMapper;

  return mapper;
}

export {
  getPermissionDataForSearch,
  requestUpdateDrugPermissionDatas,
  getDrugPermissionResourceMapper,
};
