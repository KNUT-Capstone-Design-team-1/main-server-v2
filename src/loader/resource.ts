import fs from 'fs';
import { convertExcelToJson, logger } from '../util';
import { PillRecognitionService, DrugPermissionService } from '../services';

/**
 * 리소스 파일 목록을 조회한다
 * @param resourcePath 리소스 파일 경로
 * @returns
 */
function getResourceFileList(resourcePath: string): string[] {
  try {
    if (!fs.existsSync(resourcePath)) {
      logger.info('[RESOURCE] resource directory(%s) is not exist', resourcePath);
      return [];
    }

    const fileList = fs.readdirSync(resourcePath);

    if (fileList.length === 0) {
      logger.info('[RESOURCE] resource directory(%s) is empty', resourcePath);
    }

    return fileList;
  } catch (e) {
    logger.error(
      '[RESOURCE] Fail to get resource file datas. resource path: %s. %s',
      resourcePath,
      e.stack || e
    );

    return [];
  }
}

/**
 * 엑셀 파일 (xls, xlsx, csv) 데이터를 JSON 데이터로 변환
 * @param path 리소스 파일 경로
 * @param fileList 엑셀 파일 목록
 * @returns
 */
async function generateResourceUpdateData(
  path: string,
  fileList: string[]
) {
  try {
    const datas: object[] = [];

    for await (const file of fileList) {
      const jsonData = await convertExcelToJson(`${path}/${file}`);

      if (jsonData.length > 0) {
        datas.push(...jsonData);
      }
    }

    return datas;
  } catch (e) {
    logger.error(
      '[RESOURCE] Fail to convert excel to json. path: %s. file list: %s. %s',
      path,
      JSON.stringify(fileList),
      e.stack || e
    );

    return [];
  }
}

/**
 * 리소스 업데이트
 * @param path 리소스 경로
 * @param resourceDatas 리소스 데이터
 */
async function updateResource(path: string, resourceDatas: object[]) {
  try {
    const { PILL_RECOGNITION_RESOURCE_PATH, DRUG_PERMISSION_RESOURCE_PATH } = process.env;

    switch (path) {
      case PILL_RECOGNITION_RESOURCE_PATH:
        await PillRecognitionService.requestUpdatePillRecognitionDatas(resourceDatas);
        break;

      case DRUG_PERMISSION_RESOURCE_PATH:
        await DrugPermissionService.requestUpdateDrugPermissionDatas(resourceDatas);
        break;

      default:
        logger.warn('[RESOURCE] Wrong resource path (%s)', path);
    }
  } catch (e) {
    logger.error('[RESOURCE] Fail to update resource. path: %s, %s', path, e.stack || e);
  }
}

/**
 * 업데이트가 완료된 리소스 디렉터리 제거
 * @param path 리소스 디렉터리 경로
 */
function deleteUpdatedResourceDirectory(path: string) {
  try {
    fs.rmSync(path, { recursive: true, force: true });

    logger.info('[RESOURCE] delete updated resource %s', path);
  } catch (e) {
    logger.error('[RESOURCE] Fail to delete updated resource directory %s. %s', path, e.stack || e);
  }
}

/**
 * 리소스 파일로 부터 데이터베이스 업데이트
 */
export async function update() {
  logger.info('[RESOURCE] Update pill search data resource');

  const { PILL_RECOGNITION_RESOURCE_PATH, DRUG_PERMISSION_RESOURCE_PATH } = process.env;

  const paths: string[] = [
    PILL_RECOGNITION_RESOURCE_PATH as string,
    DRUG_PERMISSION_RESOURCE_PATH as string,
  ];

  let isUpdated = false;
  for await (const path of paths) {
    logger.info('[RESOURCE] try resource update for %s', path);

    const fileList = getResourceFileList(path);
    if (fileList.length === 0) {
      continue;
    }

    const resourceDatas = await generateResourceUpdateData(path, fileList);
    if (resourceDatas.length === 0) {
      continue;
    }

    await updateResource(path, resourceDatas);
    logger.info('[RESOURCE] Resource update complete for %s', path);
    isUpdated = true;

    deleteUpdatedResourceDirectory(path);
  }

  return isUpdated;
}
