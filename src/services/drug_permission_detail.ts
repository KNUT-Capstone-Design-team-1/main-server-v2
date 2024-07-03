import axios from 'axios';
import type { TDrugPermissionDetailApiRes } from '../@types/drug_permission_detail';
import { logger } from '../util';
import msg from '../../res/ko-KR.json';

/**
 * 알약 상세 조회에 필요한 환경변수가 존재하는지 확인
 * @returns
 */
function checkRequiredEnvironment() {
  const { DRUG_PRDT_PRMSN_INFO_SERVICE, GET_DRUG_PRDT_PRMSN_DTL_INQ, PERM_ENC_SERVICE_KEY } =
    process.env;

  if (!DRUG_PRDT_PRMSN_INFO_SERVICE || !GET_DRUG_PRDT_PRMSN_DTL_INQ || !PERM_ENC_SERVICE_KEY) {
    logger.error(
      '[DRUG-PERMISSION-DETAIL-SERVICE] Require environment net exist. DRUG_PRDT_PRMSN_INFO_SERVICE: %s, GET_DRUG_PRDT_PRMSN_DTL_INQ: %s, PERM_ENC_SERVICE_KEY: %s',
      DRUG_PRDT_PRMSN_INFO_SERVICE,
      GET_DRUG_PRDT_PRMSN_DTL_INQ,
      PERM_ENC_SERVICE_KEY
    );

    return false;
  }

  return true;
}

/**
 * 알약 상세 조회 API URL을 생성
 * @param itemSeq 조회할 알약 ID
 * @returns
 */
function generateUrl(itemSeq: string) {
  const { DRUG_PRDT_PRMSN_INFO_SERVICE, GET_DRUG_PRDT_PRMSN_DTL_INQ, PERM_ENC_SERVICE_KEY } =
    process.env;

  let apiUrl = `http://apis.data.go.kr/1471000`;
  apiUrl += `/${DRUG_PRDT_PRMSN_INFO_SERVICE}/${GET_DRUG_PRDT_PRMSN_DTL_INQ}`;
  apiUrl += `?serviceKey=${PERM_ENC_SERVICE_KEY}`;
  apiUrl += `&type=json&item_seq=${itemSeq}&pageNo=1&numOfRows=20`;

  return apiUrl;
}

/**
 * 알약 상세 조회 (의약품 허가 상세 정보 API)
 * @param itemSeq API 호출을 위한 옵션인 알약 제품 일련 번호
 * @returns
 */
export async function getDrugPermissionDetail(itemSeq: string) {
  try {
    if (!checkRequiredEnvironment()) {
      return { success: false, message: msg['pill-search.error.no-require-environment'] };
    }

    const apiUrl = generateUrl(itemSeq);

    const response = await axios.get<TDrugPermissionDetailApiRes>(apiUrl);

    if (!response?.data?.body?.items?.length) {
      logger.info(
        '[DRUG-PERMISSION-DETAIL-SERVICE] No data for detail search. item seq: %s',
        itemSeq
      );

      return { success: false, message: msg['pill-search.error.no-data'] };
    }

    const { ITEM_SEQ, EE_DOC_DATA, UD_DOC_DATA, NB_DOC_DATA } = response.data.body.items[0];

    return { success: true, data: [{ ITEM_SEQ, EE_DOC_DATA, UD_DOC_DATA, NB_DOC_DATA }] };
  } catch (e) {
    logger.error(
      '[DRUG-PERMISSION-DETAIL-SERVICE] Fail to call api. itemSeq: %s. %s',
      itemSeq,
      e.stack || e
    );

    return { success: false, message: msg['pill-search.error.general'] };
  }
}
