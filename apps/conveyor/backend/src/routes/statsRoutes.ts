import { Router } from 'express';

import { Service } from '../service';
import { verifyToken } from './session';       //verifyToken
import { asyncWrapper } from './error';
import { CountRow, TaskTransferInfoRow } from '../models/R301';
import { CarrierStatsRow, CarrierStatsInRequest, CarrierStatsResponse } from '@package-backend/types';

const router: Router = Router();

/**
 * @swagger
 * /stats/carrier-stats:
 *   post:
 *     summary: 반송 지표 요청
 *     description: 지정된 기간 동안의 반송 지표를 조회합니다.
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarrierStatsInRequest'
 *     responses:
 *       200:
 *         description: 반송 지표 데이터를 성공적으로 반환함.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseCarrierStatsResponse'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     CarrierStatsInRequest:
 *       type: object
 *       required:
 *         - start_time
 *         - end_time
 *         - page
 *       properties:
 *         start_time:
 *           type: string
 *           format: date-time
 *         end_time:
 *           type: string
 *           format: date-time
 *         page:
 *           type: number
 *         page_size:
 *           type: number
 *           default: 30
 *           nullable: true
 *         find_key:
 *           type: string
 *           nullable: true
 *     CarrierStatsRow:
 *       type: object
 *       properties:
 *         TaskID:
 *           type: number
 *           nullable: true
 *         ZoneIDTo:
 *           type: number
 *           nullable: true
 *         CommandID:
 *           type: string
 *           nullable: true
 *         CarrierID:
 *           type: string
 *           nullable: true
 *         ZoneIDFrom:
 *           type: number
 *           nullable: true
 *         StartTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         EndTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         ZoneIDToName:
 *           type: string
 *           nullable: true
 *         ZoneIDFromName:
 *           type: string
 *           nullable: true
 *     CarrierStatsResponse:
 *       type: object
 *       properties:
 *         rows:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CarrierStatsRow'
 *         total_count:
 *           type: number
 *     STResponseCarrierStatsResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/CarrierStatsResponse'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post('/carrier-stats', verifyToken, asyncWrapper<CarrierStatsInRequest, CarrierStatsResponse>(async (req, res) => {
    const { begin_date, end_date, page, page_size } = req.body;
    const sql = `SELECT No, TaskID, CarrierID, ZoneIDFrom, ZoneIDTo, StartTime, EndTime FROM tasktransferinfo where StartTime between ? and ? order by No desc limit ? offset ?`;
    const [rows] = await Service.Inst.MySQL.query<TaskTransferInfoRow[]>(sql, [begin_date, end_date, page_size || 30, (page_size || 30) * (page - 1)]);

    const sql2 = `SELECT count(1) as count FROM tasktransferinfo where StartTime between ? and ?`;
    const [total] = await Service.Inst.MySQL.query<CountRow[]>(sql2, [begin_date, end_date]);
    const total_count = total[0].count;

    const zones = Service.Inst.Zones;
    const data:CarrierStatsRow[] = [];
    rows.forEach((row) => {
        const from = zones.get(row.ZoneIDFrom);
        const to = zones.get(row.ZoneIDTo);
        data.push({
            TaskID : row.TaskID,
            ZoneIDTo : row.ZoneIDTo,
            CommandID : row.CommandID,
            CarrierID : row.CarrierID,
            ZoneIDFrom : row.ZoneIDFrom,
            StartTime : row.StartTime,
            EndTime : row.EndTime,
            ZoneIDToName : to ? to.DisplayName : '',
            ZoneIDFromName : from ? from.DisplayName : ''
        })
    });

    res.json({
        message: "OK",
        data: {
            total_count : total_count,
            rows : data
        }
    });
}));

export default router;
