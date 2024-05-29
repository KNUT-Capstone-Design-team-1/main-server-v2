import bodyParser from 'body-parser';
import { swaggerUi, specs } from '../../swagger';
import PillSearchAPI from './pill_search';
import AppInitialAPI from './app_initial';

import { Router } from 'express';

/**
 * 라우터를 초기화 한다
 * @param router 라우터
 */
export function init(router: Router) {
  router.use(bodyParser.urlencoded({ limit: '100mb', extended: false }));
  router.use(bodyParser.json({ limit: '100mb' }));

  // Swagger
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  // 알약 검색
  router.use('/pill-search', PillSearchAPI);

  // 애플리케이션 초기화 정보
  router.use('/app-initial', AppInitialAPI);
}
