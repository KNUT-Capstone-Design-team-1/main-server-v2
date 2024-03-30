import fs from 'fs';
import { RESOURCE_PATH, logger } from '../util';
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

  const resourceUpdateInfos = [] as TResourceUpdateInfo[];

  for (const value of Object.values(RESOURCE_PATH)) {
    const files = fs.readdirSync(value);

    if (files.length === 0) {
      logger.info('[LOADER] %s is empty', value);
      break;
    }

    const mapper = {} as TResourceMapper;
    switch (value) {
      case RESOURCE_PATH.PILL_RECOGNITION:
        Object.assign(mapper, PillRecognitionService.getPillrecognitionResourceMapper());
        break;

      case RESOURCE_PATH.DRUG_PERMISSION:
        Object.assign(mapper, DrugPermissionService.getDrugPermissionResourceMapper());
        break;

      default:
        logger.warn('[LOADER] Wrong resource path %s', value);
    }

    const resourceUpdateInfo = {
      mapper,
      path: value as keyof typeof RESOURCE_PATH,
      fileList: files,
    } as TResourceUpdateInfo;

    resourceUpdateInfos.push(resourceUpdateInfo);
  }

  if (resourceUpdateInfos.length === 0) {
    return;
  }

  await convertResourceForDatabaseUpdate(resourceUpdateInfos);
}
