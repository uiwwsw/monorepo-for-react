import { Router } from 'express';
import { Service } from '../service';

import { verifyToken } from './session';       //verifyToken
import { asyncWrapper } from './error';


import {
    IGetSystemEquipValueReq, IGetSystemEquipValueResp,
    ISetSystemEquipValueReq, ISetSystemEquipValueResp,
    IMotionParamInfoReq, IMotionParamInfoResp,
    IEquipmentExInfoReq, IEquipmentExInfoResp,
    IOffsetInfoReq, IOffsetInfoResp,
    ICheckTcmClientReq, ICheckTcmClientResp, TcmClientAlive,
    IAttributeLifterPosReq, IAttributeLifterPosResp,
    IZoneInfoReq, IZoneInfoResp,
    IGetUseSmmEmulReq, IGetUseSmmEmulResp,
    IGetTcmPortReq, IGetTcmPortResp
} from '@package-backend/types';

const router: Router = Router();


/**
 * @swagger
 * /redis/get-equipment-value:
 *   get:
 *     summary: 장비 설정 값 조회
 *     description: 시스템에 설정된 특정 장비의 값을 조회합니다.
 *     tags: [Redis Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 장비 설정 값이 성공적으로 반환됨.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseIGetSystemEquipValueResp'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     IGetSystemEquipValueResp:
 *       type: object
 *       properties:
 *         model:
 *           type: string
 *         name:
 *           type: string
 *         default_model:
 *           type: string
 *         transfer_timeout:
 *           type: number
 *     STResponseIGetSystemEquipValueResp:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/IGetSystemEquipValueResp'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/get-equipment-value', verifyToken, asyncWrapper<IGetSystemEquipValueReq, IGetSystemEquipValueResp>(async (req, res) => {
    const reply = await Service.Inst.Redis.hgetall('System:EquipmentValue');

    res.json({
        message: "OK",
        data: {
            model: reply.EquipmentModel,
            name: reply.EquipmentName,
            default_model : reply.DefaultEquipmentModel,
            transfer_timeout : +reply.TransferTimeout
        }
    });
}));


/**
 * @swagger
 * /redis/set-equipment-value:
 *   post:
 *     summary: 장비 설정 값 변경
 *     description: 시스템에 설정된 특정 장비의 값을 변경합니다.
 *     tags: [Redis Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ISetSystemEquipValueReq'
 *     responses:
 *       200:
 *         description: 장비 설정 값이 성공적으로 변경됨.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseISetSystemEquipValueResp'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     ISetSystemEquipValueReq:
 *       type: object
 *       required:
 *         - target
 *         - value
 *       properties:
 *         target:
 *           type: string
 *         value:
 *           type: string
 *     ISetSystemEquipValueResp:
 *       type: object
 *     STResponseISetSystemEquipValueResp:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/ISetSystemEquipValueResp'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post('/set-equipment-value', verifyToken, asyncWrapper<ISetSystemEquipValueReq, ISetSystemEquipValueResp>(async (req, res) => {
    const { target, value } = req.body;

    // target : EquipmentModel, EquipmentName, DefaultEquipmentModel, TransferTimeout 이 아니면, 에러
    if (target !== 'EquipmentModel' && target !== 'EquipmentName' && target !== 'DefaultEquipmentModel' && target !== 'TransferTimeout') {
        res.json({
            message: "INVALID_EQUIPMENT_VALUE",
            data: {}
        });
        return;
    }

    const result = await Service.Inst.Redis.hset('System:EquipmentValue', target, value);

    res.json({
        message: result ? "FAIL" : "OK",
        data: {}
    });
}));


/**
 * @swagger
 * /redis/motion-parameter-info:
 *   get:
 *     summary: 모션 파라미터 정보 조회
 *     description: 특정 Zone ID에 대한 모션 파라미터 정보를 조회합니다.
 *     tags: [Redis Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: zone_id
 *         required: true
 *         schema:
 *           type: number
 *         description: 조회할 Zone의 ID.
 *     responses:
 *       200:
 *         description: 모션 파라미터 정보가 성공적으로 반환됨.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseIMotionParamInfoResp'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         MaintVel:
 *           type: number
 *         MaintAcc:
 *           type: number
 *         MaintDcc:
 *           type: number
 *         MaintJerk:
 *           type: number
 *         RunFastVel:
 *           type: number
 *         RunFastAcc:
 *           type: number
 *         RunFastDcc:
 *           type: number
 *         RunFastJerk:
 *           type: number
 *         RunSlowVel:
 *           type: number
 *         RunSlowAcc:
 *           type: number
 *         RunSlowDcc:
 *           type: number
 *         RunSlowJerk:
 *           type: number
 *         OverrideVel:
 *           type: number
 *         OverrideAcc:
 *           type: number
 *         OverrideDcc:
 *           type: number
 *         OverrideJerk:
 *           type: number
 *     IMotionParamInfoResp:
 *       allOf:
 *         - $ref: '#/components/schemas/Profile'
 *     STResponseIMotionParamInfoResp:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/IMotionParamInfoResp'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/motion-parameter-info', verifyToken, asyncWrapper<IMotionParamInfoReq, IMotionParamInfoResp>(async (req, res) => {
    const { zone_id } = req.query;
    const reply = await Service.Inst.Redis.hgetall(`Zone:${zone_id}:Profile`);

    res.json({
        message: "OK",
        data: {
            RunFastVel: +(reply.RunFastVel || 0),
            RunFastAcc: +(reply.RunFastAcc || 0),
            RunFastDcc: +(reply.RunFastDcc || 0),
            RunFastJerk: +(reply.RunFastJerk || 0),
            MaintVel: +(reply.MaintVel || 0),
            MaintAcc: +(reply.MaintAcc || 0),
            MaintDcc: +(reply.MaintDcc || 0),
            MaintJerk: +(reply.MaintJerk) || 0,
            RunSlowVel: +(reply.RunSlowVel || 0),
            RunSlowAcc: +(reply.RunSlowAcc || 0),
            RunSlowDcc: +(reply.RunSlowDcc || 0),
            RunSlowJerk: +(reply.RunSlowJerk || 0),
            OverrideVel: +(reply.OverrideVel || 0),
            OverrideAcc: +(reply.OverrideAcc || 0),
            OverrideDcc: +(reply.OverrideDcc || 0),
            OverrideJerk: +(reply.OverrideJerk || 0)
        }
    });
}));


/**
 * @swagger
 * /redis/motion-parameter-ex-info:
 *   get:
 *     summary: 확장 모션 파라미터 정보 조회
 *     description: 특정 Zone ID에 대한 확장 모션 파라미터 정보를 조회합니다.
 *     tags: [Redis Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: zone_id
 *         required: true
 *         schema:
 *           type: number
 *         description: 조회할 Zone의 ID.
 *     responses:
 *       200:
 *         description: 확장 모션 파라미터 정보가 성공적으로 반환됨.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseIEquipmentExInfoResp'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     IEquipmentExInfoResp:
 *       type: object
 *       properties:
 *         OverrideDelay:
 *           type: string
 *         DccRatio:
 *           type: string
 *         RunCurrent:
 *           type: string
 *         StandbyCurrent:
 *           type: string
 *     STResponseIEquipmentExInfoResp:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/IEquipmentExInfoResp'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/motion-parameter-ex-info', verifyToken, asyncWrapper<IEquipmentExInfoReq, IEquipmentExInfoResp>(async (req, res) => {
    const { zone_id } = req.query;
    const reply = await Service.Inst.Redis.hgetall(`Zone:${zone_id}:ProfileEx`);

    res.json({
        message: "OK",
        data: {
            OverrideDelay: reply.OverrideDelay,
            DccRatio: reply.DccRatio,
            RunCurrent: reply.RunCurrent,
            StandbyCurrent: reply.StandbyCurrent,
            PosPlusHtoP : reply.PosPlusHtoP,
            PosMinusPtoH : reply.PosMinusPtoH,
            PosPlusHtoN : reply.PosPlusHtoN,
            PosMinusNtoH : reply.PosMinusNtoH,
            PosPlusPtoN : reply.PosPlusPtoN,
            PosMinusNtoP : reply.PosMinusNtoP,
            PosPlusOffset : reply.PosPlusOffset,
            PosMinusOffset : reply.PosMinusOffset,
            QsVel : reply.QsVel,
            QsAcc : reply.QsAcc,
            QsDcc : reply.QsDcc,
            OffsetVel : reply.OffsetVel,
            OffsetAcc : reply.OffsetAcc,
            ffsetDcc : reply.ffsetDcc,
        }
    });
}));


/**
 * @swagger
 * /redis/offset-info:
 *   get:
 *     summary: 오프셋 정보 조회
 *     description: 특정 Zone ID에 대한 오프셋 정보를 조회합니다.
 *     tags: [Redis Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: zone_id
 *         required: true
 *         schema:
 *           type: number
 *         description: 조회할 Zone의 ID.
 *     responses:
 *       200:
 *         description: 오프셋 정보가 성공적으로 반환됨.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseIOffsetInfoResp'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     AttributeQS:
 *       type: object
 *       properties:
 *         Included:
 *           type: number
 *           nullable: true
 *         East:
 *           type: object
 *           nullable: true
 *         EastOut:
 *           type: object
 *           nullable: true
 *         West:
 *           type: object
 *           nullable: true
 *         WestOut:
 *           type: object
 *           nullable: true
 *         North:
 *           type: object
 *           nullable: true
 *         South:
 *           type: object
 *           nullable: true
 *         SouthOut:
 *           type: object
 *           nullable: true
 *         HomeOffset:
 *           type: object
 *           nullable: true
 *         HomeDirection:
 *           type: object
 *           nullable: true
 *         NegativeOffset:
 *           type: object
 *           nullable: true
 *         PositiveOffset:
 *           type: object
 *           nullable: true
 *         IsWayPoint:
 *           type: object
 *           nullable: true
 *     IOffsetInfoResp:
 *       allOf:
 *         - $ref: '#/components/schemas/AttributeQS'
 *     STResponseIOffsetInfoResp:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/IOffsetInfoResp'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/offset-info', verifyToken, asyncWrapper<IOffsetInfoReq, IOffsetInfoResp>(async (req, res) => {
    const { zone_id } = req.query;
    const reply = await Service.Inst.Redis.hgetall(`Zone:${zone_id}:AttributeQS`);

    res.json({
        message: "OK",
        data: {
            Included: +reply.Included,
            East: reply.East,
            EastOut: reply.EastOut,
            West: reply.West,
            WestOut: reply.WestOut,
            North: reply.North,
            South: reply.South,
            SouthOut: reply.SouthOut,
            HomeOffset: reply.HomeOffset,
            HomeDirection: reply.HomeDirection,
            NegativeOffset: reply.NegativeOffset,
            PositiveOffset: reply.PositiveOffset,
            IsWayPoint: reply.IsWayPoint
        }
    });
}));


/**
 * @swagger
 * /redis/check-tcm-client:
 *   get:
 *     summary: TCM 클라이언트 상태 확인
 *     description: 지정된 TCM ID에 대한 클라이언트 상태를 확인합니다.
 *     tags: [Redis Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tcm_id
 *         required: true
 *         schema:
 *           type: number
 *         description: 상태를 확인할 TCM의 ID.
 *     responses:
 *       200:
 *         description: TCM 클라이언트 상태가 성공적으로 반환됨.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseICheckTcmClientResp'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     ICheckTcmClientResp:
 *       type: object
 *       properties:
 *         state:
 *           type: number
 *         write_log:
 *           type: number
 *     STResponseICheckTcmClientResp:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/ICheckTcmClientResp'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/check-tcm-client', verifyToken, asyncWrapper<ICheckTcmClientReq, ICheckTcmClientResp>(async (req, res) => {
    const { tcm_id } = req.query;
    const obj = await Service.Inst.Redis.hgetall(`TCMInfo:${tcm_id}:Alive`);
    console.dir(obj);
    const state:TcmClientAlive[] = [];
    Object.keys(obj).forEach((key) => {
        if (key.indexOf('TCMClientStatus') === 0) {
            state.push({
                tcm_id : +(key.split('_')[1]),
                alive : +(obj[key] || 0)
            });
        }
    });
    return res.status(200).send({
        message: "OK",
        data: {
            state : state,
            write_log : +(obj.FileLogging || 0)
        }
    });
}));


/**
 * @swagger
 * /redis/attribute-lifter/position:
 *   get:
 *     summary: 리프터 위치 속성 조회
 *     description: 지정된 Zone ID, 레벨, 위치에 대한 리프터의 위치 속성을 조회합니다.
 *     tags: [Redis Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: zone_id
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 Zone의 ID.
 *       - in: query
 *         name: level
 *         required: true
 *         schema:
 *           type: number
 *         description: 리프터의 레벨.
 *       - in: query
 *         name: position
 *         required: true
 *         schema:
 *           type: number
 *         description: 리프터의 위치.
 *     responses:
 *       200:
 *         description: 리프터 위치 속성 정보가 성공적으로 반환됨.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseIAttributeLifterPosResp'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     IAttributeLifterPosResp:
 *       type: object
 *     STResponseIAttributeLifterPosResp:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/IAttributeLifterPosResp'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/attribute-lifter/position', verifyToken, asyncWrapper<IAttributeLifterPosReq, IAttributeLifterPosResp>(async (req, res) => {
    const { zone_id, level, position } = req.query;
    const value = new Map<string, string>();
    value.set(`LevelZonePosition_${level}`, position?.toString() || "");
    const result = await Service.Inst.Redis.hset(`Zone:${zone_id}:AttributeLifter`, value );
    if (result) {
        const zoneRepo = Service.Inst.ZoneRepo;
        const zone = zoneRepo.Data.get(+(zone_id||0));
        if (zone) {
            if (zone.AttributeLifter?.LevelZone && zone.AttributeLifter?.LevelZone.length > 0) {
                zone.AttributeLifter.LevelZone[+(level||0)].Position = +(position||0);
            }
        }
    }
    res.json({
        message: result ? "OK" : "FAIL",
        data: {}
    });
}));


/**
 * @swagger
 * /redis/zone-info:
 *   get:
 *     summary: Zone 정보 조회
 *     description: 시스템에서 사용 가능한 모든 Zone의 정보를 조회합니다.
 *     tags: [Redis Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Zone 정보가 성공적으로 반환됨.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseIZoneInfoResp'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     Zone:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         status:
 *           type: string
 *     IZoneInfoResp:
 *       type: object
 *       properties:
 *         zones:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Zone'
 *     STResponseIZoneInfoResp:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/IZoneInfoResp'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/zone-info', verifyToken, asyncWrapper<IZoneInfoReq, IZoneInfoResp>(async (req, res) => {
    const zoneRepo = Service.Inst.ZoneRepo;
    const zones = Array.from(zoneRepo.Data.values());

    res.json({
        message: "OK",
        data: {
            zones : zones
        }
    });
}));


/**
 * @swagger
 * /redis/info/use-smm-emul:
 *   get:
 *     summary: SMM 에뮬레이션 사용 여부 조회
 *     description: 시스템에서 SMM 에뮬레이션의 사용 여부를 조회합니다.
 *     tags: [Redis Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SMM 에뮬레이션 사용 여부가 성공적으로 반환됨.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseIGetUseSmmEmulResp'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     IGetUseSmmEmulResp:
 *       type: object
 *       properties:
 *         use_smm_emul:
 *           type: number
 *     STResponseIGetUseSmmEmulResp:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/IGetUseSmmEmulResp'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/info/use-smm-emul', verifyToken, asyncWrapper<IGetUseSmmEmulReq, IGetUseSmmEmulResp>(async (req, res) => {
    const value = await Service.Inst.Redis.hget(`System:Configuration:GUI`, 'UseSmmEmul');

    res.json({
        message: "OK",
        data: {
            use_smm_emul : value ? +value : 0
        }
    });
}));


/**
 * @swagger
 * /redis/info/get-tcm-port:
 *   get:
 *     summary: TCM 포트 정보 조회
 *     description: 지정된 TCM ID에 대한 네트워크 포트 정보를 조회합니다.
 *     tags: [Redis Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tcm_id
 *         required: true
 *         schema:
 *           type: number
 *         description: 조회할 TCM의 ID.
 *     responses:
 *       200:
 *         description: TCM 포트 정보가 성공적으로 반환됨.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseIGetTcmPortResp'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     IGetTcmPortResp:
 *       type: object
 *       properties:
 *         port:
 *           type: number
 *           description: TCM의 네트워크 포트 번호.
 *     STResponseIGetTcmPortResp:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/IGetTcmPortResp'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/info/get-tcm-port', verifyToken, asyncWrapper<IGetTcmPortReq, IGetTcmPortResp>(async (req, res) => {
    const { tcm_id } = req.query;
    const value = await Service.Inst.Redis.hget(`TCMInfo:${tcm_id}`, 'Port');

    res.json({
        message: "OK",
        data: {
            port : value ? +value : 0
        }
    });
}));


export default router;