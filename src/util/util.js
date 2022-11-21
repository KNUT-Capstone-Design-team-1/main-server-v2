/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const xlsx = require('read-excel-file/node');
const { Converter } = require('csvtojson');
const path = require('path');
const fs = require('node:fs/promises');
const { logger } = require('./logger');

/**
 * xlsx 파일의 데이터를 json 데이터로 변경
 * @param {string} filePath 파일명을 포함한 파일 경로
 * @param {object} schema json으로 바꿀 스키마
 * @returns json 배열
 */
async function xlsxToJson(filePath, schema) {
  try {
    const { rows, err } = await xlsx(filePath, { schema });

    if (err) {
      logger.warn(`[UTIL] xlsx to json have error.[${filePath}]\n${err}`);
    }

    return rows;
  } catch (e) {
    logger.error(`[UTIL] xlsx file fail\n${e.stack}`);
    return [];
  }
}

/**
 * csv 파일의 데이터를 json 데이터로 변경
 * @param {string} filePath 파일명을 포함한 파일 경로
 * @returns json 배열
 */
async function csvToJson(filePath) {
  try {
    const rows = await new Converter().fromFile(filePath);
    return rows;
  } catch (e) {
    logger.error(`[UTIL] csv file fail\n${e.stack}`);
    return [];
  }
}

/**
 * 디렉터리 내의 파일 확장자에 따라 분기
 * @param {object} schema json으로 바꿀 스키마
 * @returns json으로 변경된 확장자 별 데이터
 */
async function distributeFromExtension(schema, dirPath) {
  const result = { xlsx: [], csv: [] };
  try {
    const fileList = await fs.readdir(dirPath);

    for (const file of fileList) {
      switch (path.extname(file)) {
        case '.xlsx': {
          const xlsxJson = await xlsxToJson(`${dirPath}${file}`, schema);
          result.xlsx.push(...xlsxJson);
          break;
        }
        case '.csv': {
          const csvJson = await csvToJson(`${dirPath}${file}`);
          result.csv.push(...csvJson);
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
  distributeFromExtension,
  generateOperatorForRecognition,
};
