const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(
  '/api',
  createProxyMiddleware({
    target: process.env.API, // 프록시할 서버 주소
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', // URL 재작성
    },
    // 기타 설정
  }),
);
app.get('/config', (req, res) => {
  // 전송할 환경 변수 선택
  const clientConfig = {
    WS_API: process.env.WS_API,
    API: process.env.API,
  };

  res.json(clientConfig);
});
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
