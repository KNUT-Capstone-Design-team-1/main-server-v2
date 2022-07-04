const winston = require('winston');
const WinstonDaily = require('winston-daily-rotate-file');

// logs 디렉터리 하위에 로그 파일 저장
const logDir = 'logs';
const { combine, timestamp, printf } = winston.format;

// 로그 포맷 정의
const logFormat = printf((info) => `${info.timestamp} ${info.level}: ${info.message}`);

/*
 * 로그레벨
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // info 레벨 로그를 저장할 파일 설정
    new WinstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: '%DATE%.log',
      maxFiles: 30, // 30일치 로그 파일 저장
      zippedArchive: true,
    }),

    // error 레벨 로그를 저장할 파일 설정
    new WinstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`, // error.log 파일은 /logs/error 하위에 저장
      filename: '%DATE%.error.log',
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

// Production 환경이 아닌 경우(dev 등)
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  );
}

module.exports = {
  logger,
};
