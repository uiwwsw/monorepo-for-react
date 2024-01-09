import { Router } from 'express';

import { Service } from '../service';
import { verifyToken } from './session';       //verifyToken
import { asyncWrapper } from './error';
import { CountRow, TaskTransferInfoRow, AlarminfoRow, WarningInfoRow, ZoneStatsRow } from '../models/R301';
import { 
    CarrierStatsRow, CarrierStatsInRequest, CarrierStatsResponse,
    AlarmStatsInRequest, AlarmStatsResponse,
    ZoneStatsInRequest, ZoneStatsResponse, ZoneStatsItem
} from '@package-backend/types';

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
    const { start_time, end_time, page, page_size } = req.body;
    const sql = `SELECT No, TaskID, CarrierID, ZoneIDFrom, ZoneIDTo, StartTime, EndTime FROM tasktransferinfo where StartTime between ? and ? order by No desc limit ? offset ?`;
    const [rows] = await Service.Inst.MySQL.query<TaskTransferInfoRow[]>(sql, [start_time, end_time, page_size || 30, (page_size || 30) * (page - 1)]);

    const sql2 = `SELECT count(1) as count FROM tasktransferinfo where StartTime between ? and ?`;
    const [total] = await Service.Inst.MySQL.query<CountRow[]>(sql2, [start_time, end_time]);
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


/**
 * @swagger
 * /stats/alarm-stats:
 *   post:
 *     summary: 알람 지표 요청
 *     description: 지정된 기간 동안의 알람 지표를 조회합니다.
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlarmStatsInRequest'
 *     responses:
 *       200:
 *         description: 알람 지표 데이터를 성공적으로 반환함.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseAlarmStatsResponse'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     AlarmStatsInRequest:
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
 *     IAlarminfoRow:
 *       type: object
 *       properties:
 *         No:
 *           type: number
 *           nullable: true
 *         SerialNo:
 *           type: number
 *           nullable: true
 *         AlarmCode:
 *           type: number
 *           nullable: true
 *         TaskID:
 *           type: number
 *           nullable: true
 *         Location:
 *           type: number
 *           nullable: true
 *         Reason:
 *           type: number
 *           nullable: true
 *         CommandID:
 *           type: string
 *           nullable: true
 *         TCMID:
 *           type: number
 *           nullable: true
 *         CarrierID:
 *           type: string
 *           nullable: true
 *         SetTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         ClearTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     AlarmStatsResponse:
 *       type: object
 *       properties:
 *         rows:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IAlarminfoRow'
 *         total_count:
 *           type: number
 *     STResponseAlarmStatsResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/AlarmStatsResponse'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post('/alarm-stats', verifyToken, asyncWrapper<AlarmStatsInRequest, AlarmStatsResponse>(async (req, res) => {
    const { start_time, end_time, page, page_size } = req.body;
    const sql = `SELECT * FROM alarminfo where SetTime between ? and ? order by No desc limit ? offset ?`;
    const [rows] = await Service.Inst.MySQL.query<AlarminfoRow[]>(sql, [start_time, end_time, page_size || 30, (page_size || 30) * (page - 1)]);

    const sql2 = `SELECT count(1) as count FROM alarminfo where SetTime between ? and ?`;
    const [total] = await Service.Inst.MySQL.query<CountRow[]>(sql2, [start_time, end_time]);
    const total_count = total[0].count;

    res.json({
        message: "OK",
        data: {
            total_count : total_count,
            rows : rows
        }
    });
}));


/**
 * @swagger
 * /warning-stats:
 *   post:
 *     summary: 경고 지표 요청
 *     description: 지정된 기간 동안의 경고 지표를 조회합니다.
 *     tags: [Warning Statistics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WarningStatsInRequest'
 *     responses:
 *       200:
 *         description: 경고 지표 데이터를 성공적으로 반환함.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WarningStatsResponse'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     WarningStatsInRequest:
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
 *     IWarningInfoRow:
 *       type: object
 *       properties:
 *         No:
 *           type: number
 *           nullable: true
 *         SerialNo:
 *           type: number
 *           nullable: true
 *         WarningCode:
 *           type: number
 *           nullable: true
 *         TaskID:
 *           type: number
 *           nullable: true
 *         Location:
 *           type: number
 *           nullable: true
 *         Reason:
 *           type: number
 *           nullable: true
 *         CommandID:
 *           type: string
 *           nullable: true
 *         CarrierID:
 *           type: string
 *           nullable: true
 *         SetTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     WarningStatsResponse:
 *       type: object
 *       properties:
 *         rows:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IWarningInfoRow'
 *         total_count:
 *           type: number
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post('/warning-stats', verifyToken, asyncWrapper<AlarmStatsInRequest, AlarmStatsResponse>(async (req, res) => {
    const { start_time, end_time, page, page_size } = req.body;
    const sql = `SELECT * FROM warninginfo where SetTime between ? and ? order by No desc limit ? offset ?`;
    const [rows] = await Service.Inst.MySQL.query<WarningInfoRow[]>(sql, [start_time, end_time, page_size || 30, (page_size || 30) * (page - 1)]);

    const sql2 = `SELECT count(1) as count FROM warninginfo where SetTime between ? and ?`;
    const [total] = await Service.Inst.MySQL.query<CountRow[]>(sql2, [start_time, end_time]);
    const total_count = total[0].count;

    res.json({
        message: "OK",
        data: {
            total_count : total_count,
            rows : rows
        }
    });
}));


/**
 * @swagger
 * /stats/zone-stats:
 *   post:
 *     summary: Zone 지표 요청
 *     description: 지정된 기간 동안의 Zone 관련 지표를 조회합니다.
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ZoneStatsInRequest'
 *     responses:
 *       200:
 *         description: Zone 지표 데이터를 성공적으로 반환함.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseZoneStatsResponse'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     ZoneStatsInRequest:
 *       type: object
 *       required:
 *         - start_time
 *         - end_time
 *       properties:
 *         start_time:
 *           type: string
 *           format: date-time
 *         end_time:
 *           type: string
 *           format: date-time
 *     ZoneStatsItem:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           nullable: true
 *         zoneId:
 *           type: number
 *           nullable: true
 *         carrierNum:
 *           type: number
 *           nullable: true
 *         alarmNum:
 *           type: number
 *           nullable: true
 *         warningNum:
 *           type: number
 *           nullable: true
 *     ZoneStatsResponse:
 *       type: object
 *       properties:
 *         rows:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ZoneStatsItem'
 *     STResponseZoneStatsResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/ZoneStatsResponse'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post('/zone-stats', verifyToken, asyncWrapper<ZoneStatsInRequest, ZoneStatsResponse>(async (req, res) => {
    const { start_time, end_time } = req.body;
    const sql = `SELECT * FROM zoneStats where date between ? and ? order by date`;
    const [rows] = await Service.Inst.MySQL.query<ZoneStatsRow[]>(sql, [start_time, end_time]);
    const result:ZoneStatsItem[] = [];
    rows.forEach((row) => {
        result.push({
            date : `${String(row.date.getFullYear()).padStart(4, '0')}-${String(row.date.getMonth() + 1).padStart(2,'0',)}-${String(row.date.getDate()).padStart(2,'0')}`,
            zoneId : row.zoneId,
            carrierNum : row.carrierNum,
            alarmNum : row.alarmNum,
            warningNum : row.warningNum
        })
    });
    res.json({
        message: "OK",
        data: {
            rows : result
        }
    });
}));

export default router;
