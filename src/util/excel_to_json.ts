import fs from 'fs';
import xlsxParser from 'read-excel-file/node';
import { Converter } from 'csvtojson/v2/Converter';
import xlsParser from 'simple-excel-to-json';
import iconvLite from 'iconv-lite';
import { TResourceSchema } from '../@types/common';
import { logger } from './logger';

/**
 * xlsx 파일을 JSON으로 변환
 * @param schema JSON 스키마
 * @param filePath 파일 경로
 * @returns
 */
async function convertXlsxToJson(schema: TResourceSchema, filePath: string) {
  const result = await xlsxParser(filePath, { schema });

  const { rows, errors } = result;

  if (errors.length > 0) {
    logger.warn(`[UTIL] xlsx to json have error. filePath: %s`, filePath);
  }

  return rows;
}

/**
 * xls 파일을 JSON으로 변환
 * @param filePath 파일 경로
 * @returns
 */
async function convertXlsToJson(filePath: string) {
  const doc: { flat: () => object[] } = xlsParser.parseXls2Json(filePath);

  const flattenDoc = doc.flat();

  return flattenDoc;
}

/**
 * csv 파일을 JSON으로 변환
 * @param filePath 파일 경로
 * @returns
 */
async function convertCsvToJson(filePath: string) {
  const csvString = iconvLite.decode(fs.readFileSync(filePath), 'euc-kr');

  const rows = await new Converter().fromString(csvString);

  return rows;
}

/**
 * 엑셀 파일 (xls, xlsx, csv) 데이터를 JSON 데이터로 변환
 * @param mapper JSON 변환을 위한 mapper
 * @param filePath 엑셀 파일 경로
 * @returns
 */
export async function convertExcelToJson(mapper: TResourceSchema, filePath: string) {
  const fileExtension = filePath.split('.').slice(-1)[0];

  const jsonDatas: object[] = [];

  switch (fileExtension) {
    case 'xlsx':
      jsonDatas.push(...(await convertXlsxToJson(mapper, filePath)));
      break;

    case 'xls':
      jsonDatas.push(...(await convertXlsToJson(filePath)));
      break;

    case 'csv':
      jsonDatas.push(...(await convertCsvToJson(filePath)));
      break;

    default:
      logger.warn('[EXCEL-TO-JSON] Wrong file extension %s', fileExtension);
      break;
  }

  return jsonDatas;
}
