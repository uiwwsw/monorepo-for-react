import { Router } from 'express';
import md5 from 'md5';

import { 
    SignInRequest, SignInResponse, 
    SignOutRequest, SignOutResponse,
    SignUpRequest, SignUpResponse,
    UserListRequest, UserListResponse, 
    UserEditGradeRequest, UserEditGradeResponse,
    UserPasswordRequest, UserPasswordResponse,
    UserSession } from '@package-backend/types';
import { UserGrade } from './grade';
import { UserRow } from '../model/R301';

import { Service } from '../service';
import { getToken, verifyToken } from './session';       //verifyToken
import { asyncWrapper } from './error';

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
 *           example: abc123F
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
router.post('/sign-in', asyncWrapper<SignInRequest, SignInResponse>(async (req, res) => {
    const { user_id, password } = req.body;
    const [rows] = await Service.Inst.MySQL.query<UserRow[]>('SELECT uid, password, user_name, grade, last_access FROM users WHERE user_id = ?', [user_id]);
    if (rows.length < 1) {
        throw new Error('USER_NOT_FOUND');
    }
    const row = rows[0];
    if (row.password !== password) {
        throw new Error('PASSOWRD_NOT_MATCH');
    }
    if (row.grade >= UserGrade.PENDING) {
        throw new Error('USER_NOT_AUTHORIZED');
    }

    const session = {
        uid: row.uid,
        user_id: user_id,
        grade: row.grade,
        key: md5(`${user_id}${row.password}${row.last_access}`)
    } as UserSession;

    await Service.Inst.MySQL.query('UPDATE users SET session = ?, last_access = now() WHERE uid = ?', [session.key, row.uid]);

    res.json({
        message: "OK",
        data: {
            uid : row.uid,
            username: row.user_name,
            grade: row.grade as UserGrade,
            token: getToken(session),
            last_access : row.last_access
        }
    });
}));


/**
 * @swagger
 * /sign-out:
 *   post:
 *     summary: 사용자 로그아웃 요청
 *     description: 사용자가 시스템에서 로그아웃합니다.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignOutRequest'
 *     responses:
 *       200:
 *         description: 로그아웃이 성공적으로 완료됨.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseSignOutResponse'
 *       401:
 *         description: 인증 실패.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     SignOutRequest:
 *       type: object
 *     SignOutResponse:
 *       type: object
 *     STResponseSignOutResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/SignOutResponse'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post('/sign-out', verifyToken, asyncWrapper<SignOutRequest, SignOutResponse>(async (req, res) => {
    const session = res.locals.session;
    await Service.Inst.MySQL.query('UPDATE users SET session = null WHERE uid = ?', [session.uid]);
    res.json({
        message: "OK",
        data: {}
    });
}));


/**
 * @swagger
 * /user-list:
 *   get:
 *     summary: 사용자 목록 요청
 *     description: 사용자 목록을 조회합니다.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserListRequest'
 *     responses:
 *       200:
 *         description: 성공적으로 사용자 목록을 반환함.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseUserListResponse'
 *       400:
 *         description: 잘못된 요청.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     UserListRequest:
 *       type: object
 *     UserListResponse:
 *       type: object
 *       properties:
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IUser'
 *     STResponseUserListResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UserListResponse'
 *         message:
 *           type: string
 *     IUser:
 *       type: object
 *       properties:
 *         uid:
 *           type: number
 *         name:
 *           type: string
 *         user_name:
 *           type: string
 *         grade:
 *           type: UserGrade 
 *         created_date:
 *           type: Date 
 *         last_access:
 *           type: Date  
 */
router.get('/user-list', verifyToken, asyncWrapper<UserListRequest, UserListResponse>(async (req, res) => {
    const [rows] = await Service.Inst.MySQL.query<UserRow[]>('SELECT uid, user_id, user_name, grade, created_date, last_access FROM users');
    res.json({
        message: "OK",
        data: {
            users: rows
        }
    });
}));


