const axios = require('axios');
const _ = require('lodash');
const ConfigQuery = require('../queries/config');
const PillRecognitionQuery = require('../queries/pill_recognition_data');
const DrugPermissionQuery = require('../queries/drug_permission_data');
const { logger } = require('../util/logger');
const { generateOperatorForRecognition } = require('../util/util');

/**
 * 식별 검색
 * @param {Object} whereData DB 쿼리를 위한 데이터 ex) { PRINT: '~~', CHRTIN: '~~', ... }
 * @param {Object} func 페이징 등 쿼리에 실행할 연산 ex) { skip: 0, limit: 10 }
 * @returns {Object}
 */
async function searchRecognition(whereData, func) {
  try {
    // DB 쿼리 조건
    const operatorForRecognition = await generateOperatorForRecognition(
      whereData
    );

    // 1. 알약 식별 정보 DB 쿼리
    const recognitionDatas = await PillRecognitionQuery.readPillRecognitionData(
      operatorForRecognition,
      func
    );

    if (recognitionDatas.lengh === 0) {
      throw new Error('식별된 정보가 없습니다.');
    }

    const operatorForPermission = {
      ITEM_SEQ: { $in: recognitionDatas.map(({ ITEM_SEQ }) => ITEM_SEQ) },
    };

    // 2. 알약 허가 정보 DB 쿼리
    const permissionDatas = await DrugPermissionQuery.readDrugPermissionData(
      operatorForPermission,
      func
    );

    // 3. 알약 식별 정보 및 허가 정보 쿼리 결과에 대해 항목마다 병합
    const result = recognitionDatas.map((recognitionData) => {
      const permissionData = permissionDatas.find(
        (v) => v.ITEM_SEQ === recognitionData.ITEM_SEQ
      );
      return _.merge(recognitionData, permissionData);
    });

    return { isSuccess: true, data: result };
  } catch (e) {
    logger.error(`[RECOG-SERVICE] fail to recognition search\n${e.stack}`);
    return { isSuccess: false, message: '식별 검색 중 오류가 발생 했습니다.' };
  }
}

/**
 * 이미지를 인식하는 딥러닝 서버로 이미지를 전달 후 개요 검색 수행
 * @param {string} imageId base64 이미지 코드
 * @returns {Object}
 */
async function searchFromImage(imageId) {
  let recognizeResult;

  try {
    // 1. DL 서버 API 호출
    const configs = (await ConfigQuery.readConfig(['image-search']))[0];

    const url =
      process.env.NODE_ENV === 'production'
        ? configs['prod-url']
        : configs['dev-url'];

    // { PRINT, DRUG_SHAPE }
    recognizeResult = await axios({
      method: 'post',
      url,
      data: { img_base64: imageId },
    });
  } catch (e) {
    logger.error(`[RECOG-SERVICE] fail to image search ${e}`);
    return {
      isSuccess: false,
      message: '이미지 검색 중 오류가 발생 했습니다.',
    };
  }

  // 2. 식별 검색 호출
  return searchRecognition(recognizeResult?.data);
}

/**
 * 알약에 대한 상세 검색 (의약품 허가 정보)
 * @param {string} itemSeq API 호출을 위한 옵션인 알약 제품 일련 번호
 * @returns 검색 결과 데이터
 */
async function searchDetail(itemSeq) {
  try {
    // API URL 및 서비스키
    const { url, encServiceKey } = (
      await ConfigQuery.readConfig(['detail-search'])
    )[0];

    let apiUrl = `${url}`;
    apiUrl += `?serviceKey=${encServiceKey}`;
    apiUrl += `&type=json`;
    apiUrl += `&item_seq=${itemSeq}`;

    const result = await axios({ method: 'get', url: apiUrl });

    return { isSuccess: true, data: result.data.body.items };
  } catch (e) {
    logger.error(`[RECOG-SERVICE] fail to call api.\n${e}`);
    return { isSuccess: false, message: '상세 검색 중 오류가 발생했습니다.' };
  }
}

module.exports = {
  searchRecognition,
  searchFromImage,
  searchDetail,
};
