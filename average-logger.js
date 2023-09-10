const jsonfile = require('jsonfile')
const fs = require('fs')


async function avg() {
  // บันทึกลงในไฟล์ข้อความ
  const dashboardData = []

  for (let i = 1; i <= 7; i++) {
    const toDay = new Date();
    const date = toDay.getDate()
    toDay.setDate(date - (7 - i));
    const filename = `./data_${toDay.toISOString().slice(0, 10)}.json`;

    if (!fs.existsSync(filename)) {
      dashboardData.push({ humidity: 0, temperature: 0, switch: 0, date: toDay.toDateString().split(" ")[0] })
    }
    else {
      const obj = await jsonfile.readFile(filename)
      const finaldata = obj.data.reduce((p, c) => {
        return {
          ...p,
          humidity: p.humidity + c.Humid,
          temperature: p.temperature + c.Temp
        }
      }, { humidity: 0, temperature: 0, switch: 0, date: toDay.toDateString().split(" ")[0] })
      // { Humid: 68.2, Temp: 22.8, Switch: 1 }
      finaldata.humidity = finaldata.humidity / obj.data.length
      finaldata.temperature = finaldata.temperature / obj.data.length
      dashboardData.push(finaldata)
    }

  }

  return dashboardData
}

module.exports = avg