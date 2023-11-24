import swaggerJsdoc from 'swagger-jsdoc';
import { Service } from '../service';

// Swagger 정의
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API with Swagger',
    version: '1.0.0',
    description: 'A REST API using swagger-ui-express and swagger-jsdoc.',
  },
  servers: [
    {
      url: `http://localhost:${Service.Inst.Prop.PortNum}`,
      description: 'local server',
    },
    {
      url: `http://192.168.101.14:${Service.Inst.Prop.PortNum}`,
      description: 'Development server',
    }
  ],
};

// 옵션 설정, 'apis' 배열 안에 문서화하고 싶은 경로를 넣습니다.
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // 여기에 문서화할 라우트 파일 경로를 지정합니다.
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
