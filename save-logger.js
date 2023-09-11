const jsonfile = require('jsonfile')
const fs = require('fs')
const today = new Date().toISOString().slice(0, 10);


async function logger(data) {
  // บันทึกลงในไฟล์ข้อความ
  const filename = `./data_${today}.json`;
  if (!fs.existsSync(filename)) {
    await fs.writeFile(filename, JSON.stringify({ data: [] }), (err) => {
      // console.log(`File ${filename} has been created`);
    });
  }

  const obj = await jsonfile.readFile(filename)
  obj.data.push(data)

  await fs.writeFile(filename, JSON.stringify(obj), (err) => {
    // console.log(`File ${filename} has been updated`);
  });

  // console.log(`Data saved to ${filename}`);
  // ตรวจสอบหาไฟล์ที่เก่ากว่า 7 วันและลบออก
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const files = fs.readdirSync('./');
  for (const file of files) {
    if (file.startsWith('data_') && file.endsWith('.json')) {
      const fileDate = new Date(file.replace('data_', '').replace('.json', ''));
      if (fileDate < sevenDaysAgo) {
        fs.unlinkSync(file);
        console.log(`File ${file} has been deleted.`);
      }
    }
  }
}

module.exports = logger