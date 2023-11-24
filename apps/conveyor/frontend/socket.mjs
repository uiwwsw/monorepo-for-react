const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected');
  // 매초마다 현재 시간을 보내는 타이머 설정
  const timer = setInterval(() => {
    const now = new Date();
    socket.emit('time', now.toISOString());
  }, 1000);
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // 여기에 더 많은 이벤트 리스너를 추가할 수 있습니다.
});

server.listen(3000, () => {
  console.log('Listening on *:3000');
});
