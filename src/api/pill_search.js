const express = require('express');

const router = express.Router();
const PillRecognitionService = require('../services/pill_search');

/* /pill-search */

// 식별 정보 검색
router.get('/recognition', async (req, res) => {
  const data = await PillRecognitionService.searchRecognition(req.body);
  res.json(data);
});

// 이미지 검색
router.get('/image', async (req, res) => {
  const data = await PillRecognitionService.searchFromImage(req.query.imageId);
  res.json(data);
});

// 상세 검색
router.get('/detail', async (req, res) => {
  const data = await PillRecognitionService.searchDetail(req.body);
  res.json(data);
});

// 이미지 검색 - 레거시
router.get('/image', async (req, res) => {
  const data = await PillRecognitionService.searchLegacy(req.query.imageId);
  res.json(data);
});

module.exports = router;
