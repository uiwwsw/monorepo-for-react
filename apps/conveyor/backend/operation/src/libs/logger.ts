import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// 로그 파일 설정
const transport = new DailyRotateFile({
  filename: 'logs/ds-%DATE%.log', // 로그 파일명 포맷
  datePattern: 'YYYY-MM-DD-HH', // 시간 단위로 로그 파일 생성
  maxSize: '20m', // 로그 파일의 최대 크기
  maxFiles: '7d', // 로그 파일 보관 기간 (7일)
  dirname: 'logs' // 로그 파일이 저장될 디렉터리
});

// 로거 인스턴스 생성
const logger = winston.createLogger({
  level: 'debug', // 최소 로그 레벨
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    transport
  ]
});

// 콘솔에도 로그를 기록하려면 다음 전송을 추가합니다.
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }));
}

export default logger;
