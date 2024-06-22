// index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('createRoom', (roomCode) => {
    socket.join(roomCode);
    console.log(`Room created: ${roomCode}`);
  });

  socket.on('joinRoom', (roomCode) => {
    const rooms = io.sockets.adapter.rooms;
    if (rooms.get(roomCode)) {
      socket.join(roomCode);
      socket.emit('roomJoined');
      console.log(`User joined room: ${roomCode}`);
    } else {
      console.log(`Room not found: ${roomCode}`);
    }
  });

  socket.on('move', (data) => {
    console.log('move received: ', data);
    socket.to(data.roomCode).emit('move', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
