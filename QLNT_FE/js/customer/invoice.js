const dialog = document.querySelector('.background')

const urlUser = "http://localhost:8080/user";

// CÁC THẺ CỦA BILL THÁNG HIỆN TẠI
const invoiceStatus = document.getElementById("content__status")
const renderTitle = document.getElementById("render__title")
const room = document.getElementById("room")
const startTime = document.getElementById("startTime")
const endTime = document.getElementById("endTime")

const priceRoom = document.getElementById("priceRoom")
const totalRoom = document.getElementById("totalRoom")

const startElec = document.getElementById("startElec")
const priceElec = document.getElementsByClassName("priceElec")
const endElec = document.getElementById("endElec")
const amountOfUsingElec = document.getElementById("amountOfUsingElec")
const totalElec = document.getElementById("totalElec")

const startWater = document.getElementById("startWater")
const priceWater = document.getElementsByClassName("priceWater")
const endWater = document.getElementById("endWater")
const amountOfUsingWater = document.getElementById("amountOfUsingWater")
const totalWater = document.getElementById("totalWater")

const serviceField = document.getElementById("serviceField") 
const totalPrice = document.getElementById("totalPrice")
const textNote = document.getElementById("text-note")

const electricityPrice = document.querySelector("#electricityPrice")
const changeElecDate = document.getElementById("change__elec__date")
const changeWaterDate = document.getElementById("change__water__date")
const waterPrice = document.querySelector("#waterPrice")

// CÁC THẺ CỦA CÁC THÁNG
const eachmonth = document.querySelectorAll(".each__month")
const wrapperMonth = document.querySelectorAll(".month")

// CÁC THẺ HÓA ĐƠN HIỂN THỊ CHO TỪNG THÁNG
const numberBill = document.getElementById("number__bill")
const numberOfRoom = document.getElementById("number__of__room")
const startTimeDialog = document.getElementById("start__time__dialog")
const endTimeDialog = document.getElementById("end__time__dialog")
const roomPriceDialog = document.getElementById("room__price__dialog")
const totalRoomPrice = document.getElementById("total_room__price")
const startElecDialog = document.getElementById("start__elec__dialog")
const elecQuotation = document.getElementsByClassName("elec__quotation")
const endElecDialog = document.getElementById("end__elec__dialog")
const amountOfElec = document.getElementById("amount_of__elec")
const totalElecDialog = document.getElementById("total__elec__dialog")
const startWaterDialog = document.getElementById("start__water__dialog")
const waterQuotation = document.getElementsByClassName("water__quotation")
const endWaterDialog = document.getElementById("end__water__dialog")
const amountOfWater = document.getElementById("amount__of__water")
const totalWaterDialog = document.getElementById("total__water__dialog")
const totalInvoiceDialog = document.getElementById("total__invoice__dialog")
const textnoteArea = document.querySelector(".textnote__area")

const monthYearLookup = document.getElementById("lookup__invoice")
const warningYear = document.getElementById("warning__year")
const lookupBtn = document.getElementById("lookup__btn")

var roomPrice
var roomId
var priceOfElec
var priceOfWater
var totalPriceInvoice = {}
var totalPriceInvoiceEachMonth = {}
var totalService = 0
var totalServiceEachMonth = 0
var statusOfInvoice

// HÀM LẤY THÔNG TIN HÓA ĐƠN KHI NGƯỜI DÙNG NHẤP VÀO THÁNG BẤT KÌ
function invoiceEachMonth() {
    const regex = /[0-9]/g;
    for (let i = 0; i < wrapperMonth.length; i++) {
        wrapperMonth[i].addEventListener('click', () => {
            getInvoice(roomId, wrapperMonth[i].textContent.toString().match(regex)[0] + wrapperMonth[i].textContent.toString().match(regex)[1], getCurrentDate().year, false)
        })
    }
}
invoiceEachMonth()

