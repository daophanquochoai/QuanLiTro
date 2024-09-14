const header = document.querySelector(".header")

var urlAd = "http://localhost:8080/admin"
var urlUsr = "http://localhost:8080/user"

var username

var editForm
var changeForm
var logoutForm

var editProfile
var modalEditProfile
var cancelBtn
var modalchangePassword
var changePassword
var cancelChangePassword
var saveChangePassword
var logout
var cancelLogoutBtn
var logoutBtn
var logoutBtnForm

var fName
var lName
var female
var male 
var dOb 
var idCard 
var emailAddress 
var numberPhone
var addressLine
var cancelEditBtn
var saveEditBtn 
var inputInfor

var noticeItems
var newPassword
var confirmNewPassword
var wrong

var detailCustomerInfo
var dataCustomerUpdate 

var checkUpdateInfo
var checkLastName
var checkFirstName
var checkGender
var checkDob
var checkIdCard
var checkMail
var checkPhoneNumber
var checkAddress

var dataInfoCustomer = {}
var dataInput = {}
var listAllCustomer

function fillDataToEdit(info) {
    fName.value = info.firstName
    lName.value = info.lastName
    if (info.sex === true) {
        male.checked = true
    } else {
        female.checked = true
    }
    dOb.value = info.dateOfBirth
    idCard.value = info.identifier
    emailAddress.value = info.email
    numberPhone.value = info.phoneNumber
    addressLine.value = info.infoAddress

    dataInfoCustomer.fname = info.firstName
    dataInfoCustomer.lname = info.lastName
    dataInfoCustomer.gender = info.sex.toString()
    dataInfoCustomer.dOb = info.dateOfBirth
    dataInfoCustomer.identifier = info.identifier
    dataInfoCustomer.mail = info.email
    dataInfoCustomer.phoneNumber = info.phoneNumber
    dataInfoCustomer.address = info.infoAddress
}

const sendToUpdateCustomer = async (e) => {
    e.preventDefault();
    const data = {
        'customerId': dataCustomerUpdate.customerId,
        'roomId': dataCustomerUpdate.roomId,
        'firstName': fName.value,
        'lastName': lName.value,
        'sex': male.checked,
        'dateOfBirth': dOb.value,
        'identifier': idCard.value,
        'email': emailAddress.value,
        'phoneNumber': numberPhone.value,
        'infoAddress': addressLine.value
    }
    
    // CẬP NHẬT LẠI DỮ LIỆU 
    dataCustomerUpdate = data
    username.textContent = dataCustomerUpdate.firstName

    console.log(data)
    const check = await fetch(`${urlAd}/customer/${detailCustomerInfo.customerId}/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify(data)
    });
    if (check.status == 200) {
        toast({
            title: "Thành công",
            message: "Thông tin đã được cập nhật !",
            type: "success"
        })
    } else {
        toast({
            title: "Thất bại",
            message: "Thao tác thất bại",
            type: "error"
        })
    }
    fillDataToEdit(dataCustomerUpdate)
    modalEditProfile.style.display = "none"
}

const sendToUpdatePassword = async (e) => {
    e.preventDefault()
    const dataPassword = newPassword.value

    console.log(dataPassword)
    const changePasswordAPI = await fetch(`${urlUsr}/update/password/${detailCustomerInfo.customerId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: dataPassword
    });
    if (changePasswordAPI.status == 200) {
        toast({
            title: "Thành công",
            message: "Mật khẩu mới đã được lưu",
            type: "success"
        })
    } else {
        toast({
            title: "Thất bại",
            message: "Thao tác thất bại",
            type: "error"
        })
    }
    newPassword.value = confirmNewPassword.value = ""
    modalchangePassword.style.display = "none"
}

