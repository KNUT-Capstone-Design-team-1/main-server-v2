const express = require('express');

const router = express.Router();
const PillRecognitionService = require('../services/pill_recognition');

// /pill-recognition
// 식별 정보 검색
router.get('/', async (req, res) => {
  const data = await PillRecognitionService.searchRecognition(
    req.body,
    req.query
  );
  res.json(data);
});

// 이미지 검색 - 개요 검색
router.get('/image-search', async (req, res) => {
  const data = await PillRecognitionService.searchFromImage(req.query.imageId);
  res.json.data(data);
});

// 이미지 검색 - 레거시
router.get('/image', async (req, res) => {
  const data = await PillRecognitionService.searchForLegacy(req.query.imageId);
  res.json.data(data);
});

module.exports = router;
