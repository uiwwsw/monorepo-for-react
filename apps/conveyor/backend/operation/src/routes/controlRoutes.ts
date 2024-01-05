import { Router } from 'express';

import { Service } from '../service';
import { asyncWrapper } from './error';
import {
    ProcessingStateRequest, ProcessingStateResponse,
} from '@package-backend/types';
import { UserRow } from '../models/R301';
import * as MsgUtils from '../websocket/message';
import { verifyToken } from './session';       //verifyToken
import logger from '../libs/logger';

const router: Router = Router();

/**
 * @swagger
 * /control/processing-state/set:
 *   post:
 *     summary: 처리 상태 설정
 *     description: 사용자의 처리 상태를 설정합니다.
 *     tags: [Processing State]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProcessingStateRequest'
 *     responses:
 *       200:
 *         description: 처리 상태가 성공적으로 설정됨.
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     ProcessingStateRequest:
 *       type: object
 *       required:
 *         - password
 *         - state
 *       properties:
 *         password:
 *           type: string
 *           format: password
 *           description: 사용자 비밀번호 (MD5 해시).
 *         state:
 *           type: string
 *           description: 설정할 처리 상태. (1 Paused, 2 Auto)
 *     ProcessingStateResponse:
 *       type: object
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post('/processing-state/set', verifyToken, asyncWrapper<ProcessingStateRequest, ProcessingStateResponse>(async (req, res) => {
    const session = res.locals.session;
    const { password, state } = req.body;

    switch(state) {
        case '1':       // Paused
        case '2':       // Auto
            break;
        default:
            throw new Error('Invalid state');
    }

    const [rows] = await Service.Inst.MySQL.query<UserRow[]>('SELECT password FROM users WHERE user_id = ?', [session.user_id]);
    const user = rows[0];
    if (!user) {
        throw new Error('User not found');
    }
    if (user.password !== password) {
        throw new Error('Invalid password');
    }

    const zones = Service.Inst.Zones;
    const zoneState = state === '2' ? 'InService' : 'Offline';
    for (const pair of zones) {
        const zone = pair[1];
        if (zone.PhysicalType === 2 || zone.PhysicalType === 3) {
            Service.Inst.Redis.publish(`TCMCmdCh:${Math.floor(zone.ZoneID / 100)}`, MsgUtils.makeUimZoneStateChangeReq(zone.ZoneID, zoneState));
            logger.info(`processing-state/set. zone:${zone.ZoneID}, physicalType:${zone.PhysicalType}, state:${zoneState}`);
            await new Promise((resolve) => {
                setTimeout(resolve, 100);
            });
        }
    }

    await Service.Inst.Redis.hset('System:EquipmentState', 'ProcessingState2', state);

    if (state === '1') {
        Service.Inst.Redis.publish('FromUIMCh', MsgUtils.makeUimLocalPause());
    } else {
        Service.Inst.Redis.publish('FromUIMCh', MsgUtils.makeUimLocalResume());
    }

    res.json({
        message: "OK",
        data: {}
    });
}));

export default router;
