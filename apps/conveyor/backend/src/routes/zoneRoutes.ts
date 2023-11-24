import { Router } from 'express';

import { Service } from '../service';
import { verifyToken } from './session';       //verifyToken
import { asyncWrapper } from './error';
import { ZoneInfoRow } from '../models/R301';
import { ZoneListRequest, ZoneListResponse } from '@package-backend/types';

const router: Router = Router();

/**
 * @swagger
 * /zone/zone-list:
 *   get:
 *     summary: 지역 목록 조회
 *     description: 사용 가능한 지역 목록과 관련 정보를 조회합니다.
 *     tags: [Zone Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 지역 목록과 세부 정보를 성공적으로 반환함.
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
 *             $ref: '#/components/schemas/IZoneInfoRow'
 *     IZoneInfoRow:
 *       type: object
 *       properties:
 *         No:
 *           type: number
 *           nullable: true
 *         ZoneID:
 *           type: number
 *           nullable: true
 *         DisplayName:
 *           type: string
 *           nullable: true
 *         PhysicalType:
 *           type: number
 *           nullable: true
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
    const [rows] = await Service.Inst.MySQL.query<ZoneInfoRow[]>('SELECT * FROM zoneInfo');

    res.json({
        message: "OK",
        data: {
            zones: rows
        }
    });
}));

export default router;
