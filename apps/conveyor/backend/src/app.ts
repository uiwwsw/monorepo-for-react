import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger_output.json';
import routes from './routes';

const app = express();
const port = 3000;

/**
 * @swagger
 * /:
 *   get:
 *     ... (swagger 설정)
 */
app.get('/', (_: Request, res: Response) => {
  res.send('Hello World!');
});

// API 라우트 불러오기
app.use('/', routes);

// Swagger UI
// TODO 설정 환경에 따라 해당 코드 제거
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
module.exports = app; // 이 부분이 중요합니다.
