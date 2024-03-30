import bodyParser from 'body-parser';
import { swaggerUi, specs } from '../../swagger';
import PillSearchApi from './pill_search';
import { Router } from 'express';

/**
 * 라우터를 초기화 한다
 * @param router 라우터
 */
export function init(router: Router) {
  router.use(bodyParser.urlencoded({ limit: '100mb', extended: false }));
  router.use(bodyParser.json({ limit: '100mb' }));

  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  router.use('/pill-search', PillSearchApi);
}
