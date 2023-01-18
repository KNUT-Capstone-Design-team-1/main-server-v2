const express = require('express');
// /pill-search */
const router = express.Router();
const {
  writeSearchHistory,
  searchPillRecognitionData,
  searchFromImage,
  searchDetail,
} = require('../services');

// 식별 정보 검색 (개요 검색)
router.get('/recognition', async (req, res) => {
  writeSearchHistory('recognition', req.body);

  res.json(await searchPillRecognitionData(req.body, req.query));
});

// 이미지 검색
router.post('/image', async (req, res) => {
  writeSearchHistory('image', req.body);

  res.json(await searchFromImage(req.body, req.query));
});

// 상세 검색
router.get('/detail', async (req, res) => {
  writeSearchHistory('detail', req.body);

  res.json(await searchDetail(req.body));
});

module.exports = router;
