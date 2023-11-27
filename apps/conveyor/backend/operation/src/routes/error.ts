import { Request, Response, NextFunction, RequestHandler } from 'express';
import { STResponse } from '@package-backend/types';
import logger from '../libs/logger';

// 비동기 함수를 위한 타입
type AsyncRequestHandler<TReq = unknown, TRes = unknown> = (req: Request<TReq>, res: Response<STResponse<TRes>>, next: NextFunction) => Promise<unknown>;

// 비동기 래퍼 함수
function asyncWrapper<TReq, TRes>(fn: AsyncRequestHandler<TReq, TRes>): RequestHandler {
    return (req, res, next) => {
        fn(req as Request<TReq>, res as Response<STResponse<TRes>>, next).catch(next);
    };
}

// 에러 핸들링 미들웨어
function errorHandler(err: Error, req: Request<unknown>, res: Response<STResponse<unknown>>, next : NextFunction) {
    let message = '';
    if (err instanceof Error) {
        message = err.message;
        logger.error(`${req.method} ${req.url} ${message}\n${err.stack}`);
        if (err === undefined) {
            next();
        }
    } else {
        message = 'Unknown error';
        logger.error(`${req.method} ${req.url} ${message} ${JSON.stringify(err, null, 2)}`);
    }
    res.json({ message: message });
}

export { asyncWrapper, errorHandler };
