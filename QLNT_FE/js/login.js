const url = 'http://localhost:8080/authenticate'

// khai bao
const from_login = document.getElementsByClassName('form_login')[0];
    
// an hien mat khau
function togglePassword() {
    const passwordField = document.querySelector("#password");
    if (passwordField.type === "password") {
        passwordField.type = "text";
        document.querySelector(".fa-eye").style.display="none";
        document.querySelector(".fa-eye-slash").style.display="inline";
    } else {
        passwordField.type = "password";
        document.querySelector(".fa-eye").style.display="inline";
        document.querySelector(".fa-eye-slash").style.display="none";
    }
}

// kiem tra dang nhap
const login = async ( url, data ) =>{
    const  response = await fetch(url, {
        method : "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    return response;
}

//ham khi form submid
const handleForm = async (e) => {
    e.preventDefault(); // ngan lam moi form

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    const token = await login(url, {
        'username' : username,
        'password' : password
    });
    if( token.status === 401){
        toast({
            title: "Thất bại",
            message: "Đăng nhập không thành công",
            type: "error"
        })
        // bao khi sai tk mk
    } else if ( token.status === 200 ){
        const token_data = await token.json();
        console.log(token_data);
        console.log(token_data.ThongTin);
        sessionStorage.setItem("token" , token_data.token);
        if( token_data.ThongTin === "ADMIN"){
            window.location.href = ' admin/home.html';
        } else {
            sessionStorage.setItem("id", token_data.ThongTin.customerId)
            sessionStorage.setItem("name", token_data.ThongTin.firstName)
            window.location.href = 'customer/your-room.html';
        }
    }
}

// action form
from_login.addEventListener("submit", (e)=>{handleForm(e)});

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
