/*
import { Router } from 'express';

import { Service } from '../service';
import { verifyToken } from './session';       //verifyToken
import { asyncWrapper } from './error';
import { TaskTransferInfoRow } from '../models/R301';
import { CarrierStatsInRequest, CarrierStatsResponse } from '@package-backend/types';

const router: Router = Router();

router.get('/carrier-stats', verifyToken, asyncWrapper<CarrierStatsInRequest, CarrierStatsResponse>(async (req, res) => {
    const sql = ``;
    const [rows] = await Service.Inst.MySQL.query<TaskTransferInfoRow[]>(sql, [req.query.begin_date]);

    res.json({
        message: "OK",
        data: {
            total : 0,
            rows : rows
        }
    });
}));

export default router;
*/