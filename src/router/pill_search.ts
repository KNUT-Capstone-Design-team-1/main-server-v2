import express from 'express';
import { SearchHistoryService, PillSearchService } from '../service';
import {
  TImageSearchParam,
  TPillDetailSearchParam,
  TSearchQueryOption,
} from '../@types/pill_search';
import { TPillRecognitionData } from '../@types/pill_recognition';

const router = express.Router();

router.post('/recognition', async (req, res) => {
  SearchHistoryService.writeSearchHistory('recognition', req.body);

  res.json(
    await PillSearchService.searchPillRecognitionData(
      req.body as Partial<TPillRecognitionData>,
      req.query as Partial<TSearchQueryOption>
    )
  );
});

// 이미지 검색
router.post('/image', async (req, res) => {
  SearchHistoryService.writeSearchHistory('image', req.body);

  res.json(
    await PillSearchService.searchFromImage(
      req.body as TImageSearchParam,
      req.query as Partial<TSearchQueryOption>
    )
  );
});

// 상세 검색
router.get('/detail', async (req, res) => {
  SearchHistoryService.writeSearchHistory('detail', req.body);

  res.json(await PillSearchService.searchDetail(req.body as TPillDetailSearchParam));
});

export default router;
