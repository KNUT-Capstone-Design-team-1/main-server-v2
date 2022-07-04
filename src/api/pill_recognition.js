const express = require('express');

const router = express();
const PillRecognitionService = require('../services/pill_recognition');

// /pill-recognition

router.get('/', async (_req, res) => {
  const videoList = await PillRecognitionService.recognizePill();
  res.json(videoList);
});

module.exports = router;
