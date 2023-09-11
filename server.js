const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
//const socketIo = require('socket.io');
const admin = require('firebase-admin');
const cors = require('cors');
const avg = require('./average-logger');
const logger = require('./save-logger');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 3000;



const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

app.use(express.static('public'));
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser());

const authorization = (req, res, next) => {
  const { access_token } = req.headers.cookies.split('; ').reduce((prev, current) => {
    const [name, ...value] = current.split('=');
    prev[name] = value.join('=');
    return prev;
  }, {});
  if (!access_token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(access_token, "YOUR_SECRET_KEY");
    return next();
  } catch {
    return res.sendStatus(403);
  }
};


const serviceAccount = require('./imandfriends-5d2fa-default-rtdb-export');

//Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://imandfriends-5d2fa-default-rtdb.firebaseio.com/'
});

const db = admin.database();

const gobalVal = {
  humidityVal: 0,
  temperatureVal: 0,
  switchVal: 0,
}

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

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userBase = await db.ref('users');
    const userlist = (await userBase.get()).val()

    const user = Object.values(userlist).find((e) => e.email === email)
    if (!user) throw Error("user not found")
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign(user, "YOUR_SECRET_KEY");
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in.' });
  }
});

// Register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userBase = await db.ref('users');

    const userlist = (await userBase.get()).val()
    if (Object.values(userlist).some((e) => e.email === email)) {
      res.status(400).json({ message: 'This Email exiting in system.' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await userBase.push({
        email,
        password: hashedPassword,
      });
      res.status(201).json({ message: 'User registered successfully.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user.' });
  }
});


app.get('/dashboard', authorization, async (req, res) => {
  try {
    const week = await avg()
    return res.status(200).json(week)
  } catch (error) {
    return res.status(500).json({ message: error });
  }
})


app.post('/switch', authorization, async (req, res) => {
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



