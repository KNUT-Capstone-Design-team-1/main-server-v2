const mongoose = require('mongoose');
const { logger } = require('../util');

/**
 * 데이터베이스 연결
 */
function connectOnDatabase() {
  const dbUrl =
    process.env.NODE_ENV === 'production'
      ? 'mongodb://wip-db:27017/whatispill'
      : 'mongodb://localhost:27017/whatispill';

  mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;

  db.on('error', (e) => {
    logger.error(`[DATABASE] Database connection fail.\n${e.stack}`);
    throw new Error(`데이터베이스 연결 오류`);
  });

  db.once('open', () => {
    logger.info('[DATABASE] Database connection success');
  });
}

module.exports = {
  connectOnDatabase,
};
