const xlsx = require('read-excel-file/node');
const { Converter } = require('csvtojson');
const path = require('path');
const fs = require('fs');
const { logger } = require('./logger');

/**
 * xlsx 파일의 데이터를 json 데이터로 변경
 * @param {string} filePath 파일명을 포함한 파일 경로
 * @param {object} schema json으로 바꿀 스키마
 * @returns json 배열
 */
async function xlsxToJson(filePath, schema) {
  try {
    const rows = xlsx(filePath, { schema });
    return rows;
  } catch (e) {
    logger.error(`[UTIL] xlsx file fail\n${e}`);
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
    const rows = new Converter().fromFile(filePath);
    return rows;
  } catch (e) {
    logger.error(`[UTIL] csv file fail\n${e}`);
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

  fs.readdir(dirPath, (err, fileList) => {
    if (err) {
      logger.error('[UTIL] Fail to read file [%s]', fileList);
      return;
    }

    fileList.forEach((file) => {
      switch (path.extname(file)) {
        case '.xlsx':
          result.xlsx.push(...xlsxToJson(`${dirPath}${file}`, schema));
          break;
        case '.csv':
          result.csv.push(...csvToJson(`${dirPath}${file}`));
          break;
        default:
          logger.warn(
            `[UTIL] None execute function extension: ${path.extname(file)}`
          );
      }
    });
  });

  logger.info(`[UTIL] File to json complete`);
  return result;
}

/**
 * DB 검색을 위한 or 연산자 생성
 * @param {object} data 조건이 될 데이터
 * @returns or 연산자
 */
async function generateOrOperator(data) {
  const entries = Object.entries(data);
  const operator = {};

  // DB 쿼리 조건
  const { $and, $or } = entries.reduce((acc, [key, value]) => {
    const condition = {};

    switch (key) {
      case 'COLOR_CLASS1':
      case 'COLOR_CLASS2':
      case 'PRINT_FRONT':
      case 'PRINT_BACK':
      case 'DRUG_SHAPE':
        condition[key] = `/${value}/`; // %LIKE% 검색
        acc.$and = [condition];
        return acc;
      default:
        condition[key] = value;
        acc.$or = [condition];
        return acc;
    }
  }, {});

  const likeSelectFields = [
    'COLOR_CLASS1',
    'COLOR_CLASS2',
    'PRINT_FRONT',
    'PRINT_BACK',
    'DRUG_SHAPE',
  ];

  const hasLikeSelectField = Number(
    Object.keys(data).find((v) => likeSelectFields.includes(v)).length
  );

  if (hasLikeSelectField) {
    $and.push({ $or });
    operator.$and = $and;
  } else {
    operator.$or = $or;
  }

  return operator;
}

module.exports = {
  distributeFromExtension,
  generateOrOperator,
};
