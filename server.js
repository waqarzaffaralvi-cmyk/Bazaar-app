
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// سرور کا ہوم روٹ تاکہ براؤزر یا ریلوے کو رسپانس ملے
app.get('/', (req, res) => {
  res.send('Bazaar App Server is Running Successfully!');
});

io.on('connection', (socket) => {
  console.log('ایک نیا یوزر جڑ گیا ہے: ' + socket.id);

  socket.on('chat_message', (data) => {
    io.emit('chat_message', data);
  });

  socket.on('disconnect', () => {
    console.log('یوزر ڈس کنیکٹ ہو گیا');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('سرور پورٹ پر چل رہا ہے: ' + PORT);
});
