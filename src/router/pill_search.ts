import express from 'express';
import { SearchHistoryService, PillSearchService } from '../service';
import { TImageSearchParam, TPillDetailSearchParam, TSearchQueryOption } from '../type/pill_search';
import { TPillRecognitionData } from '../type/pill_recognition';

const router = express.Router();

/**
 * @swagger
 * paths:
 *   /pill-search/recognition:
 *     post:
 *       description: '사용자가 식별한 알약의 특징으로 알약의 정보를 검색'
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             $ref: '#/src/type/pill_recognition.ts'
 */
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
