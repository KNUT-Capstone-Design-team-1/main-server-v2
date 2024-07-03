import fs from 'fs';
import { Converter } from 'csvtojson/v2/Converter';
import xlsParser from 'simple-excel-to-json';
import iconvLite from 'iconv-lite';
import { logger } from './logger';

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
export async function convertExcelToJson(filePath: string) {
  const fileExtension = filePath.split('.').slice(-1)[0];

  const jsonDatas: object[] = [];

  switch (fileExtension) {
    case 'xlsx':
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
