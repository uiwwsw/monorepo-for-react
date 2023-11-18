import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { UserSession } from '@package-backend/types';

import { Service } from '../service';
import { UserRow } from '../models/R301';

// 인증 토큰 생성,,
const getToken = (session : UserSession ) => {
    return jwt.sign(session, Service.Inst.Prop.JWT.Secret, {
        expiresIn: Service.Inst.Prop.JWT.ExpiresIn
    });
}

// 인증 토큰 분석,,
const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['x-access-token'] as string || req.headers.authorization;

        if (!token) {
            //throw new Error('NEED_AUTH_TOKEN');
            return res.status(403).send('NEED_AUTH_TOKEN');
        }
    
        try {
            // 토큰 분석
            const decoded = jwt.verify(token, Service.Inst.Prop.JWT.Secret);
            const session = decoded as UserSession;
    
            // 세션 유효성 검사(중복 로그인 방지)
            const [rows] = await Service.Inst.MySQL.query<UserRow[]>('select grade from users where user_id = ? and session = ?', [session.user_id, session.key]);
            if (rows.length < 1) {
                return res.status(401).send('EXPIRED_SESSION');
            }
            const row = rows[0];
            if (row.grade !== session.grade as number) {
                return res.status(403).send('EXPIRED_SESSION');
            }
    
            res.locals.session = session;
        } catch (err) {
            return res.status(401).send('INVALID_AUTH_TOKEN');
        }
    
        return next();
    } catch (ex) {
        let message = '';
        if (ex instanceof Error) {
            message = ex.message;
        } else {
            message = (ex as object).toString();
        }
        res.json({
            message : message,
            data : null
        })
    }
}

export {
    getToken,
    verifyToken
}
