import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import WebSocket from 'ws';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './etc/swaggerOptions';

import { Service } from './service';
import logger from './libs/logger';
import userRouter from './routes/userRoutes';
import zoneRouter from './routes/zoneRoutes';
import statsRouter from './routes/statsRoutes';
import { errorHandler } from './routes/error';

async function main() {
    await Service.Inst.ready();

    const prop = Service.Inst.Prop;

    const app = express();
    const server = http.createServer(app);

    morgan.token('message', (req: Request, res: Response) => {
        // 응답이 JSON 객체이고 username 속성을 가지고 있을 경우, 그 값을 반환합니다.
        const body = res.locals.body;
        return body?.message;
    });
    const logFormat = ':method :url :status :res[content-length] - :response-time ms :message';

    app.use(express.json());    // body-parser 기능 포함
    app.use(morgan(logFormat));
    app.use(cors());            // CORS 미들웨어 추가

    // 모든 요청에 대해 res.json 메서드를 오버라이드합니다.
    app.use((req, res, next) => {
        // 원래의 res.json 함수를 저장합니다.
        const originalJson = res.json;
        
        // res.json을 오버라이드합니다.
        res.json = function (body) {
            // res.locals에 본문을 저장합니다.
            res.locals.body = body;
            // 원래의 res.json 함수를 호출하여 응답을 보냅니다.
            return originalJson.call(this, body);
        };
    
        next();
    });

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // 라우터를 사용하여 '/api/users' 엔드포인트 설정
    app.use('/users', userRouter);
    app.use('/zone', zoneRouter);
    app.use('/stats', statsRouter);

    app.use(errorHandler);

    // WebSocket 서버 설정
    const wss = new WebSocket.Server({ server });
    wss.on('connection', (ws: WebSocket) => {
        logger.info('A new WebSocket connection has been established.');

        ws.on('message', (message: string) => {
            console.log(`recv: ${message}`);
        });
    
        ws.on('close', () => {
            logger.info('The WebSocket connection has been terminated.');
        });
    });

    server.listen(prop.PortNum, () => {
        logger.info(`Server running on http://localhost:${prop.PortNum}`);
    });
}

main();
