import axios from 'axios';
import _ from 'lodash';

import { getRecognitionDataForSearch } from './pill_recognition';
import { getPermissionDataForSearch } from './drug_permission';
import { logger } from '../util';
import msg from '../../res/ko-KR.json';
import { TPillRecognitionData } from '../@types/pill_recognition';
import { TDrugPermissionData } from '../@types/drug_permission';
import {
  TDlServerData,
  TDlServerResponse,
  TImageSearchParam,
  TMergedPillSearchData,
  TPillDetailSearchParam,
  TSearchQueryOption,
  TPillSearchParam,
} from '../@types/pill_search';
import { TFuncReturn } from '../@types/common';
import { TPillPermissionDetailApiRes, TPillPermissionDetailData } from '../@types/pill_detail';

/**
 * 알약 식별 정보 및 허가 정보의 데이터를 병합
 * @param recognitionDatas
 * @param permissionDatas
 * @returns
 */
function mergePillData(
  recognitionDatas: Record<string, any>[],
  permissionDatas: Record<string, any>[]
) {
  const mergedData = recognitionDatas.map((recognition) =>
    _.merge(
      recognition,
      permissionDatas.find(({ ITEM_SEQ }) => ITEM_SEQ === recognition.ITEM_SEQ)
    )
  ) as (TPillRecognitionData & TDrugPermissionData)[];

  return mergedData;
}

/**
 * 식별 검색
 * @param param 검색 속성
 * @param option 쿼리 옵션
 * @returns
 */
export async function searchPillRecognitionData(
  param: TPillSearchParam,
  option?: Partial<TSearchQueryOption>
) {
  const result = { success: false } as TFuncReturn<TMergedPillSearchData[]>;

  try {
    // 낱알 식별 정보
    const recognitionDatas = await getRecognitionDataForSearch(param, option);

    if (recognitionDatas.length === 0) {
      result.message = msg['pill-search.error.no-data'];
      return result;
    }

    // 의약품 허가 정보
    const permissionDatas = await getPermissionDataForSearch(param);

    result.data = mergePillData(recognitionDatas, permissionDatas);

    result.success = true;

    return result;
  } catch (e) {
    logger.error(
      '[PILL-SEARCH-SERVICE] Fail to recognition search. param: %s. option: %s. %s',
      JSON.stringify(param),
      JSON.stringify(option),
      e.stack || e
    );

    result.message = msg['pill-search.error.general'];

    return result;
  }
}

/**
 * 딥러닝 서버에 이미지 인식 요청
 * @param base64 이미지의 base64 코드
 * @returns
 */
async function requestImageRecognitionDlServer(base64: string) {
  const result = { success: false } as TFuncReturn<TDlServerData>;

  try {
    const { DL_SERVER_ADDRESS, DL_SERVER_PORT, DL_SERVER_PILL_RECOGNITION_API_URL_PATH } =
      process.env;

    const dlServerRes = await axios.post<TDlServerResponse>(
      `${DL_SERVER_ADDRESS}:${DL_SERVER_PORT}/${DL_SERVER_PILL_RECOGNITION_API_URL_PATH}`,
      { base64 }
    );

    if (!dlServerRes?.data) {
      logger.error(
        '[PILL-SEARCH-SERVICE] Deeplearning server response data is not exist. response: %s',
        JSON.stringify(dlServerRes)
      );

      result.message = msg['pill-search.error.no-response'];

      return result;
    }

    const { success, data, message } = dlServerRes.data;

    if (!success) {
      const dlServerMessage = msg[message as keyof typeof msg];
      logger.error(
        '[PILL-SEARCH-SERVICE] Deeplearning server response fail. message: %s (%s), response: %s',
        dlServerMessage,
        message,
        JSON.stringify(dlServerRes)
      );
      result.message = dlServerMessage;
      return result;
    }

    if (!data || data.length === 0) {
      logger.error(
        '[PILL-SEARCH-SERVICE] Deeplearning server response data is not exist. response: %s',
        JSON.stringify(dlServerRes)
      );
      result.message = msg['pill-search.error.no-data'];
      return result;
    }

    result.data = data;
    result.success = true;

    return result;
  } catch (e) {
    logger.error(`[PILL-SEARCH-SERVICE] Fail to image recognition. %s`, e.stack || e);
    result.message = msg['pill-search.error.general'];
    return result;
  }
}

/**
 * 이미지를 인식하는 딥러닝 서버로 이미지를 전달 후 개요 검색 수행
 * @param image base64 이미지 코드
 * @param option 쿼리 옵션
 * @returns
 */
export async function searchFromImage(
  imageData: TImageSearchParam,
  option?: Partial<TSearchQueryOption>
) {
  const result = { success: false } as TFuncReturn<{
    pillInfoList: TMergedPillSearchData[];
  }>;

  // DL 서버 API 호출
  const dlServerRes = await requestImageRecognitionDlServer(imageData.base64);

  if (!dlServerRes.success) {
    return dlServerRes;
  }

  // DL 서버로 부터 받은 데이터를 기반으로 DB의 알약 식별 데이터를 조회
  const recogDataPromises = dlServerRes.data.map((recogData) =>
    searchPillRecognitionData(recogData, option)
  );

  const queryResults = await Promise.all(recogDataPromises);

  if (queryResults.some((v) => !v.success)) {
    result.message = msg['pill-search.error.get-recognition-data'];
    return result;
  }

  result.data = {
    pillInfoList: queryResults.map((v) => v.data).flat(),
  };
  result.success = true;

  return result;
}

/**
 * 알약에 대한 상세 검색 (의약품 허가 정보)
 * @param itemSeq API 호출을 위한 옵션인 알약 제품 일련 번호
 * @returns
 */
export async function searchDetail(itemSeq: TPillDetailSearchParam) {
  const result = { success: false } as TFuncReturn<Partial<TPillPermissionDetailData>[]>;

  try {
    // API URL 및 서비스키
    const detailSearchUrl =
      'http://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService04/getDrugPrdtPrmsnDtlInq03';
    const encServiceKey = process.env.ENC_SERVICE_KEY;

    const apiUrl = `${detailSearchUrl}?serviceKey=${encServiceKey}&type=json&item_seq=${itemSeq.ITEM_SEQ}&pageNo=1&numOfRows=20`;

    const response = await axios.get<TPillPermissionDetailApiRes>(apiUrl);

    const { ITEM_SEQ, EE_DOC_DATA, UD_DOC_DATA, NB_DOC_DATA } = response.data.body.items[0];

    result.data = [{ ITEM_SEQ, EE_DOC_DATA, UD_DOC_DATA, NB_DOC_DATA }];
    result.success = true;
  } catch (e) {
    logger.error('[PILL-SEARCH-SERVICE] Fail to call api. itemSeq: %s. %s', itemSeq, e.stack || e);

    result.message = msg['pill-search.error.general'];
  }
  return result;
}