function togglePassword() {
    const checkShowPassword = document.getElementById("check__show__password")
    checkShowPassword.checked = false
    checkShowPassword.addEventListener('click', () => {
        if (checkShowPassword.checked) {
            newPassword.type = 'text'
            confirmNewPassword.type = 'text'
        } else {
            newPassword.type = 'password'
            confirmNewPassword.type = 'password'
        }
    })
}

async function getTopNotice () {
    let topOfNotice = []
    const getAllNoticeAPI = await fetch(urlUsr + "/request/history/" + dataCustomerUpdate.customerId + "/false", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        }
    })
    if (getAllNoticeAPI.status === 200) {
        const listAllRequest = await getAllNoticeAPI.json()
        if (listAllRequest !== null) {
            topOfNotice = listAllRequest
            renderTopNotice(topOfNotice)
        }
    } else if (getAllNoticeAPI.status === 401) {
        toast({
            title: "Hết hạn đăng nhập",
            message: "Vui lòng đăng nhập lại",
            type: "error"
        })
        const logout = setTimeout(() => { window.location.href = '../login.html' }, 3000);
    } else {
        toast({
            title: "Loading...",
            message: "Dữ liệu lỗi!!!",
            type: "error"
        })
    }
}

function renderTopNotice(list) {
    let noticeArr = []
    if (list.length === 0) {
        noticeArr.push(
            `   
                <div id="wrapper__no__notice">
                    <i class="fa-solid fa-circle-exclamation" id="no__notice__icon"></i>
                    <h4 id="no__notice"> Không có thông báo !</h4>
                </div>
            `
        )
        document.querySelector(".noti-icon").style.animation = 'none'
        document.querySelector(".notice__coming").style.animation = 'none'
        document.getElementById("body__notice").innerHTML = noticeArr.join("")
        document.getElementById("wrapper__more__notice").style.display = 'none'
        return false
    } else {
        for (let i = 0; i < list.length; i++) {
            if (i < 4) {
                noticeArr.push(
                    `
                    <li class="notice__item">
                        <div class="wrapper__order__notice"><span class="order__notice__out">${i + 1}</span></div>
                        <p class="content__notice">${list[i].message}</p>
                    </li>
                    `
                )
            }
        }
        document.getElementById("overlook__notice__list").innerHTML = noticeArr.join("")
    }
    
    for (let i = 0; i < noticeItems.length; i++) {
        noticeItems[i].addEventListener('click', (e) => {
            console.log(e.target)
            window.location.href = './notice.html';
        })
    }
}

