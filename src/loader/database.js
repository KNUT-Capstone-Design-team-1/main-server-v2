const mongoose = require('mongoose');
const { logger } = require('../util');

mongoose.set('strictQuery', true);

/**
 * 데이터베이스 연결
 */
function connectOnDatabase() {
  const { DB_URL } = process.env;

  mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection;
  db.on('error', (e) => {
    logger.error('[DATABASE] Database connection fail.\n%s', e.stack || e);
    throw e;
  });

  db.once('open', () => logger.info('[DATABASE] Database connection success'));
}

module.exports = {
  connectOnDatabase,
};
