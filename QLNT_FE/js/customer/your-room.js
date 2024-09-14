const urlUser = "http://localhost:8080/user";

const roomPrice = document.querySelector("#roomPrice")
const typeRoom = document.querySelector("#typeRoom")
const limitRoom = document.querySelector("#limitRoom")
const startTime = document.querySelector("#startTime")
const endTime = document.querySelector("#endTime")
const f_name = document.querySelector("#f_name")
const l_name = document.querySelector("#l_name")
const gender = document.querySelector("#gender")
const email = document.querySelector("#email")
const DoB = document.querySelector("#DoB")
const phoneNumber = document.querySelector("#phoneNumber")
const address = document.querySelector("#address")
const room = document.querySelector("#room")
const listAllService = document.getElementById("list__all__service")
const eachService = document.getElementsByClassName("each__service")
const cancelIcon = document.getElementsByClassName("cancel__service")

const wrapperCancelService = document.querySelector(".wrapper__cancel__service")
const cancelServiceForm = document.getElementById("cancel__service__form")
const refuseCancelServiceBtn = document.getElementById("refuse__cancel__service__btn")
const acceptCancelServiceBtn = document.getElementById("accept__service__btn")
const contentCancel = document.getElementById("content__cancel__service")

var broadingTime
var roomNumber
var customerId
var contractId
var customerName
var roomInfoObj = {}
var dataRequest = {}
var allService

//ĐỊNH DẠNG NGÀY THÁNG THEO VÙNG VIỆT NAM
function formattedDateTime(date) {
    const dateObject = new Date(Date.parse(date));
    return dateObject.toLocaleDateString('vi-VN', {
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    });
}

//ĐỊNH DẠNG TIỀN TỆ THEO VÙNG VIỆT NAM
function formatCurrency(price) {
    const number = parseFloat(price);
    if (isNaN(number)) {
      return 'Invalid input';
    }
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(number);
    return formattedPrice.toString();
}

// THIẾT LẬP THỜI GIAN THUÊ PHÒNG
function setBoardingTime(contractDetail) {
    broadingTime = {
        start: formattedDateTime(contractDetail.beginDate).toString(),
        end: formattedDateTime(contractDetail.endDate).toString()
    }
    console.log(broadingTime) // --> OK
}

