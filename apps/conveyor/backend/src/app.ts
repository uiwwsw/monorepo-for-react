import express, { Express } from 'express';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './etc/swaggerOptions';

import userRouter from './routes/userRoutes';
const app: Express = express();
const port = 3000;

app.use(express.json());    // body-parser 기능 포함
app.use(cors());            // CORS 미들웨어 추가

// 라우터를 사용하여 '/api/users' 엔드포인트 설정
app.use('/users', userRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
