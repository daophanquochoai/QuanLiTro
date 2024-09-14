var urlAd = "http://localhost:8080/admin"

const forgetPasswordForm = document.querySelector(".forget-password-form")
const verifyForm = document.querySelector(".verify-form")
const resetPasswordForm = document.querySelector(".reset-password-form")

const otp = document.querySelectorAll('.otp_field');
//Tùy chỉnh otp
otp.forEach((field, index) => {
    field.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') {
            otp[index].value = "";
            setTimeout(() => {
                if (otp[index + 1]) otp[index + 1].focus();
            }, 0);
        } else if (e.key === 'Backspace' && otp[index].value == 0) {
            setTimeout(() => {
                if (otp[index - 1]) otp[index - 1].focus();
            }, 0);
        } else if (e.key === 'ArrowLeft') {
            setTimeout(() => {
                if (otp[index - 1]) otp[index - 1].focus();
            }, 0);
        } else if (e.key === 'ArrowRight') {
            setTimeout(() => {
                if (otp[index + 1]) otp[index + 1].focus();
            }, 0);
        }
    })
})

//Form nhập email
const handleSubmitEmail = async (e) => {
    e.preventDefault();
    const email = forgetPasswordForm.querySelector("form #email")
    const customerInfo = await fetch(urlAd + "/email",{
        method: "POST",
        body: email.value
    })
    if( customerInfo.status == 200 ){
        if(customerInfo.ok == true){
            forgetPasswordForm.style.display = "none"
            verifyForm.style.display = "block"
            otp[0].focus()
        }
    }else{
        toast({
            title: "Thất bại",
            message: "Email không đúng hoặc không tồn tại",
            type: "error"
        })
    }
}
forgetPasswordForm.querySelector("form").addEventListener("submit", handleSubmitEmail)


//Form xác nhận otp
const handleVerifyOtp = async (e) => {
    e.preventDefault();
    let otpValue = ''
    otp.forEach(input => {
        otpValue += input.value;
    });
    const email = forgetPasswordForm.querySelector("form #email")
    const data = {
        email : email.value,
        identify : otpValue
    }
    const customerInfo = await fetch(urlAd + "/email/identify",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    if( customerInfo.status == 200 ){
        if(customerInfo.ok == true){
            verifyForm.style.display = "none"
            resetPasswordForm.style.display = "block"
        }
        otp.forEach(input => {
            input.value = "";
        });
    }else{
        toast({
            title: "Thất bại",
            message: "Mã OTP không chính xác",
            type: "error"
        })
        otp.forEach(input => {
            input.value = "";
        });
        otp[0].focus()
    }
}
verifyForm.querySelector("form").addEventListener("submit", handleVerifyOtp)

//Form đặt lại mật khẩu
const handleResetPassword = async (e) => {
    e.preventDefault();
    const password = resetPasswordForm.querySelector("form #password")
    const verifyPassword = resetPasswordForm.querySelector("form #verify-password")
    const email = forgetPasswordForm.querySelector("form #email")
    if (password.value !== verifyPassword.value) {
        toast({
            title: "Thất bại",
            message: "Mật khẩu không trùng khớp",
            type: "error"
        })
        verifyPassword.value = ""
        password.value = ""
    } else {
        const data = {
            email : email.value,
            password : verifyPassword.value
        }
        const customerInfo = await fetch(urlAd + "/email/identify/matkhau",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        if( customerInfo.status == 200 ){
            toast({
                title: "Thành công",
                message: "Đổi mật khẩu thành công",
                type: "success"
            })
            window.location.href = "login.html"
        }else{
            toast({
                title: "Thất bại",
                message: "Vui lòng xác thực lại",
                type: "error"
            })
            verifyPassword.value = ""
            password.value = ""
        }
    }
}
resetPasswordForm.querySelector("form").addEventListener("submit", handleResetPassword)

// Thống báo toast
function toast({ title, message, type }) {
    const main = document.querySelector("#toast")
    const icons = {
        success: '<i class="fa-solid fa-circle-check"></i>',
        error: '<i class="fa-solid fa-circle-exclamation"></i>'
    }
    if (main) {
        const toast = document.createElement("div")
        toast.classList.add('toast', `toast__${type}`, 'center')
        toast.innerHTML = `
            <div class="toast__icon">
                ${icons[type]}
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${title}</h3>
                <p class="toast__message">${message}</p>
            </div>
            <div class="toast__close">
                <i class="fa-solid fa-xmark" style="color: gray;"></i>
            </div>
        `
        main.appendChild(toast)
        // Auto close
        const autoCloseId = setTimeout(function () {
            main.removeChild(toast)
        }, 4000)
        // Close when click
        toast.onclick = function () {
            // toast.style.opacity = 0
            setTimeout(function () {
                main.removeChild(toast)
            }, 300)
            clearTimeout(autoCloseId)
        }
    }
}