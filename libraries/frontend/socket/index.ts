import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
// CORS 옵션을 추가하여 모든 요청을 허용하도록 설정
const io = new Server(server, {
  cors: {
    origin: '*', // 모든 도메인에서의 요청을 허용
    methods: ['GET', 'POST'], // 허용할 HTTP 메소드 목록
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');
  // 매초마다 현재 시간을 보내는 타이머 설정
  const timer = setInterval(() => {
    const now = new Date();
    socket.emit('time', now.toISOString());
  }, 5000);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // 여기에 더 많은 이벤트 리스너를 추가할 수 있습니다.
});

server.listen(5172, () => {
  console.log('Listening on *:5172');
});