function renderInvoiceOfEachMonth (invoice) {
    numberBill.textContent = "Chi tiết hóa đơn số " + invoice.billId
    numberOfRoom.textContent = invoice.roomId
    startTimeDialog.textContent = formattedDateTime(invoice.beginDate, true)
    endTimeDialog.textContent = formattedDateTime(invoice.endDate, true)
    roomPriceDialog.textContent = formatCurrency(invoice.roomPrice)
    totalRoomPrice.textContent = formatCurrency(1 * invoice.roomPrice)
    totalPriceInvoiceEachMonth.room = 1 * invoice.roomPrice

    startElecDialog.textContent = invoice.electricNumberBegin
    for (let i = 0; i < elecQuotation.length; i++) {
        elecQuotation[i].textContent =  formatCurrency(invoice.electricPrice)
    }
    endElecDialog.textContent = invoice.electricNumberEnd
    amountOfElec.textContent = invoice.electricNumberEnd - invoice.electricNumberBegin
    totalElecDialog.textContent = formatCurrency((invoice.electricNumberEnd - invoice.electricNumberBegin) * invoice.electricPrice)
    totalPriceInvoiceEachMonth.electricity = (invoice.electricNumberEnd - invoice.electricNumberBegin) * invoice.electricPrice

    startWaterDialog.textContent = invoice.waterNumberBegin
    for (let i = 0; i < waterQuotation.length; i++) {
        waterQuotation[i].textContent = formatCurrency(invoice.waterPrice)
    }
    endWaterDialog.textContent = invoice.waterNumberEnd
    amountOfWater.textContent = invoice.waterNumberEnd - invoice.waterNumberBegin
    totalWaterDialog.textContent = formatCurrency((invoice.waterNumberEnd - invoice.waterNumberBegin) * invoice.waterPrice)
    totalPriceInvoiceEachMonth.water = (invoice.waterNumberEnd - invoice.waterNumberBegin) * invoice.waterPrice

    renderService(invoice, "service__field__dialog", false)
    totalInvoiceDialog.textContent = formatCurrency(
                                                    // totalPriceInvoiceEachMonth.room
                                                    // + totalPriceInvoiceEachMonth.electricity
                                                    // + totalPriceInvoiceEachMonth.water 
                                                    // + totalServiceEachMonth
                                                    invoice.total
                                                )
    if (invoice.note !== null) {
        textnoteArea.value = invoice.note
    }
}

function renderInvoice (invoiceInfo) {
    if (!invoiceInfo.isPaid) {
        document.getElementById("wrapper__content__status").innerHTML = `
                                                                            <h4 id="content__status">Chưa thanh toán</h4>
                                                                            <i class="fa-solid fa-circle-xmark" id="checked__icon"></i>
                                                                        `
    } else  {
        document.getElementById("wrapper__content__status").innerHTML = `
                                                                            <h4 id="content__status">Đã thanh toán</h4>
                                                                            <i class="fa-solid fa-circle-check" id="checked__icon"></i>
                                                                        `
    }
    renderTitle.textContent = "Chi tiết hóa đơn số "+ invoiceInfo.billId
    room.textContent = invoiceInfo.roomId
    startTime.textContent = formattedDateTime(invoiceInfo.beginDate, true)
    endTime.textContent = formattedDateTime(invoiceInfo.endDate, true)
    priceRoom.textContent = formatCurrency(invoiceInfo.roomPrice)
    for (let i = 0; i < priceElec.length; i++) {
        priceElec[i].textContent =  formatCurrency(invoiceInfo.electricPrice)
    }
    for (let i = 0; i < priceWater.length; i++) {
        priceWater[i].textContent =  formatCurrency(invoiceInfo.waterPrice)
    }
    
    totalRoom.textContent = formatCurrency((1 * invoiceInfo.roomPrice).toString())
    totalPriceInvoice.totalRoomPrice = 1 * invoiceInfo.roomPrice

    startElec.textContent = invoiceInfo.electricNumberBegin
    endElec.textContent = invoiceInfo.electricNumberEnd
    startWater.textContent = invoiceInfo.waterNumberBegin
    endWater.textContent = invoiceInfo.waterNumberEnd
    amountOfUsingElec.textContent = (invoiceInfo.electricNumberEnd - invoiceInfo.electricNumberBegin).toString()
    totalElec.textContent = formatCurrency(((invoiceInfo.electricNumberEnd - invoiceInfo.electricNumberBegin) * invoiceInfo.electricPrice))
    totalPriceInvoice.totalElecPrice = ((invoiceInfo.electricNumberEnd - invoiceInfo.electricNumberBegin) * invoiceInfo.electricPrice)
    amountOfUsingWater.textContent = (invoiceInfo.waterNumberEnd - invoiceInfo.waterNumberBegin).toString()
    totalWater.textContent = formatCurrency((invoiceInfo.waterNumberEnd - invoiceInfo.waterNumberBegin) * invoiceInfo.waterPrice)
    totalPriceInvoice.totalWaterPrice = (invoiceInfo.waterNumberEnd - invoiceInfo.waterNumberBegin) * invoiceInfo.waterPrice

    renderService(invoiceInfo, "serviceField", true)

    totalPrice.textContent = formatCurrency(
                                            //totalPriceInvoice.totalRoomPrice + totalPriceInvoice.totalElecPrice + totalPriceInvoice.totalWaterPrice + totalService
                                            invoiceInfo.total
                                        )
    if (invoiceInfo.note !== null) {
        textNote.value = invoiceInfo.note
    }
}   

function renderService (invoice, div, option) {
    const serviceArr = invoice.service
    const htmls = []
    for (let i = 0; i < serviceArr.length; i++) {
        htmls.push( `
                <div class="header-others">
                    <span>${serviceArr[i].serviceName}</span>
                    <span id="amount" style="font-weight: 600;">${serviceArr[i].quantity}</span>
                    <span id="priceOther" style="font-weight: 600;">${formatCurrency(serviceArr[i].price)}</span>
                    <span>VND</span>
                    <span class="totalOther" style="font-weight: 600;">${formatCurrency(serviceArr[i].price * serviceArr[i].quantity)}</span>
                </div>
                    `
        )
        if (option === true) {
            totalService += serviceArr[i].price * serviceArr[i].quantity
        } else {
            totalServiceEachMonth += serviceArr[i].price * serviceArr[i].quantity
        }
    }
    document.getElementById(div).innerHTML = htmls.join("")
    
    console.log(serviceArr)
    console.log("Total Service: ", totalServiceEachMonth)
}


