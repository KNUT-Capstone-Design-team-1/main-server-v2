const express = require('express');

const router = express.Router();
const { PillSearchService } = require('../services');
const { SearchHistoryQuery } = require('../queries');
const { logger } = require('../util');

/* /pill-search */

// 식별 정보 검색
router.get('/recognition', async (req, res) => {
  SearchHistoryQuery.insertSearchHistory('recognition', req.body).catch((e) => {
    logger.error(
      `[RECOGNITION-SEARCH-API] Fail to insert search history.\ndata: ${JSON.stringify(
        req.body
      )}\n${e.stack}`
    );
  });

  const data = await PillSearchService.searchRecognition(req.body, req.query);
  res.json(data);
});

// 이미지 검색
router.get('/image', async (req, res) => {
  SearchHistoryQuery.insertSearchHistory('image', req.body).catch((e) => {
    logger.error(
      `[IMAGE-SEARCH-API] Fail to insert search history.\ndata: ${JSON.stringify(
        req.body
      )}\n${e.stack}`
    );
  });

  const data = await PillSearchService.searchFromImage(req.query.imageId);
  res.json(data);
});

// 상세 검색
router.get('/detail', async (req, res) => {
  SearchHistoryQuery.insertSearchHistory('detail', req.body).catch((e) => {
    logger.error(
      `[DETAIL-SEARCH-API] Fail to insert search history.\ndata: ${JSON.stringify(
        req.body
      )}\n${e.stack}`
    );
  });

  const data = await PillSearchService.searchDetail(req.body);
  res.json(data);
});

module.exports = router;
