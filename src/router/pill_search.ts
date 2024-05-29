import express from 'express';
import { SearchHistoryService, PillSearchService } from '../service';
import { TSearchQueryOption, TPillSearchParam } from '../@types/pill_search';

const router = express.Router();

/**
 * 식별 검색
 */
router.post('/recognition', async (req, res) => {
  SearchHistoryService.writeSearchHistory('recognition', req.body);

  res.json(
    await PillSearchService.searchPillRecognitionData(
      req.body as TPillSearchParam,
      req.query as Partial<TSearchQueryOption>
    )
  );
});

/**
 * 알약 촬영 검색
 */
router.post('/image', async (req, res) => {
  SearchHistoryService.writeSearchHistory('image', req.body);

  res.json(
    await PillSearchService.searchFromImage(
      req.body.base64 as string,
      req.query as Partial<TSearchQueryOption>
    )
  );
});

/**
 * 상세 조회
 */
router.post('/detail', async (req, res) => {
  SearchHistoryService.writeSearchHistory('detail', req.body);

  res.json(await PillSearchService.searchDetail(req.body.ITEM_SEQ as string));
});

export default router;
