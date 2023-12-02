import express from 'express';
import { SearchHistoryService, PillSearchService } from '../service';
import { TSearchQueryOption } from '../type/pill_search';

const router = express.Router();

// 식별 정보 검색 (개요 검색)
router.get('/recognition', async (req, res) => {
  SearchHistoryService.writeSearchHistory('recognition', req.body);

  res.json(
    await PillSearchService.searchPillRecognitionData(
      req.body,
      req.query as Partial<TSearchQueryOption>
    )
  );
});

// 이미지 검색
router.post('/image', async (req, res) => {
  SearchHistoryService.writeSearchHistory('image', req.body);

  res.json(
    await PillSearchService.searchFromImage(req.body, req.query as Partial<TSearchQueryOption>)
  );
});

// 상세 검색
router.get('/detail', async (req, res) => {
  SearchHistoryService.writeSearchHistory('detail', req.body);

  res.json(await PillSearchService.searchDetail(req.body));
});

export default router;
