import { Router, Request, Response } from 'express';
import { SignInRequest, SignInResponse, STResponse } from '../packages/backend/types/src/index';

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
 *         - username
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
 *         grade:
 *           type: string
 *           example: 1
 *         session:
 *           type: string
 *           example: abc123
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
    res.json({
        message: "OK",
        data: {
            grade: '1',
            session: '1'
        }
    })
});

export default router;
