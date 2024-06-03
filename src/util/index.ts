import { logger } from './logger';

export * from './logger';
export * from './excel_to_json';
export * from './pill_search';
export * from './config';

/**
 * JSON 데이터를 안전하게 stringify
 * @param json json 데이터
 * @returns
 */
export function saftyJsonStringify(json: Record<string, any>) {
  try {
    const cache: any[] = [];

    const stringifyJson = JSON.stringify(json, (key, value) => {
      if (cache.includes(value)) {
        return `[CIRCULAR-${key}]: ${value}`;
      }

      if (typeof value !== 'object' || value === null) {
        return value;
      }

      cache.push(value);
      return value;
    });

    return stringifyJson;
  } catch (e) {
    logger.error('[UTIL] Fail to safty json stringify. json: %s. %s', json, e.stack || e);

    return json;
  }
}
