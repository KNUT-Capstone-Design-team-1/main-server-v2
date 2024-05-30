import axios from 'axios';
import { getRecognitionDataForSearch } from './pill_recognition';
import { getPermissionDataForSearch } from './drug_permission';
import { logger, mergePillData, saftyJsonStringify } from '../util';
import msg from '../../res/ko-KR.json';
import type {
  TDlServerData,
  TDlServerResponse,
  TMergedPillSearchData,
  TSearchQueryOption,
  TPillSearchParam,
} from '../@types/pill_search';
import type { TFuncReturn } from '../@types/common';

/**
 * 식별 검색
 * @param param 검색 속성
 * @param option 쿼리 옵션
 * @returns
 */
export async function searchPillRecognitionData(
  param: TPillSearchParam,
  option?: Partial<TSearchQueryOption>
): Promise<TFuncReturn<TMergedPillSearchData[]>> {
  try {
    const recognitionDatas = await getRecognitionDataForSearch(param, option);

    if (recognitionDatas.length === 0) {
      return { success: false, message: msg['pill-search.error.no-data'] };
    }

    const permissionDatas = await getPermissionDataForSearch(param);

    return { success: true, data: mergePillData(recognitionDatas, permissionDatas) };
  } catch (e) {
    logger.error(
      '[PILL-SEARCH-SERVICE] Fail to recognition search. param: %s. option: %s. %s',
      JSON.stringify(param),
      JSON.stringify(option),
      e.stack || e
    );

    return { success: false, message: msg['pill-search.error.general'] };
  }
}

/**
 * 딥러닝 서버에 이미지 인식 요청
 * @param base64 이미지의 base64 코드
 * @returns
 */
async function requestImageRecognitionDlServer(
  base64: string
): Promise<TFuncReturn<TDlServerData>> {
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
        saftyJsonStringify(dlServerRes)
      );

      return { success: false, message: msg['pill-search.error.no-response'] };
    }

    const { success, data, message } = dlServerRes.data;

    if (!success) {
      const dlServerMessage = msg[message as keyof typeof msg];

      logger.error(
        '[PILL-SEARCH-SERVICE] Deeplearning server response fail. message: %s (%s), response: %s',
        dlServerMessage,
        message,
        saftyJsonStringify(dlServerRes)
      );

      return { success: false, message: dlServerMessage };
    }

    if (!data?.length) {
      logger.error(
        '[PILL-SEARCH-SERVICE] Deeplearning server response data is not exist. response: %s',
        saftyJsonStringify(dlServerRes)
      );

      return { success: false, message: msg['pill-search.error.no-data'] };
    }

    return { success: true, data };
  } catch (e) {
    logger.error(`[PILL-SEARCH-SERVICE] Fail to receive from DLserver. %s`, e.stack || e);

    return { success: false, message: `${msg['pill-search.error.general']}. ${e.stack || e}` };
  }
}

/**
 * 알약 촬영 검색
 * @param base64 base64 이미지 코드
 * @param option 쿼리 옵션
 * @returns
 */
export async function searchFromImage(
  base64: string,
  option?: Partial<TSearchQueryOption>
): Promise<TFuncReturn<{ pillInfoList: TMergedPillSearchData[] }>> {
  const { success, data, message } = await requestImageRecognitionDlServer(base64);

  if (!success) {
    return { success: false, message: message as string };
  }

  const recogResults: TFuncReturn<TMergedPillSearchData[]>[] = [];
  for await (const recogData of data as TDlServerData) {
    recogResults.push(await searchPillRecognitionData(recogData, option));
  }

  if (recogResults.some((v) => !v.success)) {
    return { success: false, message: msg['pill-search.error.get-recognition-data'] };
  }

  const pillInfoList: TMergedPillSearchData[] = [];

  recogResults.forEach((v) => {
    pillInfoList.push(...(v.data as TMergedPillSearchData[]));
  });

  return { success: true, data: { pillInfoList } };
}
