const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./dist/config.json');

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(
  '/api',
  createProxyMiddleware({
    target: config.API, // 프록시할 서버 주소
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', // URL 재작성
    },
    // 기타 설정
  }),
);

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(config.PORT, () => {
  console.log(`Listening on port ${config.PORT}`);
});
