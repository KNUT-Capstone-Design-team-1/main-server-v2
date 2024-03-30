import fs from 'fs';
import { logger } from '../util';
import { TResourceMapper, TResourceUpdateInfo } from '../@types/common';
import { PillRecognitionService, DrugPermissionService } from '../service';

export async function convertResourceForDatabaseUpdate(resourceDatas: TResourceUpdateInfo[]) {
  logger.info('datas %s', resourceDatas);
}

/**
 * 리소스 파일로 부터 데이터베이스 업데이트
 */
export async function updateDatabaseFromResource() {
  logger.info('[LOADER] Update pill search data resource');

  const { PILL_RECOGNITION_RESOURCE_PATH, DRUG_PERMISSION_RESOURCE_PATH } = process.env;
  const paths: string[] = [PILL_RECOGNITION_RESOURCE_PATH as string, DRUG_PERMISSION_RESOURCE_PATH as string];

  const resourceUpdateInfos = [] as TResourceUpdateInfo[];

  for (const resourcePath of paths) {
    const files = fs.readdirSync(resourcePath);

    if (files.length === 0) {
      logger.info('[LOADER] %s is empty', resourcePath);
      break;
    }

    const mapper = {} as TResourceMapper;
    switch (resourcePath) {
      case PILL_RECOGNITION_RESOURCE_PATH:
        Object.assign(mapper, PillRecognitionService.getPillrecognitionResourceMapper());
        break;

      case DRUG_PERMISSION_RESOURCE_PATH:
        Object.assign(mapper, DrugPermissionService.getDrugPermissionResourceMapper());
        break;

      default:
        logger.warn('[LOADER] Wrong resource path %s', resourcePath);
    }

    const resourceUpdateInfo = {
      mapper,
      path: resourcePath,
      fileList: files,
    } as TResourceUpdateInfo;

    resourceUpdateInfos.push(resourceUpdateInfo);
  }

  if (resourceUpdateInfos.length === 0) {
    return;
  }

  await convertResourceForDatabaseUpdate(resourceUpdateInfos);
}
