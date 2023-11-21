import { Router } from 'express';

import { Service } from '../service';
import { verifyToken } from './session';       //verifyToken
import { asyncWrapper } from './error';
import { ZoneListRequest, ZoneListResponse } from '@package-backend/types';

const router: Router = Router();

/**
 * @swagger
 * /zone/zone-list:
 *   get:
 *     summary: 지역 목록 요청
 *     description: 시스템에서 사용 가능한 지역 목록을 조회합니다.
 *     tags: [Zone Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 지역 목록을 성공적으로 반환함.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseZoneListResponse'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     ZoneListResponse:
 *       type: object
 *       properties:
 *         zones:
 *           type: array
 *           items:
 *             type: string
 *     STResponseZoneListResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/ZoneListResponse'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/zone-list', verifyToken, asyncWrapper<ZoneListRequest, ZoneListResponse>(async (req, res) => {
    const keys = await Service.Inst.Zones.keys();

    const zones: string[] = [];
    for (const key of keys) {
        zones.push(`${key}`);
    }

    res.json({
        message: "OK",
        data: {
            zones: zones
        }
    });
}));

export default router;
