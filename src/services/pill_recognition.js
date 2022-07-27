const axios = require('axios');
const ConfigQuery = require('../queries/config');
const RecognitionQuery = require('../queries/pill_recognition');
const { logger } = require('../util/logger');

/**
 * e약은요 API를 호출하여 알약의 개요 정보를 반환
 * @param {object} value DB 쿼리를 위한 데이터
 * @returns 알약 개요 정보
 */
async function getOverview(value) {
  try {
    // 1. DB Select 쿼리
    // const queryResult = await RecognitionQuery.readRecognitionData(value);

    // 2. API 호출
    const configs = (await ConfigQuery.readConfig(['overview']))[0].value;
    const url = `${configs.url}?serviceKey=${
      configs.encServiceKey
    }&trustEntpName=${encodeURI(
      '한미약품(주)'
    )}&pageNo=1&startPage=1&numOfRows=3&type=json`;

    const result = await axios({
      method: 'get',
      url,
    });

    // 3. 필요한 데이터 추출
    console.log('e약은요: ', result.data.body, '쿼리: ');
    return result.data.body;
  } catch (e) {
    logger.error(`[RECOG-SERVICE] fail to get over view ${e}`);
    return {};
  }
}

/**
 * 의약품 제품 허가 정보 API를 호출하여 알약의 상세 정보 반환
 * @param {object} value API 호출을 위한 데이터
 * @returns 알약 상세 정보
 */
async function getDetail(value) {
  try {
    // 1. API 호출
    const configs = (await ConfigQuery.readConfig(['detail']))[0].value;

    const url = `${configs.url}?serviceKey=${
      configs.encServiceKey
    }&trustEntpName=${encodeURI(
      '한미약품(주)'
    )}&pageNo=1&startPage=1&numOfRows=3&type=json`;

    const result = await axios({
      method: 'get',
      url,
    });

    // 2. 필요한 데이터만 추출
    console.log(value.itemSeq);
    return result;
  } catch (e) {
    logger.error(`[RECOG-SERVICE] fail to get detail ${e}`);
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
  return getOverview(recognizeResult?.data);
}

module.exports = {
  getOverview,
  getDetail,
  searchFromImage,
};
