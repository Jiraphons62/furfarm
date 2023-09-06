const jsonfile = require('jsonfile')
const fs = require('fs')

async function logger(data) {
  // บันทึกลงในไฟล์ข้อความ
  const today = new Date().toISOString().slice(0, 10);
  const filename = `./data_${today}.json`;

  if (!fs.existsSync(filename)) {
    await fs.writeFile(filename, JSON.stringify({ data: [] }), (err) => {
      console.log(`File ${filename} has been created`);
    });
  }

  const obj = await jsonfile.readFile(filename)
  obj.data.push(data)

  await fs.writeFile(filename, JSON.stringify(obj), (err) => {
    console.log(`File ${filename} has been updated`);
  });

  console.log(`Data saved to ${filename}`);
}

module.exports = logger