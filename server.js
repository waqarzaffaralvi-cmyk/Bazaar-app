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

app.use(express.static('public')); // اگر آپ کا فرنٹ اینڈ public فولڈر میں ہے

// لائیو ممبرز کی فہرست کو محفوظ رکھنے کے لیے رے
let activeMembers = [];

io.on('connection', (socket) => {
  console.log('ایک نیا یوزر جڑ گیا ہے ID:', socket.id);

  // جب کوئی یوزر پروفائل بنا کر یا لاگ ان کر کے خود کو رجسٹر کرے
  socket.on('register_user', (userData) => {
    // چیک کریں کہ کیا یہ یوزر پہلے سے لسٹ میں موجود ہے؟
    let existingIndex = activeMembers.findIndex(m => m.name === userData.name);
    if (existingIndex !== -1) {
      activeMembers[existingIndex] = { 
        id: socket.id, 
        name: userData.name, 
        role: userData.role, 
        dp: userData.dp, 
        online: true 
      };
    } else {
      activeMembers.push({ 
        id: socket.id, 
        name: userData.name, 
        role: userData.role, 
        dp: userData.dp, 
        online: true 
      });
    }

    // تمام جڑے ہوئے یوزرز کو اپ ڈیٹڈ ممبرز لسٹ بھیجیں
    io.emit('update_members', activeMembers);
  });

  // چیٹ میسج سننا اور سب کو بھیجنا
  socket.on('send_chat_message', (data) => {
    socket.broadcast.emit('receive_chat_message', data);
  });

  // جب کوئی یوزر ڈسکنیکٹ ہو جائے
  socket.on('disconnect', () => {
    console.log('یوزر ڈسکنیکٹ ہو گیا ID:', socket.id);
    // چاہیں تو آف لائن اسٹیٹس کر سکتے ہیں یا لسٹ برقرار رکھ سکتے ہیں
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`سرور کامیابی سے پورٹ ${PORT} پر چل رہا ہے!`);
});
