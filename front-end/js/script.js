/* login form */
const container = document.querySelector(".container"),
    pwShowHide = document.querySelectorAll(".showHidePw"),
    pwFields = document.querySelectorAll(".password"),
    signUp = document.querySelector(".signup-link"),
    login = document.querySelector(".login-link");

//   js code to show/hide password and change icon
pwShowHide.forEach(eyeIcon => {
    eyeIcon.addEventListener("click", () => {
        pwFields.forEach(pwField => {
            if (pwField.type === "password") {
                pwField.type = "text";

                pwShowHide.forEach(icon => {
                    icon.classList.replace("uil-eye-slash", "uil-eye");
                })
            } else {
                pwField.type = "password";

                pwShowHide.forEach(icon => {
                    icon.classList.replace("uil-eye", "uil-eye-slash");
                })
            }
        })
    })
})

// // js code to appear signup and login form
// signUp.addEventListener("click", () => {
//     container.classList.add("active");
// });
// login.addEventListener("click", () => {
//     container.classList.remove("active");
// });
/* end login form */
// const socket = io();
// socket.on('dataFromServer', (data) => {
//     // อัปเดตค่าความชื้นและอุณหภูมิในส่วน HTML
//     const temperatureValueElement = document.getElementById('temperatureValue');
//     const temperatureElement = document.getElementById('temperature');

//     // ใส่ข้อมูลอุณหภูมิที่ได้รับจาก Socket.IO ไปยัง HTML
//     temperatureValueElement.textContent = `${data.temperature} °C`;
//     temperatureElement.textContent = data.temperature;

//     // อัปเดตสถานะของหลอดไฟ (ON/OFF) ในส่วน HTML
//     const lightStatusElement = document.getElementById('lightStatus');
//     lightStatusElement.textContent = data.lightStatus ? 'ON' : 'OFF';
//     lightStatusElement.classList.toggle('text-success', data.lightStatus);
//     lightStatusElement.classList.toggle('text-danger', !data.lightStatus);
// });
// socket.connect();
// switch
