const express = require('express');

const router = express.Router();
const PillRecognitionService = require('../services/pill_recognition');

// /pill-recognition
// 식별 정보 검색 - 개요 검색
router.get('/overview', async (req, res) => {
  const data = await PillRecognitionService.getOverview(req.body, req.query);
  res.json(data);
});

// 식별 정보 검색 / 이미지 검색 - 상세 검색
router.get('/detail', async (req, res) => {
  const data = await PillRecognitionService.getDetail(req.body, req.query);
  res.json(data);
});

// 이미지 검색 - 개요 검색
router.get('/image-search', async (req, res) => {
  const data = await PillRecognitionService.searchFromImage(req.query.imageId);
  res.json.data(data);
});

module.exports = router;
