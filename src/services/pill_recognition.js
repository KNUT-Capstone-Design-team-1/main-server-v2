const axios = require('axios');
const ConfigQuery = require('../queries/config');
const RecognitionQuery = require('../queries/pill_recognition');
const { logger } = require('../util/logger');

/**
 * 알약 식별 검색을 위한 API 호출
 * @param {string} searchType 검색타입 ex)
 * @param {array} itemSeqs 모양정보를 통해 DB에서 조회된 약의 식별번호 배열 ex) ['12345678', ...]
 * @returns
 */
async function callApiForRecogSearch(itemSeqs, searchOption) {
  try {
    // API URL 및 서비스키
    const { url, encServiceKey } = (
      await ConfigQuery.readConfig(['permit'])
    )[0];

    // 검색 옵션
    const { pageNo, numOfRows } = searchOption;

    let apiUrl = `${url}`;
    apiUrl += `?serviceKey=${encServiceKey}`;
    apiUrl += `&type=json`;
    apiUrl += `&pageNo=${pageNo}`;
    apiUrl += `&numOfRows=${numOfRows}`;

    const result = await axios({ method: 'get', url: apiUrl });
    // console.log('허가정보: ', result.data.body, '쿼리: ');

    return result.data.body.items;
  } catch (e) {
    logger.error(`[RECOG-SERVICE] fail to call api.\n${e}`);
    return [];
  }
}

/**
 * 식별 검색
 * @param {object} whereData DB 쿼리를 위한 데이터
 * @returns 알약 개요 정보
 */
async function searchPillRecognition(whereData, searchOption) {
  const entries = Object.entries(whereData);
  const operator = {};

  try {
    // DB 쿼리 조건
    const { $and, $or } = entries.reduce((acc, [key, value]) => {
      const condition = {};

      switch (key) {
        case 'ITEM_NAME':
          condition[key] = `/^${value}/`; // LIKE 검색
          acc.$and = [condition];
          return acc;
        default:
          condition[key] = value;
          acc.$or = [condition];
          return acc;
      }
    }, {});

    if (whereData.ITEM_NAME) {
      $and.push({ $or });
      operator.$and = $and;
    } else {
      operator.$or = $or;
    }

    // 1. DB Select 쿼리
    const queryResult = await RecognitionQuery.readRecognitionData(operator);

    if (queryResult.lengh === 0) {
      throw new Error('식별된 정보가 없습니다.');
    }

    const itemSeqs = queryResult.map(({ ITEM_SEQ }) => ITEM_SEQ);

    // 2. API 호출
    return callApiForRecogSearch('overview', itemSeqs, searchOption);
  } catch (e) {
    logger.error(`[RECOG-SERVICE] fail to get over view\n${e.stack}`);
    return {};
  }
}

/**
 * 이미지를 인식하는 딥러닝 서버로 이미지를 전달 후 개요 검색 수행
 * @param {string} imageId base64 이미지 코드
 * @returns 알약 개요 정보
 */
async function searchFromImage(imageId) {
  let recognizeResult;
  try {
    // 1. DL 서버 API 호출
    const configs = (await ConfigQuery.readConfig(['image-search']))[0].value;
    const url =
      process.env.NODE_ENV === 'production'
        ? configs['prod-url']
        : configs['dev-url'];

    recognizeResult = await axios({
      method: 'post',
      url,
      data: {
        img_base64: imageId,
      },
    });
  } catch (e) {
    logger.error(`[RECOG-SERVICE] fail to image Search ${e}`);
    return {};
  }

  console.log(recognizeResult?.data);

  // 2. API 호출
  return searchPillRecognition(recognizeResult?.data);
}

/**
 * 기존 앱과의 호환을 위해 유지하는 레거시 이미지 검색 함수
 * @param {string} imageId base64 이미지 코드
 * @returns 알약 개요 정보
 */
async function searchForLegacy(imageId) {
  const data = await searchFromImage(imageId);
  // data에 대해 레거시 형태로 반환
  return data;
}

module.exports = {
  searchPillRecognition,
  searchFromImage,
  searchForLegacy,
};
