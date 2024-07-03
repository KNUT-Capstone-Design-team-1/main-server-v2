import { SearchHistoryModel } from '../schema';
import type { TSearchHistoryData } from '../@types/search_history';
import { logger } from '../util';

/**
 * 검색 히스토리 저장
 * @param searchType 검색 타입
 * @param where 검색할 데이터
 */
export async function writeSearchHistory(searchType: string, where: TSearchHistoryData) {
  try {
    await SearchHistoryModel.create({
      searchType,
      where,
      date: new Date(),
    });
  } catch (e) {
    logger.error(
      '[SEARCH-HISTORY-SERVICE] Fail to insert search history. search type: %s. data: %s. %s',
      searchType,
      JSON.stringify(where),
      e.stack || e
    );
  }
}
