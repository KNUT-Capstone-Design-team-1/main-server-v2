import express from 'express';
import {
  writeSearchHistory,
  searchPillRecognitionData,
  searchFromImage,
  searchDetail,
} from '../service';
import { TSearchQueryOption } from '../type/pill_search';

const router = express.Router();

// 식별 정보 검색 (개요 검색)
router.get('/recognition', async (req, res) => {
  writeSearchHistory('recognition', req.body);

  res.json(
    await searchPillRecognitionData(
      req.body,
      req.query as Partial<TSearchQueryOption>
    )
  );
});

// 이미지 검색
router.post('/image', async (req, res) => {
  writeSearchHistory('image', req.body);

  res.json(
    await searchFromImage(req.body, req.query as Partial<TSearchQueryOption>)
  );
});

// 상세 검색
router.get('/detail', async (req, res) => {
  writeSearchHistory('detail', req.body);

  res.json(await searchDetail(req.body));
});

export default router;
