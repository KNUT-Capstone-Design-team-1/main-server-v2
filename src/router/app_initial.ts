import express from 'express';
import { AppInitialService } from '../service';

const router = express.Router();

/**
 * 데이터베이스 업데이트 날짜 조회
 */
router.get('/db-update-date', async (_req, res) => {
  const DBUpdateDateInfo = await AppInitialService.readDBUpdateDate();

  res.json(DBUpdateDateInfo);
});

export default router;
