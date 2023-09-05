const fs = require('fs');
const path = require('path');

const today = new Date().toISOString().slice(0, 10); // ดึงวันปัจจุบัน (yyyy-mm-dd)
const filename = `data_${today}.txt`;

// ตรวจสอบว่ามีไฟล์ข้อมูลใหม่สร้างหรือไม่
if (!fs.existsSync(filename)) {
  fs.writeFileSync(filename, `Date: ${today}\n`);
  fs.appendFileSync(filename, `Raw Data:\n`);
  fs.appendFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`New data file created: ${filename}`);
}

// ตรวจสอบไฟล์ข้อมูลที่เก่ากว่า 7 วันและลบออก
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

fs.readdir