const includingHeader = async () => {
    fetch("../customer/include/header.html")
    .then(response => response.text())
    .then(content => {
        header.innerHTML = content;

        username = document.getElementById("text-content")

        editForm = document.getElementById("edit__form")
        changeForm = document.getElementById("change__form")
        logoutForm = document.getElementById("logout__form")

        editProfile = document.querySelector('#edit__profile')
        modalEditProfile = document.querySelector('.wrapper__edit__profile')
        cancelBtn = document.querySelector('#cancel__btn')
        modalchangePassword = document.querySelector('.wrapper__change__password')
        changePassword = document.querySelector('#change__password')
        cancelChangePassword = document.querySelector('#cancel__change__btn')
        saveChangePassword = document.getElementById("save__change__btn")
        logout = document.querySelector('.wrapper__logout')
        cancelLogoutBtn = document.getElementById('cancel__logout__btn')
        logoutBtn = document.getElementById('logout__wrapper')
        logoutBtnForm = document.getElementById("logout__btn")
        
        lName = document.getElementById("l_name")
        fName = document.getElementById("f_name")
        male = document.getElementById("male")
        female = document.getElementById("female")
        dOb = document.getElementById("dOb")
        idCard = document.getElementById("id_card")
        emailAddress = document.getElementById("email")
        numberPhone = document.getElementById("numberPhone")
        addressLine = document.getElementById("address")
        cancelEditBtn = document.getElementById("cancel__btn")
        saveEditBtn = document.getElementById("save__btn")
        inputInfor = document.getElementsByClassName("input__infor")

        noticeItems = document.getElementsByClassName("notice__item")
        newPassword = document.getElementById("newPassword")
        confirmNewPassword = document.getElementById("comfirmNewPassword")
        wrong = document.getElementById("wrong")

        checkUpdateInfo = document.getElementsByClassName("check__update__info")
        checkLastName = document.getElementById("check__last__name")
        checkFirstName = document.getElementById("check__first__name")
        checkGender = document.getElementById("check__gender")
        checkDob = document.getElementById("check__dOb")
        checkIdCard = document.getElementById("check__id__card")
        checkMail = document.getElementById("check__mail")
        checkPhoneNumber = document.getElementById("check__phone__number")
        checkAddress = document.getElementById("check__address")

        getAllCustomer()

        // BẮT SỰ KIỆN NHẬP VÀO Ô INPUT CHỈNH THÔNG TIN ĐỂ BẬT NÚT LƯU
        saveEditBtn.disabled  = true
        saveEditBtn.style.opacity = 0.8
        for (let i = 0; i < inputInfor.length; i++) {
            inputInfor[i].addEventListener('input', () => {
                saveEditBtn.disabled  = false
                saveEditBtn.style.opacity = 1
            })
        }

        // NGĂN SỰ KIỆN CLICK CHUỘT VÀO FORM EDIT ẢNH HƯỞNG ĐẾN THẺ CHA
        editForm.addEventListener('click', (e) => {
            e.stopPropagation()
        })
        changeForm.addEventListener('click', (e) => {
            e.stopPropagation()
        })
        logoutForm.addEventListener('click', (e) => {
            e.stopPropagation()
        })

        // BẬT CHỈNH THÔNG TIN, FILL DỮ LIỆU VÀO CÁC Ô INPUT VÀ TẮT 2 MODAL KIA
        editProfile.addEventListener('click', () => {
            modalEditProfile.style.display = 'flex';
            modalchangePassword.style.display = 'none';
            logout.style.display = 'none'
            fillDataToEdit(dataCustomerUpdate)
            console.log("Edit")
        })

        // KHI ẤN LƯU SẼ THỰC HIỆN GỬI THÔNG TIN
        saveEditBtn.addEventListener('click', (e) => {   
            // e.preventDefault()         
            if (lName.value === "") {
                e.preventDefault()
                checkLastName.style.opacity = 1
            } else {
                checkLastName.style.opacity = 0
            }
            if (fName.value === "") {
                e.preventDefault()
                checkFirstName.style.opacity = 1
            } else {
                checkFirstName.style.opacity = 0
            }
            if (dOb.value === "") {
                e.preventDefault()
                checkDob.textContent = "Vui lòng nhập ngày tháng năm sinh"
                checkDob.style.opacity = 1
            } else if (validateDate() === false) {
                e.preventDefault()
                checkDob.style.opacity = 1
            } else {
                checkDob.style.opacity = 0
            } 
            if (idCard.value === "") {
                e.preventDefault()
                checkIdCard.textContent = "Vui lòng nhập số CCCD"
                checkIdCard.style.opacity = 1
            } else if (idCard.value.length !== 12) {
                e.preventDefault()
                checkIdCard.textContent = "Số CCCD độ dài là 12 số"
                checkIdCard.style.opacity = 1
            } else if (!checkDuplicateIdCard(listAllCustomer, idCard.value.toString())) {
                e.preventDefault()
                checkIdCard.textContent = "Số CCCD đã được sử dụng"
                checkIdCard.style.opacity = 1
            } else {
                checkIdCard.style.opacity = 0
            }
            if (emailAddress.value === "") {
                e.preventDefault()
                checkMail.textContent = "Vui lòng nhập địa chỉ email"
                checkMail.style.opacity = 1
            } else if (!emailAddress.value.includes("@")) {
                e.preventDefault()
                checkMail.textContent = "Địa chỉ email không đúng định dạng"
                checkMail.style.opacity = 1
            } else if (emailAddress.value.length <= 11) {
                e.preventDefault()
                checkMail.textContent = "Địa chỉ email không đúng định dạng"
                checkMail.style.opacity = 1
            } else {
                checkMail.style.opacity = 0
            }
            if (numberPhone.value === "") {
                e.preventDefault()
                checkPhoneNumber.textContent = "Vui lòng nhập số điện thoại"
                checkPhoneNumber.style.opacity = 1
            } else if (numberPhone.value.length !== 10) {
                e.preventDefault()
                checkPhoneNumber.textContent = "Số điện thoại độ dài là 10 số"
                checkPhoneNumber.style.opacity = 1
            } else if (!numberPhone.value.startsWith("0")) {
                e.preventDefault()
                checkPhoneNumber.textContent = "Số điện thoại phải bắt đầu bằng số 0"
                checkPhoneNumber.style.opacity = 1
            } else if (!checkDuplicatePhoneNumber(listAllCustomer, numberPhone.value.toString())) {
                e.preventDefault()
                checkPhoneNumber.textContent = "Số điện thoại đã được sử dụng"
                checkPhoneNumber.style.opacity = 1
            } else {
                checkPhoneNumber.style.opacity = 0
            }
            if (addressLine.value === "") {
                e.preventDefault()
                checkAddress.style.opacity = 1
            } else if (addressLine.value.length <= 2) {
                e.preventDefault()
                checkAddress.textContent = "Vui lòng nhập địa chỉ chi tiết hơn"
                checkAddress.style.opacity = 1
            }
            else {
                checkAddress.style.opacity = 0
            }

            dataInput.fname = fName.value
            dataInput.lname = lName.value
            dataInput.gender = male.checked.toString()
            dataInput.dOb = dOb.value
            dataInput.identifier = idCard.value
            dataInput.mail = emailAddress.value
            dataInput.phoneNumber = numberPhone.value
            dataInput.address = addressLine.value

            console.log(dataInfoCustomer, dataInput)
            if (compareObject(dataInfoCustomer, dataInput) === true) {
                e.preventDefault()
                modalEditProfile.style.display = 'none';
                toast({
                    title: "Chú ý",
                    message: "Thông tin của bạn không có gì thay đổi !",
                    type: "warning"
                })
            } else {
                console.log("Thông tin có thay đổi")
                editForm.addEventListener("submit", sendToUpdateCustomer)
            }
        })

        modalEditProfile.addEventListener('click', (e) => {
            modalEditProfile.style.display = 'none';
        })

        cancelBtn.addEventListener('click', () => {
            modalEditProfile.style.display = 'none';
            newPassword.value = ""
            confirmNewPassword.value = ""
        })
        
        changePassword.addEventListener('click', () => {
            modalEditProfile.style.display = 'none';
            modalchangePassword.style.display = 'flex';
            logout.style.display = 'none'
            togglePassword()
        })
        
        modalchangePassword.addEventListener('click', () => {
            modalchangePassword.style.display = 'none';
            newPassword.value = ""
            confirmNewPassword.value = ""
        })
        
        cancelChangePassword.addEventListener('click', () => {
            modalchangePassword.style.display = 'none'
            newPassword.value = ""
            confirmNewPassword.value = ""
        })

        saveChangePassword.addEventListener('click', (e) => {
            if (newPassword.value === "") {
                e.preventDefault()
                wrong.textContent = "Vui lòng nhập mật khẩu mới !"
                wrong.style.opacity = 1
            } else if (newPassword.value.length < 5) {
                e.preventDefault()
                wrong.textContent = "Mật khẩu phải trên 5 kí tự !"
                wrong.style.opacity = 1
            } else if (confirmNewPassword.value === "") {
                e.preventDefault()
                wrong.textContent = "Vui lòng xác nhận mật khẩu mới !"
                wrong.style.opacity = 1
            } else if (newPassword.value !== confirmNewPassword.value) {
                e.preventDefault()
                wrong.textContent = "Nhập lại mật khẩu không khớp!"
                wrong.style.opacity = 1
            } else {
                wrong.style.opacity = 0
                changeForm.addEventListener("submit", sendToUpdatePassword)
                console.log(newPassword.value)
            }
            console.log(newPassword.value)
        })

        logoutBtnForm.addEventListener('click', (e) => {
            e.preventDefault()
            sessionStorage.clear();
            window.location.href = '../../html/login.html';
        })
        
        logoutBtn.addEventListener('click', () => {
            modalEditProfile.style.display = 'none';
            modalchangePassword.style.display = 'none';
            logout.style.display = 'flex'
        })
        
        logout.addEventListener('click', () => {
            logout.style.display = 'none'
        })
        
        cancelLogoutBtn.addEventListener('click', () => {
            logout.style.display = 'none'
        })
        const currentPage = window.location.pathname.split('/').pop(); // Xác định trang hiện tại
        const listItems = document.querySelectorAll(".wrapper-functions div")
        listItems.forEach(item => {
            if (item.id + ".html" === currentPage) {
                item.classList.add('active');
            }
        })
        
    })
    .catch(error => console.error('Error fetching header:', error));
}

