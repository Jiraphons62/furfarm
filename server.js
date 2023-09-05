const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const admin = require('firebase-admin');
const cors = require('cors');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

const serviceAccount = require('imandfriends-5d2fa-firebase-adminsdk-8yjw1-8870ef894d');

//Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://imandfriends-5d2fa-default-rtdb.firebaseio.com/'
});

const db = admin.database();

app.use(express.static('public'));
app.use(cors());

io.on('connection', (socket) => {
  const firebaseRef = db.ref('apiKey: "AIzaSyCc7Yzas99_xHOK0Ul8-57UsStpfmSusbs","imandfriends-5d2fa.firebaseapp.com","https://imandfriends-5d2fa-default-rtdb.firebaseio.com","imandfriends-5d2fa","imandfriends-5d2fa.appspot.com","308914263896","1:308914263896:web:2360bb0ac0a46e2610b72d","G-CT27723W9Z"'); // replace with your database path

  // รีข้อมูลทุกๆ5วิ
  const intervalId = setInterval(async () => {
    try {
      firebaseRef.once('value', (snapshot) => {
        const data = snapshot.val();
        socket.emit('dataFromServer', data);

     // คำนวณบันทึกค่าเฉลี่ย
     const values = Object.values(data);
     const average = values.reduce((sum, value) => sum + value, 0) / values.length;
     console.log('Average Value:', average);

     // บันทึกลงในไฟล์ข้อความ
     const today = new Date().toISOString().slice(0, 10); 
     const filename = `data_${today}.txt`;

     fs.writeFileSync(filename, `Date: ${today}\n`);
     fs.appendFileSync(filename, `Average Value: ${average}\n`);
     fs.appendFileSync(filename, `Raw Data:\n`);
     fs.appendFileSync(filename, JSON.stringify(data, null, 2));
     console.log(`Data saved to ${filename}`);
   });
 } catch (error) {
   console.error('Error fetching data:', error);
 }
}, 5000);

// เลิกเก็บข้อมูลเมื่อครบ1วัน
socket.on('disconnect', () => {
 clearInterval(intervalId);
});
});

server.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});