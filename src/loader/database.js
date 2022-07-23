const mongoose = require('mongoose');
const { logger } = require('../util/logger');

async function connectOnDatabase() {
  try {
    const dbUrl =
      process.env.NODE_ENV === 'production'
        ? 'mongodb://wip-db:27017/whatispill'
        : 'mongodb://localhost:27017/whatispill';

    const connectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    mongoose.connect(dbUrl, connectOptions);
    const db = mongoose.connection;

    db.on('error', (err) => {
      throw new Error(`데이터베이스 연결 오류 ${err}`);
    });

    db.once('open', () => {
      logger.info('데이터베이스 연결 성공');
    });
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = {
  connectOnDatabase,
};
