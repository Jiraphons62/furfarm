const fs = require('fs');

function logAverageToFile() {
  // สร้างข้อมูลเฉลี่ยสำหรับตัวอย่าง
  const averageData = {
    date: new Date().toISOString(),
    average: Math.random() * 100, // สร้างค่าสุ่มเป็นตัวอย่าง
  };

  // อ่านข้อมูลจากไฟล์ (ถ้ามี)
  let previousData = [];
  try {
    previousData = JSON.parse(fs.readFileSync('average-log.json', 'utf-8'));
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอ่านข้อมูล:', error);
  }

  // เพิ่มข้อมูลเฉลี่ยล่าสุด
  previousData.push(averageData);

  // เขียนข้อมูลลงในไฟล์
  fs.writeFile('average-log.json', JSON.stringify(previousData, null, 2), (err) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการเขียนไฟล์:', err);
    } else {
      console.log('บันทึกข้อมูลเฉลี่ยลงในไฟล์เรียบร้อยแล้ว.');
    }
  });
}

// ทดสอบการเรียกฟังก์ชัน logAverageToFile ทุก 24 ชั่วโมง
setInterval(logAverageToFile, 24 * 60 * 60 * 1000); // 24 ชั่วโมง