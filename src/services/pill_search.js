/* eslint-disable camelcase */
const axios = require('axios');
const _ = require('lodash');

const { getRecognitionDataForSearch } = require('./pill_recognition');
const { getPermissionDataForSearch } = require('./drug_permission');
const { writeSearchHistory } = require('./search_history');
const { logger } = require('../util');
const msg = require('../../res/ko-KR.json');

/**
 * @type {import('../data_type/recog_search')}
 */

/**
 * 알약 식별 정보 및 허가 정보의 데이터를 병합
 * @param {object[]} recognitionDatas
 * @param {object[]} permissionDatas
 * @returns {object[]}
 */
function mergePillData(recognitionDatas, permissionDatas) {
  return recognitionDatas.map((recognition) =>
    _.merge(
      recognition,
      permissionDatas.find(({ ITEM_SEQ }) => ITEM_SEQ === recognition.ITEM_SEQ)
    )
  );
}

/**
 * 식별 검색
 * @param {RECOG_SEARCH_REQ_DATA} where 검색할 데이터
 * @param {{skip: number, limit: number}} option 쿼리 옵션
 * @returns {RESPONSE}
 */
async function searchPillRecognitionData(where, option) {
  const result = { isSuccess: false };

  try {
    // 낱알 식별 정보
    const recognitionDatas = await getRecognitionDataForSearch(where, option);

    if (recognitionDatas.length === 0) {
      result.message = msg['pill-search.error.no-data'];
      return result;
    }

    // 의약품 허가 정보
    const permissionDatas = await getPermissionDataForSearch({
      ITEM_SEQ: { $in: recognitionDatas.map(({ ITEM_SEQ }) => ITEM_SEQ) },
    });

    result.data = mergePillData(recognitionDatas, permissionDatas);
    result.isSuccess = true;
  } catch (e) {
    logger.error(
      '[PILL-SEARCH-SERVICE] Fail to recognition search.\nwhere: %s\noption: %s\n%s',
      JSON.stringify(where),
      JSON.stringify(option),
      e.stack || e
    );

    result.message = msg['pill-search.error.general'];
  }
  return result;
}

/**
 * 딥러닝 서버에 이미지 인식 요청
 * @param {string} base64Url 이미지의 base64 코드
 * @returns {RESPONSE}
 */
async function requestImageRecognitionDlServer(base64Url) {
  const result = { isSuccess: false };

  try {
    const { DL_SERVER_ADDR, DL_SERVER_PORT, DL_SERVER_IMG_RECOG_PATH } =
      process.env;

    const { data } = await axios({
      method: 'post',
      url: `${DL_SERVER_ADDR}:${DL_SERVER_PORT}/${DL_SERVER_IMG_RECOG_PATH}`,
      data: { img_base64: base64Url },
    });

    if (!data) {
      result.message = msg['pill-search.error.no-data'];
      return result;
    }

    const recogResult = JSON.parse(data);
    if (!recogResult.is_success) {
      logger.error(
        '[PILL-SEARCH-SERVICE] response: %s',
        JSON.stringify(recogResult)
      );

      // DL 서버에서 응답한 오류 메시지 반환
      result.message =
        msg[recogResult.message] || msg['pill-search.error.general'];
      return result;
    }

    result.data = recogResult.data;
    result.isSuccess = true;
  } catch (e) {
    logger.error(
      `[PILL-SEARCH-SERVICE] Fail to image recognition.\n%s`,
      e.stack || e
    );

    result.message = msg['pill-search.error.general'];
  }
  return result;
}

/**
 * 이미지를 인식하는 딥러닝 서버로 이미지를 전달 후 개요 검색 수행
 * @param {{base64Url: string}} image base64 이미지 코드
 * @param {{skip: number, limit: number}} option 쿼리 옵션
 * @returns {RESPONSE}
 */
async function searchFromImage(imageData, option) {
  const result = { isSuccess: false };

  // DL 서버 API 호출
  const dlServerRes = await requestImageRecognitionDlServer(
    imageData.base64Url
  );

  if (!dlServerRes.isSuccess) {
    result.message = dlServerRes.message;
    return result;
  }

  const { print, chartn, drug_shape, color_class, line_front } =
    dlServerRes.data[0];

  const where = {
    PRINT: print || '',
    CHARTN: chartn || '',
    DRUG_SHAPE: drug_shape || '',
    COLOR_CLASS: color_class || '',
    LINE: line_front || '',
  };

  // 알약 식별 데이터 조회
  const pillRecognition = await searchPillRecognitionData(where, option);

  if (!pillRecognition.isSuccess) {
    result.message = pillRecognition.message;
    return result;
  }

  result.data = { pillInfoList: pillRecognition.data, recogResult: where };
  result.isSuccess = true;

  return result;
}

/**
 * 알약에 대한 상세 검색 (의약품 허가 정보)
 * @param {string} itemSeq API 호출을 위한 옵션인 알약 제품 일련 번호
 * @returns {RESPONSE}
 */
async function searchDetail(itemSeq) {
  const result = { isSuccess: false };

  try {
    // API URL 및 서비스키
    const detailSearchUrl =
      'http://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService02/getDrugPrdtPrmsnDtlInq01';
    const decServiceKey = process.env.DEC_SERVICE_KEY;

    const apiUrl = `${detailSearchUrl}?serviceKey=${decServiceKey}&type=json&item_seq=${itemSeq.ITEM_SEQ}&pageNo=1&numOfRows=20`;

    const response = await axios({ method: 'get', url: apiUrl });

    const { ITEM_SEQ, EE_DOC_DATA, UD_DOC_DATA, NB_DOC_DATA } =
      response.data.body.items[0];

    result.data = [{ ITEM_SEQ, EE_DOC_DATA, UD_DOC_DATA, NB_DOC_DATA }];
    result.isSuccess = true;
  } catch (e) {
    logger.error(
      '[PILL-SEARCH-SERVICE] Fail to call api.\nitemSeq: %s\n%s',
      itemSeq,
      e.stack || e
    );

    result.message = msg['pill-search.error.general'];
  }
  return result;
}

module.exports = {
  writeSearchHistory,
  searchPillRecognitionData,
  searchFromImage,
  searchDetail,
};
