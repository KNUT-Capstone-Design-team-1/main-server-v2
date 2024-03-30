import fs from 'fs';
import { logger } from '../util';
import { TResourceMapper } from '../@types/common';
import { PillRecognitionService, DrugPermissionService } from '../service';

/**
 * 엑셀 파일 (xls, xlsx, csv) 데이터를 JSON 데이터로 변환
 * @param convertInfo 파일 정보
 * @returns
 */
async function convertExcelToJson(mapper: TResourceMapper, path: string, fileList: string[]) {
  try {
    return {};
  } catch (e) {
    logger.error(
      '[LOADER] Fail to convert excel to json. resource mapper: %s. path: %s. file list: %s. %s',
      JSON.stringify(mapper),
      path,
      JSON.stringify(fileList),
      e.stack || e,
    );

    return null;
  }
}

/**
 * 리소스 파일 목록을 조회한다
 * @param resourcePath 리소스 파일 경로
 * @returns
 */
function getResourceFileList(resourcePath: string): string[] {
  try {
    if (!fs.existsSync(resourcePath)) {
      logger.info('[LOADER] resource directory(%s) is not exist', resourcePath);
      return [];
    }

    const fileList = fs.readdirSync(resourcePath);

    if (fileList.length === 0) {
      logger.info('[LOADER] resource directory(%s) is empty', resourcePath);
    }

    return fileList;
  } catch (e) {
    logger.error('[LOADER] Fail to get resource file datas. resource path: %s', resourcePath);
    return [];
  }
}

/**
 * 리소스 업데이트를 위한 mapper 생성
 * @param path 리소스 경로
 * @returns
 */
function generateResourceMapper(path: string): TResourceMapper | null {
  const { PILL_RECOGNITION_RESOURCE_PATH, DRUG_PERMISSION_RESOURCE_PATH } = process.env;

  switch (path) {
    case PILL_RECOGNITION_RESOURCE_PATH:
      return PillRecognitionService.getPillrecognitionResourceMapper();

    case DRUG_PERMISSION_RESOURCE_PATH:
      return DrugPermissionService.getDrugPermissionResourceMapper();

    default:
      logger.warn('[LOADER] Mapper is not exist for resource path (%s)', path);
      return null;
  }
}

/**
 * 리소스 파일로 부터 데이터베이스 업데이트
 */
export async function updateDatabaseFromResource() {
  logger.info('[LOADER] Update pill search data resource');

  const { PILL_RECOGNITION_RESOURCE_PATH, DRUG_PERMISSION_RESOURCE_PATH } = process.env;

  const paths: string[] = [
    PILL_RECOGNITION_RESOURCE_PATH as string,
    DRUG_PERMISSION_RESOURCE_PATH as string,
  ];

  for await (const path of paths) {
    const fileList = getResourceFileList(path);
    if (fileList.length === 0) {
      continue;
    }

    const mapper = generateResourceMapper(path);
    if (!mapper) {
      continue;
    }

    const jsonData = await convertExcelToJson(mapper, path, fileList);

    if (!jsonData) {
      continue;
    }
  }
}
