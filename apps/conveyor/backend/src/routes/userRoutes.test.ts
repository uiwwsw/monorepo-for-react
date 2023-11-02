import request from 'supertest';
import express, { Express } from 'express';
import userRoutes from './userRoutes'; // 경로는 실제 userRoutes 파일의 위치로 변경
// import * as db from './db';  // 실제 DB 접근 로직이 있는 모듈

// jest.mock('./db');
// (db.getUserById as jest.Mock).mockImplementation((id) => {
//   if (id === '1234') {
//     return Promise.resolve({ name: 'John' });
//   } else {
//     return Promise.reject(new Error('User not found'));
//   }
// });

describe('User Router', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use('/user', userRoutes); // URL prefix를 '/user'로 설정. 실제 앱 설정에 맞게 변경 가능
  });

  test('GET /user/:id - success', async () => {
    const response = await request(app).get('/user/1234').expect(200);

    expect(response.body).toEqual({ data: { name: 'John' } });
  });

  test('GET /user/:id - failure', async () => {
    const response = await request(app).get('/user/5678').expect(500);

    expect(response.body).toEqual({ message: '우하호호호호' });
  });
});
