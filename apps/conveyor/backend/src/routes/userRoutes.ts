import { Router, Request, Response } from 'express';
import md5 from 'md5';
import { SignInRequest, SignInResponse, STResponse } from '../packages/backend/types/src/index';
import { UserRow } from '../orm/R301';

import { Service } from '../service';
import logger from '../libs/logger';

const router: Router = Router();

/**
 * @swagger
 * /users/sign-in:
 *   post:
 *     summary: User sign-in
 *     description: Allows users to sign in to the application.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInRequest'
 *     responses:
 *       200:
 *         description: Successful sign-in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseSignInResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 * components:
 *   schemas:
 *     SignInRequest:
 *       type: object
 *       required:
 *         - user_id
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: johndoe
 *         password:
 *           type: string
 *           example: MySecurePassword123!
 *     SignInResponse:
 *       type: object
 *       properties:
 *         uid:
 *           type: number
 *         username:
 *           type: string
 *         grade:
 *           type: number
 *           example: 1
 *         session:
 *           type: string
 *           example: abc123
 *         last_access:
 *           type: Date
 *           example: 2023-11-07 00:00:00
 *     STResponseSignInResponse:
 *       type: object
 *       properties:
 *         result:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/SignInResponse'
 */
router.post('/sign-in', async (req: Request<SignInRequest>, res: Response<STResponse<SignInResponse>>) => {
    try {
        const { user_id, password } = req.body;
        const [rows] = await Service.Inst.MySQL.query<UserRow[]>('SELECT uid, password, user_name, grade, last_access FROM users WHERE user_id = ?', [user_id]);
        if (rows.length < 1) {
            throw new Error('User not found');
        } else {
            const row = rows[0];
            if (row.password !== password) {
                throw new Error('Password mismatch');
            }
            const session = md5(`${row.uid}${row.password}${Date.now()}`);
            await Service.Inst.MySQL.query('UPDATE users SET session = ?, last_access = now() WHERE uid = ?', [session, row.uid]);
            res.json({
                message: "OK",
                data: {
                    uid : row.uid,
                    username: row.user_name,
                    grade: row.grade,
                    session: session,
                    last_access : row.last_access
                }
            });
        }
    } catch (err) {
        let message = '';
        if (err instanceof Error) {
            message = err.message;
        } else {
            message = 'Unknown error';
        }
        logger.error(message);
        res.json({ message: message });
    }
});

export default router;
