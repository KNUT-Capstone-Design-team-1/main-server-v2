import express from 'express';
import { SearchHistoryService, PillSearchService } from '../service';
import { TSearchQueryOption } from '../type/pill_search';

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
 *             schema: {
 *               name: string,
 *             }
 *
 */
router.post('/recognition', async (req, res) => {
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
