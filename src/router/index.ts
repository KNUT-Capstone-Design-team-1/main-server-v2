import bodyParser from 'body-parser';
import { swaggerUi, specs } from '../../doc/swagger/swagger';
import PillSearchApi from './pill_search';
import { Router } from 'express';

/**
 * 라우터를 로드한다
 * @param app 라우터
 */
function loadRouter(app: Router) {
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: false }));
  app.use(bodyParser.json({ limit: '100mb' }));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  /**
   * @swagger
   * tags:
   *   name: pill search
   *   description: 알약 검색 API
   */
  app.use('/pill-search', PillSearchApi);
}

export { loadRouter };