/**
 * @swagger
 * /sign-up:
 *   post:
 *     summary: 사용자 회원가입 요청
 *     description: 새로운 사용자를 등록합니다.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequest'
 *     responses:
 *       200:
 *         description: 회원가입이 성공적으로 완료됨.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseSignUpResponse'
 *       400:
 *         description: 잘못된 요청 데이터.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     SignUpRequest:
 *       type: object
 *       required:
 *         - user_id
 *         - username
 *         - password
 *       properties:
 *         user_id:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *     SignUpResponse:
 *       type: object
 *       properties:
 *         grade:
 *           $ref: '#/components/schemas/UserGrade'
 *     STResponseSignUpResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/SignUpResponse'
 *         message:
 *           type: string
 *     UserGrade:
 *       type: string
 *       enum: [8]
 */
router.post('/sign-up', asyncWrapper<SignUpRequest, SignUpResponse>(async (req, res) => {
    const { user_id, username, password } = req.body;
    const [rows] = await Service.Inst.MySQL.query<UserRow[]>('SELECT uid FROM users WHERE user_id = ?', [user_id]);
    const grade = UserGrade.PENDING;
    if (rows.length > 0) {
        throw new Error('ALREADY_EXISTED_USER_ID');
    }

    await Service.Inst.MySQL.query('INSERT INTO users (user_id, user_name, password, grade, created_date, last_access) VALUES (?, ?, ?, ?, now(), now())', [user_id, username, password, grade]);
    res.json({
        message: "OK",
        data: {
            grade: grade
        }
    });
}));


/**
 * @swagger
 * /user-edit:
 *   put:
 *     summary: 사용자 등급 수정
 *     description: 특정 사용자의 등급을 수정합니다.
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserEditGradeRequest'
 *     responses:
 *       200:
 *         description: 사용자 정보가 성공적으로 수정됨.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseUserEditGradeResponse'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     UserEditGradeRequest:
 *       type: object
 *       required:
 *         - user_id
 *         - grade
 *       properties:
 *         user_id:
 *           type: string
 *         grade:
 *           $ref: '#/components/schemas/UserGrade'
 *     UserEditGradeResponse:
 *       type: object
 *       properties:
 *         next:
 *           $ref: '#/components/schemas/UserGrade'
 *     STResponseUserEditGradeResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UserEditGradeResponse'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   enums:
 *     UserGrade:
 *       type: string
 *       enum: [ADMIN, OPERATOR, USER, PENDING, GUEST]
 */
router.put('/user-edit', verifyToken, asyncWrapper<UserEditGradeRequest, UserEditGradeResponse>(async (req, res) => {
    const session = res.locals.session;
    if (session.grade !== 1) {
        throw new Error('NO_PERMISSION')
    }
    const { user_id, grade } = req.body;
    const [rows] = await Service.Inst.MySQL.query<UserRow[]>('SELECT uid, grade FROM users WHERE user_id = ?', [user_id]);
    if (rows.length < 1) {
        throw new Error('USER_NOT_EXISTED');
    }
    const user = rows[0];
    if (user.uid == session.uid) {
        throw new Error('NO_PERMISSION');
    }
    if (parseInt(grade) < 1 || parseInt(grade) < parseInt(session.grade)) {
        throw new Error('NO_PERMISSION');
    }

    await Service.Inst.MySQL.query('update users set grade = ? where user_id = ?', [grade, user_id]);
    res.json({
        message: "OK",
        data: {
            next: grade
        }
    });
}));


/**
 * @swagger
 * /user-password:
 *   put:
 *     summary: 새로운 패스워드 설정 요청
 *     description: 사용자의 비밀번호를 새로 설정합니다.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPasswordRequest'
 *     responses:
 *       200:
 *         description: 비밀번호가 성공적으로 변경됨.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/STResponseUserPasswordResponse'
 *       401:
 *         description: 인증되지 않은 사용자.
 *       500:
 *         description: 서버 오류.
 * 
 * components:
 *   schemas:
 *     UserPasswordRequest:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         password:
 *           type: string
 *           format: password
 *     UserPasswordResponse:
 *       type: object
 *     STResponseUserPasswordResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UserPasswordResponse'
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.put('/user-password', verifyToken, asyncWrapper<UserPasswordRequest, UserPasswordResponse>(async (req, res) => {
    const session = res.locals.session;
    const { password } = req.body;
    await Service.Inst.MySQL.query('update users set password = ? where uid = ?', [password, session.uid]);
    res.json({
        message: "OK",
        data: {}
    });
}));



export default router;
