const mongoose = require('mongoose');
const { logger } = require('../util');

/**
 * 데이터베이스 연결
 */
function connectOnDatabase() {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on('error', (e) => {
    logger.error(`[DATABASE] Database connection fail.\n${e}`);
    throw new Error(
      `데이터베이스 연결 오류 (DB_URL: ${process.env.DB_URL})${e}`
    );
  });

  db.once('open', () => {
    logger.info('[DATABASE] Database connection success');
  });
}

module.exports = {
  connectOnDatabase,
};