function compareObject(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (let key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  }
  

function validateDate() {
    const now = new Date()
    if (new Date(dOb.value) >= now) {
        console.log("Nhỏ hơn ngày hiện tại")
        checkDob.textContent = "Năm sinh phải nhỏ hơn hiện tại"
        return false
    } else if (now.getFullYear() - new Date(dOb.value).getFullYear() < 18) {
        checkDob.textContent = "Khách hàng phải từ 18 tuổi trở lên"
        return false
    }
    return true
}

async function getAllCustomer() {
    const getAll = await fetch(urlUsr + "/customer/getAll" ,{
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    })
    if (getAll.status === 200) {
        const listAll = await getAll.json()
        if (listAll !== null) {
            listAllCustomer = listAll
        }
        console.log("List all customer: ",listAllCustomer)
    }
}

function checkDuplicateIdCard(arr, condition2) {
    if (arr.length === 0) {
        return false
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].identifier === condition2 && dataCustomerUpdate.customerId !== arr[i].customerId) {
            return false
        }
    }
    return true
}

function checkDuplicatePhoneNumber(arr, condition) {
    let count = 0
    if (arr.length === 0) {
        return false
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].phoneNumber === condition && dataCustomerUpdate.customerId !== arr[i].customerId) {
            return false
        }
    }
    return true
}