// lẤY THÔNG TIN KHÁCH HÀNG
async function getCustomerInfo () {
    const customerInfo = await fetch(urlUser + "/customer/"  + sessionStorage.getItem("id"), {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });

    
    if (customerInfo.status === 200) {
        const info = await customerInfo.json();
        if (info !== null) {
            getRoomateInfo(info.roomId)
            getRoomInfo(info.roomId)
            getAllService(info.roomId)
            roomNumber = info.roomId
            customerId = info.customerId
            customerName = info.firstName
            console.log("Customer: ", info)
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

// LẤY THÔNG TIN HỢP ĐỒNG ĐỂ TRUY XUẤT THỜI GIAN THUÊ PHÒNG
async function getContract () {
     const contractInfo = await fetch(urlUser + "/contract/room/" + roomNumber , {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });
    
    // KIỂM TRA TRẠNG THÁI TRẢ VỀ
    if (contractInfo.status === 200) {
        const contractDetail = await contractInfo.json();
        console.log(contractDetail)
        if (contractDetail !== null) { // KIỂM TRA FETCH XONG CONTRACT THÌ MỚI CHẠY HÀM RENDER
            setBoardingTime(contractDetail); // lấy ra thông tin về thời gian thuê phòng
            renderRoomInfo(roomInfoObj) // render thông tin phòng 
        } else {
            console.log("Contract is null")
        }
    } else if (contractInfo.status === 401) {
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

// LẤY THÔNG TIN PHÒNG
async function getRoomInfo (roomId) {
    const roomInfo = await fetch(urlUser + "/room/" + roomId, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });
    if (roomInfo.status === 200) {
        const detailRoomInfo = await roomInfo.json();
        if (detailRoomInfo !== null) { // KIỂM TRA ĐÃ CÓ DỮ LIỆU VỀ PHÒNG CHƯA
            getContract() // NẾU ĐÃ TẢI XONG DỮ LIỆU VỀ PHÒNG THÌ TRUYỀN ID HỢP ĐỒNG ĐỂ TRUY XUẤT THỜI GIAN THUÊ PHÒNG

            // THIẾT LẬP CÁC THUỘC TÍNH CHO BIẾN TOÀN CỤC KIỂU OBJECT VỀ THÔNG TIN PHÒNG
            roomInfoObj.id = detailRoomInfo.room.roomId
            roomInfoObj.type = detailRoomInfo.room.roomType.roomTypeName
            roomInfoObj.limit = detailRoomInfo.room.limit
            roomInfoObj.price = detailRoomInfo.room.price
        }
        console.log("Detail Room Info: ",detailRoomInfo)
    } else if (roomInfo.status === 401) {
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

// LẤY THÔNG TIN NGƯỜI CÙNG PHÒNG
async function getRoomateInfo (roomId) {
     const roomateInfo = await fetch(urlUser + "/customer/room/" + roomId, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        }
    });
    const detailRoomateInfo = await roomateInfo.json()
    console.log("Roomate: ", detailRoomateInfo)
    renderRoomateInfo(detailRoomateInfo)
}

// HIỂN THỊ THÔNG TIN PHÒNG TRỌ
function renderRoomInfo(roomObj) {
    room.textContent = roomObj.id
    roomPrice.textContent = formatCurrency(roomObj.price)
    typeRoom.textContent = roomObj.type
    limitRoom.textContent = roomObj.limit
    startTime.textContent = broadingTime.start
    endTime.textContent = broadingTime.end
}

// // HIỂN THỊ THÔNG TIN NGƯỜI CÙNG PHÒNG
function renderRoomateInfo(detailRoomateInfo) {
    if (detailRoomateInfo.length == 1) {
        document.querySelector('.show-info-roommate').innerHTML = `
                                                                    <h4 id = "no__roomate">Không có thông tin!</h4>
                                                                `
    } else {
        let htmls = []
    for (let i = 0; i < detailRoomateInfo.length; i++ ){
        if (detailRoomateInfo[i].customerId !== customerId) {
            htmls.push(
                `
                    <tr>
                        <td style = "text-wrap: nowrap">Họ và tên lót</td>
                        <td id="f_name">${detailRoomateInfo[i].lastName}</td>
                    </tr>
                    <tr>
                        <td>Tên</td>
                        <td id="l_name">${detailRoomateInfo[i].firstName}</td>
                    </tr>
                    <tr>
                        <td>Giới tính</td>
                        <td id="gender">${detailRoomateInfo[i].sex === true ? "Nam" : "Nữ"}</td>                                    
                    </tr>
                    <tr>
                        <td>Ngày sinh</td>
                        <td id="DoB">${formattedDateTime(detailRoomateInfo[i].dateOfBirth)}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td id="email">${detailRoomateInfo[i].email}</td>
                    </tr>
                    <tr>
                        <td>SĐT</td>
                        <td id="phoneNumber">${detailRoomateInfo[i].phoneNumber}</td>
                    </tr>
                    <tr>
                        <td>Địa chỉ</td>
                        <td id="address">${detailRoomateInfo[i].infoAddress}</td>
                    </tr>
                `
            )
        }
    }
    document.querySelector("#table-roommate").innerHTML = htmls.join("")
    }
}

async function getAllService (roomId) {
    const getServiceAPI = await fetch(urlUser + "/service/" + roomId, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        }
    })
    if (getServiceAPI.status === 200) {
        allService = await getServiceAPI.json()
        if (allService !== null) {
            console.log(allService)
            renderListService(allService)
            cancelServiceFunc()
        }
    }
}

function renderListService (listService) {
    serviceArr = []
    serviceArr.push(
        `
        <tr id="header__table__row">
            <th class="title__table__service">Tên dịch vụ</th>
            <th class="title__table__service">Ngày bắt đầu</th>
            <th class="title__table__service">SL</th>
            <th class="title__table__service">Giá</th>
            <th class="title__table__service"></th>
        </tr>
        `
    )
    for (let i = 0; i < listService.length; i++) {
        serviceArr.push(
            `
            <tr class="each__service">
                <td class="content__table__service">${listService[i].service.serviceName}</td>
                <td class="content__table__service">${formattedDateTime(listService[i].beginDate)}</td>
                <td class="content__table__service">${listService[i].quantity}</td>
                <td class="content__table__service">${formatCurrency(listService[i].service.price)}</td>
                <td class="cancel__service"><i class="fa-solid fa-xmark"></i></td>
            </tr>
            `
        )
    }
    document.querySelector("#list__all__service").innerHTML = serviceArr.join("")
}

function cancelServiceFunc() {
    for (let i = 0; i < cancelIcon.length; i++) {
        cancelIcon[i].addEventListener('click', () => {
            wrapperCancelService.style.display = 'flex'
            console.log(allService[i].service.serviceName)
            contentCancel.textContent = "Bạn có chắc muốn hủy dịch vụ " + allService[i].service.serviceName + " không ?"
            dataRequest.content = allService[i].service.serviceName
        })
    }
}

acceptCancelServiceBtn.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    cancelServiceForm.addEventListener('submit',sendRequest(dataRequest.content, roomNumber, customerName))
})

refuseCancelServiceBtn.addEventListener('click', () => {
    wrapperCancelService.style.display = 'none'
})

wrapperCancelService.addEventListener('click', () => {
    wrapperCancelService.style.display = 'none'
})

async function sendRequest(serviceName, roomId, customerName) {
    const data = "Yêu cầu hủy dịch vụ " + serviceName + " của phòng " + roomId + " từ khách hàng " + customerName
    const requestAPI = await fetch(urlUser + "/request/" + customerId + "/add" , {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: data
    })
    if (requestAPI.status === 200) {
        toast({
            title: "Thành công",
            message: "Đã gửi yêu cầu. Vui lòng chờ phê duyệt!",
            type: "success"
        })
    } else if (requestAPI.status === 401) {
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
    wrapperCancelService.style.display = 'none'
}

getCustomerInfo()
