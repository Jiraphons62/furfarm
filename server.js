const express = require('express');
const http = require('http');
//const socketIo = require('socket.io');
const admin = require('firebase-admin');
const cors = require('cors');
const logger = require('./average-logger');

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io")
const io = new Server(server);
const PORT = process.env.PORT || 3000;

const serviceAccount = require('./imandfriends-5d2fa-default-rtdb-export');

//Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://imandfriends-5d2fa-default-rtdb.firebaseio.com/'
});

const db = admin.database();

app.use(express.static('public'));
app.use(cors());

// io.on('connection', (socket) => {
const firebaseRef = db.ref('/'); // replace with your database path

// รีข้อมูลทุกๆ5วิ
const intervalId = setInterval(async () => {
  try {
    firebaseRef.once('value', (snapshot) => {
      const data = snapshot.val();
      // socket.emit('dataFromServer', data);
      // // เพิ่มการดึงข้อมูลความชื้นและอุณหภูมิจากข้อมูลเรียลไทม์
      const humidityVal = data.Humid;
      const temperatureVal = data.Temp;
      const switchVal = data.switch;


      console.log('Humidity: ', humidityVal); //หาชื่อตัวแปร
      console.log('Temperature: ', temperatureVal);
      console.log('Switch: ', switchVal);
      logger({
        Humid: humidityVal,
        Temp: temperatureVal,
        Switch: switchVal,
      });
      io.emit('dataFromServer', { humidity: humidityVal, temperature: temperatureVal });
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}, 5000);



app.get('/switch', async (req, res) => {
  try {
    const status = req.query.status
    const setSwitch = status === 'on' ? 0 : 1
    await db.ref('/switch').set(setSwitch);
    return res.status(200).json({ switch: setSwitch })
  } catch (error) {
    return res.status(500).json(error)
  }


  // switchRef.set(1);

})


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



