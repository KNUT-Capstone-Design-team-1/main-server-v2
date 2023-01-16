/* eslint-disable guard-for-in */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const xlsxParser = require('read-excel-file/node');
const csvParser = require('csvtojson');
const xlsParser = require('simple-excel-to-json');
const path = require('path');
const iconvLite = require('iconv-lite');
const promiseFs = require('node:fs/promises');
const fs = require('fs');
const { default: axios } = require('axios');
const { logger } = require('./logger');

/**
 * xlsx 파일의 데이터를 json 데이터로 변경
 * @param {string} filePath 파일명을 포함한 파일 경로
 * @param {object} schema json으로 바꿀 스키마
 * @returns {object}
 */
async function convertXlsxToJson(filePath, schema) {
  try {
    const { rows, err } = await xlsxParser(filePath, { schema });

    if (err) {
      logger.warn(`[UTIL] xlsx to json have error.[${filePath}]\n${err}`);
    }

    return rows;
  } catch (e) {
    logger.error(`[UTIL] Convert xlsx file fail(${filePath})\n${e.stack}`);
    return [];
  }
}

/**
 * csv 파일의 데이터를 json 데이터로 변경
 * @param {string} filePath 파일명을 포함한 파일 경로
 * @returns {object}
 */
async function convertCsvToJson(filePath) {
  const { Converter } = csvParser;
  try {
    const csvString = iconvLite.decode(fs.readFileSync(filePath), 'euc-kr');
    const rows = await new Converter().fromString(csvString);
    return rows;
  } catch (e) {
    logger.error(`[UTIL] Convert csv file fail(${filePath})\n${e.stack}`);
    return [];
  }
}

/**
 * xls 파일의 데이터를 json 데이터로 변경
 * @param {string} filePath 파일명을 포함한 파일 경로
 * @returns {object}
 */
async function convertXlsToJson(filePath) {
  try {
    const doc = xlsParser.parseXls2Json(filePath);
    return doc.flat();
  } catch (e) {
    logger.error(`[UTIL] Convert xls file fail(${filePath})\n${e.stack}`);
    return [];
  }
}

/**
 * 디렉터리 내의 파일 확장자에 따라 분기
 * @param {object} schema json으로 바꿀 스키마
 * @returns {object[]}
 */
async function getJsonFromExcelFile(schema, dirPath) {
  const result = [];
  let data;

  try {
    const fileList = await promiseFs.readdir(dirPath);

    for (const file of fileList) {
      const filName = path.extname(file);

      const convertFunction = {
        '.xlsx': convertXlsxToJson,
        '.csv': convertCsvToJson,
        '.xls': convertXlsToJson,
      }[filName];

      // .md의 경우 기본으로 들어있는 파일이기 때문에 로그로 표시하지 않는다.
      if (!convertFunction) {
        if (filName !== '.md') {
          logger.warn(
            `[GET-JSON-FROM-EXCEL-FILE] None execute function extension: ${filName}`
          );
        }
      } else {
        data = await convertFunction(`${dirPath}${file}`, schema);

        if (data) {
          result.push(...data);
        }
      }
    }
    return result;
  } catch (e) {
    logger.error(
      `[GET-JSON-FROM-EXCEL-FILE] Excel to read File(${dirPath}).\n${e.stack}`
    );
    return [];
  }
}

/**
 * octet-stream 형태의 url을 base64로 변경
 * @param {String} imageUrl base64 URL
 * @returns {String}
 */
async function convertOctetStreamUrlToBase64(imageUrl) {
  try {
    const res = await axios({
      method: 'post',
      url: imageUrl,
      headers: { 'Content-Type': 'application/download' },
      responseType: 'arrayBuffer',
      responseEncoding: 'binary',
    });

    return Buffer.from(res.data, 'binary').toString('base64');
  } catch (e) {
    logger.warn(
      `[CONVERT-OCTET-TO-BASE64] can not convert for '${imageUrl}'.\n${e.stack}`
    );
    return imageUrl;
  }
}

/**
 * 알약 식별 정보의 이미지를 octet-stream에서 base64로 변경한 객체 배열을 반환
 * @param {Obejct[]} excelJson
 * @returns {Object[]}
 */
async function convertPillImageUrl(excelJson) {
  const convertedDatas = [];

  for (const data of excelJson) {
    if (data.ITEM_IMAGE) {
      await convertedDatas.push({
        ...data,
        ITEM_IMAGE:
          (await convertOctetStreamUrlToBase64(data.ITEM_IMAGE)) ||
          data.ITEM_IMAGE,
      });
    }
  }

  return convertedDatas;
}

/**
 * DB 검색을 위한 or 연산자 생성
 * @param {Object} data 조건이 될 데이터
 * @returns or 연산자
 */
async function generateOperatorForRecognition(data) {
  const entries = Object.entries(data);

  // DB 쿼리 조건
  const operator = entries.reduce((acc, [key, value]) => {
    const $and = [];
    const $or = [];

    switch (key) {
      case 'ITEM_NAME': {
        const condition = {};
        condition[key] = new RegExp(`${value}`);
        $and.push(condition);
        break;
      }

      case 'PRINT':
      case 'LINE': {
        const face = ['_FRONT', '_BACK'];

        face.forEach((f) => {
          const condition = {};
          condition[`${key}${f}`] = new RegExp(`${value}`);
          $or.push(condition);
        });

        $and.push({ $or });
        break;
      }

      case 'COLOR_CLASS': {
        const face = ['1', '2'];

        face.forEach((f) => {
          const condition = {};
          condition[`${key}${f}`] = new RegExp(`${value}`);
          $or.push(condition);
        });

        $and.push({ $or });
        break;
      }
      default: {
        const condition = {};
        condition[key] = `${value}`;
        $or.push(condition);
        $and.push({ $or });
      }
    }

    acc.$and = $and;
    return acc;
  }, {});

  return operator;
}

module.exports = {
  getJsonFromExcelFile,
  convertPillImageUrl,
  generateOperatorForRecognition,
};
