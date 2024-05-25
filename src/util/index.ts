import { logger } from './logger';

export * from './logger';
export * from './excel_to_json';
export * from './pill_search';

/**
 * JSON 데이터를 안전하게 stringify
 * @param json json 데이터
 * @returns 
 */
export function saftyJsonStringify(json: Record<string, any>) {
  try {
    const stringifyJson = JSON.stringify(json);
    return stringifyJson;
  } catch (e) {
    logger.error('[UTIL] Fail to safty json stringify. json: %s. %s', json, e.stack || e);
    return json;
  }
}