async function getCustomerInfo() {
    const customerInfo = await fetch(urlUsr + "/customer/" + sessionStorage.getItem("id"),{
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    })
    if (customerInfo.status === 200) {
        detailCustomerInfo = await customerInfo.json()
        if (detailCustomerInfo !== null) {
            // GÁN DỮ LIỆU CHO ĐỐI TƯỢNG
            dataCustomerUpdate = detailCustomerInfo
            username.textContent = dataCustomerUpdate.firstName
            getTopNotice()
            console.log(detailCustomerInfo) 
        }
    } else if (customerInfo.status === 401) {
        toast({
            title: "Hết hạn đăng nhập",
            message: "Vui lòng đăng nhập lại",
            type: "error"
        })
        const logout = setTimeout(() => { window.location.href = '../login.html' }, 3000);
    } else {
        toast({
            title: "Loading...",
            message: "Dữ liệu lỗi!!!",
            type: "error"
        })
    }
}
includingHeader()
getCustomerInfo()


// Thống báo toast
function toast({ title, message, type }) {
    const main = document.querySelector("#toast")
    const icons = {
        success: '<i class="fa-solid fa-circle-check"></i>',
        error: '<i class="fa-solid fa-circle-exclamation"></i>',
        warning: '<i class="fa-solid fa-triangle-exclamation"></i>'
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