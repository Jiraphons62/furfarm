const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

const serviceAccount = require('imandfriends-5d2fa-firebase-adminsdk-8yjw1-8870ef894d');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://imandfriends-5d2fa-default-rtdb.firebaseio.com/'
});

const db = admin.database();

app.use(express.static('public'));
app.use(cors());

io.on('connection', (socket) => {
  const firebaseRef = db.ref('apiKey: "AIzaSyCc7Yzas99_xHOK0Ul8-57UsStpfmSusbs","imandfriends-5d2fa.firebaseapp.com","https://imandfriends-5d2fa-default-rtdb.firebaseio.com","imandfriends-5d2fa","imandfriends-5d2fa.appspot.com","308914263896","1:308914263896:web:2360bb0ac0a46e2610b72d","G-CT27723W9Z"'); // replace with your database path

  // Load data and send to client every 5 seconds
  const intervalId = setInterval(async () => {
    try {
      firebaseRef.once('value', (snapshot) => {
        const data = snapshot.val();
        socket.emit('dataFromServer', data);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, 5000);

  // Handle disconnection to clear the interval
  socket.on('disconnect', () => {
    clearInterval(intervalId);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});