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
    logger.error(`[UTIL] Convert xlsx file fail\n${e.stack}`);
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
    logger.error(`[UTIL] Convert csv file fail\n${e.stack}`);
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
    logger.error(`[UTIL] Convert xls file fail\n${e.stack}`);
    return [];
  }
}

/**
 * 디렉터리 내의 파일 확장자에 따라 분기
 * @param {object} schema json으로 바꿀 스키마
 * @returns {object[]}
 */
async function getJsonFromExcelFile(schema, dirPath) {
  const result = { xlsx: [], csv: [], xls: [] };
  try {
    const fileList = await promiseFs.readdir(dirPath);

    for (const file of fileList) {
      switch (path.extname(file)) {
        case '.xlsx': {
          const xlsxJson = await convertXlsxToJson(`${dirPath}${file}`, schema);
          result.xlsx.push(...xlsxJson);
          break;
        }

        case '.csv': {
          const csvJson = await convertCsvToJson(`${dirPath}${file}`);
          result.csv.push(...csvJson);
          break;
        }

        case '.xls': {
          const xlsJson = await convertXlsToJson(`${dirPath}${file}`, schema);
          result.xls.push(...xlsJson);
          break;
        }

        default:
          logger.warn(
            `[UTIL] None execute function extension: ${path.extname(file)}`
          );
      }
    }

    logger.info(`[UTIL] File to json complete`);
    return result;
  } catch (e) {
    logger.error(`[UTIL] Fail to read File.\n${e.stack}`);
    return {};
  }
}

// 작업중
async function convertOctetStreamUrlToBase64() {
  const res = await axios({
    method: 'post',
    url: 'https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/1NTofcj34bb',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });

  fs.writeFileSync(
    './test.txt',
    Buffer.from(res.data, 'binary').toString('base64url')
  );
}

/**
 * 알약 정보 관련 DB 업데이트
 * @param {Object} excelJson 엑셀 파일에서 추출한 Json객체
 * @param {Function} upsertFunc DB에 업데이트 하기 위한 upsert 쿼리 함수
 */
async function updatePillData(excelJson, upsertFunc) {
  let excelJsonVar = excelJson;

  try {
    // 식별정보의 ITEM_IMAGE를 base64로 변환
    if (upsertFunc.name === 'recognitionDataUpsertFunc') {
      excelJsonVar =
        (await convertOctetStreamUrlToBase64(excelJsonVar)) || excelJsonVar;
    }

    for (const key of Object.keys(excelJsonVar)) {
      for (const value of excelJsonVar[key]) {
        await upsertFunc(value);
      }
    }
  } catch (e) {
    logger.error(`[QUERY] Fail to change file to json.\n${e.stack}`);
  }
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
  generateOperatorForRecognition,
  updatePillData,
};
