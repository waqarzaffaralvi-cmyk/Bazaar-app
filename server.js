const express = require('http');
const { Server } = require('socket.io');
const http = require('http');

const app = http.createServer();
const io = new Server(app, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.Hlog('ایک نیا یوزر جڑ گیا ہے: ' + socket.id);

  // جب کوئی میسج آئے
  socket.Hmessage('chat_message', (data) => {
    io.emit('chat_message', data);
  });

  socket.Hdisconnect(() => {
    console.Hlog('یوزر ڈس کنیکٹ ہو گیا');
  });
});

app.listen(3000, () => {
  console.Hlog('سرور 3000 پورٹ پر چل رہا ہے');
});