//ĐỊNH DẠNG NGÀY THÁNG THEO VÙNG VIỆT NAM
function formattedDateTime(date, option) {
    const dateObject = new Date(Date.parse(date));
    if (option) {
        return dateObject.toLocaleDateString('vi-VN', {
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
        });
    } else  {
        return dateObject.toLocaleDateString('vi-VN', {
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

function formatCurrency(number) {
    // Chuyển đổi số sang chuỗi
    const str = number.toString();
  
    // Tách chuỗi thành phần nguyên
    const whole = str
  
    // Thêm dấu phẩy vào phần nguyên
    const formattedWhole = whole.replace(/\B(?=(\d{3})+$)/g, ',');
  
    // Loại bỏ dấu chấm và trả về chuỗi định dạng tiền tệ
    return formattedWhole.replace('.', '');
  }
  
function getCurrentDate () {
    const current = new Date()
    let dateTimeObj = {}
    dateTimeObj.month = current.getMonth().toString()
    dateTimeObj.year = current.getFullYear().toString()

    return dateTimeObj
}


async function getCustomerInfo() {
    const customerInfo = await fetch(urlUser + "/customer/" + sessionStorage.getItem('id') , {
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });
    if (customerInfo.status === 200) {
        const info = await customerInfo.json();
        console.log(info)
        roomId = info.roomId
        getRoomInfo(info.roomId)
    }
}

getCustomerInfo()

async function getInvoice(roomId, month, year, option) {
    const invoiceInfo = await fetch(urlUser + "/bill/" + roomId + "/" + month + "/" + year , {
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });
    if (invoiceInfo.status === 200) {
        const detailInvoice = await invoiceInfo.json()
        if (detailInvoice !== null) {
            if (option === true) {
                renderInvoice(detailInvoice)
            } else {
                dialog.style.display = 'flex'   
                renderInvoiceOfEachMonth(detailInvoice)
            }
            console.log("Detail Invoice: ", detailInvoice)
        }    
    } else if (invoiceInfo.status === 500) {
        toast({
            title: "Lỗi",
            message: "Không tìm thấy hóa đơn tháng " + month + ", " + year + "!",
            type: "error"
        })
    } else if (invoiceInfo.status === 401) {
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
            roomPrice = detailRoomInfo.room.price
            getElectricity()
            getWater()
            getInvoice(roomId, getCurrentDate().month, getCurrentDate().year, true)
            console.log("Room info: ",detailRoomInfo)
            console.log("Room price: ", roomPrice)
        }
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

async function getElectricity() {
    const electricityInfo = await fetch(urlUser + "/price/electric/all" , {
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });
    const detailelectricityInfo = await electricityInfo.json()
    electricityPrice.textContent = formatCurrency(detailelectricityInfo[0].price) + " VND"
    priceOfElec = detailelectricityInfo[0].price
    changeElecDate.textContent = formattedDateTime(detailelectricityInfo[0].changedDate, false)
    console.log(detailelectricityInfo)
}

async function getWater() {
    const waterInfo = await fetch(urlUser + "/price/water/all" , {
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });
    const detailWaterInfo = await waterInfo.json()
    waterPrice.textContent = formatCurrency(detailWaterInfo[0].price) + " VND"
    changeWaterDate.textContent = formattedDateTime(detailWaterInfo[0].changedDate, false)
    priceOfWater = detailWaterInfo[0].price
    console.log(detailWaterInfo)
}

const resultLookup = document.getElementById("title__result__lookup")     

lookupBtn.addEventListener('click', () => {
    const dataInput = monthYearLookup.value.split("-")
    console.log(dataInput)
    if (dataInput[0] > getCurrentDate().year) {
        warningYear.textContent = "Năm tra cứu không lớn hơn năm hiện tại"
        warningYear.style.opacity = 1
    } else if (dataInput.length === 1) {
        warningYear.textContent = "Vui lòng chọn tháng và năm để tra cứu"
        warningYear.style.opacity = 1
    } else {
        getInvoice(roomId, dataInput[1], dataInput[0], false)   
        resultLookup.style.opacity = 1
        warningYear.style.opacity = 0
    }
})

monthYearLookup.addEventListener('change', () => {
    lookupBtn.disabled = false
    lookupBtn.style.opacity = 1
})

const background = document.querySelector(".background")
const wrapperDetailDialog = document.querySelector('.wrapper_detail_dialog')

background.addEventListener('click', () => {
    dialog.style.display = 'none'
    resultLookup.style.opacity = 0 
})

wrapperDetailDialog.addEventListener('click', (e) => {
    e.stopPropagation()
})

