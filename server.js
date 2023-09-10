const express = require('express');
const http = require('http');
//const socketIo = require('socket.io');
const admin = require('firebase-admin');
const cors = require('cors');
const avg = require('./average-logger');
const logger = require('./save-logger');



const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
const PORT = process.env.PORT || 3000;

const serviceAccount = require('./imandfriends-5d2fa-default-rtdb-export');

//Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://imandfriends-5d2fa-default-rtdb.firebaseio.com/'
});

const db = admin.database();

app.use(express.static('public'));
app.use(cors({ origin: '*' }));

const gobalVal = {
  humidityVal: 0,
  temperatureVal: 0,
  switchVal: 0,
}

io.emit()

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

      logger({ Humid: humidityVal, Temp: temperatureVal, Switch: switchVal });

      gobalVal.humidityVal = humidityVal
      gobalVal.temperatureVal = temperatureVal
      gobalVal.switchVal = switchVal

      io.emit('dataFromServer', { humidity: humidityVal, temperature: temperatureVal, switch: switchVal, });
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}, 5000);

app.get('/dashboard', async (req, res) => {
  try {
    const week = await avg()
    return res.status(200).json(week)
  } catch (error) {
    return res.status(500).json(error)
  }
})


app.post('/switch', async (req, res) => {
  try {
    const status = req.query.status
    const setSwitch = status === 'on' ? 0 : 1
    await db.ref('/switch').set(setSwitch);
    return res.status(200).json({ switch: setSwitch })
  } catch (error) {
    return res.status(500).json(error)
  }
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



