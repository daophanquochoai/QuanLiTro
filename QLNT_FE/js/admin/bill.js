const billList = document.querySelector(".bill-list__container");

//Thông tin trong modal
const modalBill = document.querySelector(".modal-bill")
const billId = document.querySelector("#bill-id");
const roomId = document.querySelector("#room-id");
const period = document.querySelector(".period");
const beginDate = document.querySelector("#begin-date");
const endDate = document.querySelector("#end-date");
const billMonth = document.querySelector("#bill-month");
const roomPrice = document.querySelector(".room-price");
const roomTotalPrice = document.querySelector(".room-total-price");
const electricPrice = document.querySelector(".electric-price");
const electricConsume = document.querySelector(".electric-consume");
const electricNumberBegin = document.querySelector(".electric-number_begin");
const electricNumberEnd = document.querySelector(".electric-number_end");
const electricTotalPrice = document.querySelector(".electric-total-price");
const waterPrice = document.querySelector(".water-price");
const waterConsume = document.querySelector(".water-consume");
const waterNumberBegin = document.querySelector(".water-number_begin");
const waterNumberEnd = document.querySelector(".water-number_end");
const waterTotalPrice = document.querySelector(".water-total-price");
const tableService = document.querySelector(".table-service tbody")
const totalPrice = document.querySelector(".total-price")
const note = document.querySelector("#note")
const billNote = document.querySelector("#bill-note")
const refuseBtn = document.querySelector(".modal-bill .refuse-btn")
const acceptBtn = document.querySelector(".modal-bill .accept-btn")

const form = document.querySelector(".modal-bill form")
const filterMonth = document.querySelector(".filter-month")
const filterYear = document.querySelector(".filter-year")
const filterStatus = document.querySelector(".filter-status")

const modalName = document.querySelector(".modal-bill form legend")

//Mảng lưu dữ liệu
var dataRoomBill = []
var dataBillInfo = []
var dataBill = [];
var year
var month


// ================================================== HÀM THAO TÁC VỚI MODAL ==================================================
// Bật modal thêm hóa đơn
const openAddBillModal = async () => {
    form.removeEventListener("submit", handleUpdateBill)
    refuseBtn.removeEventListener("click", handleDeleteBill)

    //Tùy chỉnh thông tin modal
    getCurrentMonthThisYear()
    modalName.textContent = "Tạo hóa đơn"
    billId.value = ""

    //Hiển thị tháng cần tính hóa đơn
    period.style.display = 'none'
    billMonth.style.display = 'block'
    month < 10 ? billMonth.value = `${year}-0${month}` : billMonth.value = `${year}-${month}`;
    const [y, m] = billMonth.value.split('-');
    beginDate.value = `${y}-${m}-01`
    endDate.value = `${y}-${m}-${new Date(y, m, 0).getDate()}`
    await getRoomBill(billMonth)
    await getRoomInfoToAddBill(billMonth)
    billNote.textContent = "*Hóa đơn sẽ được tạo và gửi thông báo đến khách thuê"
    refuseBtn.textContent = "Hủy"
    acceptBtn.textContent = "Tạo"
    form.addEventListener("submit", handleAddBill)
}

billMonth.addEventListener('change', async () => {
    const [year, month] = billMonth.value.split('-');
    beginDate.value = `${year}-${month}-01`
    endDate.value = `${year}-${month}-${new Date(year, month, 0).getDate()}`
    await getRoomBill(billMonth)
    await getRoomInfoToAddBill(billMonth)
});

// Bật modal xem chi tiết hóa đơn
const openDetailBillModal = async (bill) => {
    form.removeEventListener("submit", handleAddBill)

    //Tùy chỉnh thông tin modal
    modalName.textContent = "Chi tiết hóa đơn"
    billId.value = bill.billId
    roomId.innerHTML = ""
    const option = document.createElement("option")
    option.value = bill.roomId;
    option.text = bill.roomId;
    roomId.appendChild(option);
    roomId.value = bill.roomId
    period.style.display = 'flex'
    billMonth.style.display = 'none'
    beginDate.value = bill.beginDate
    endDate.value = bill.endDate
    displayDetailBill(bill)
    billNote.textContent = "*Nhấn cập nhật sẽ chuyển trạng thái thanh toán của hóa đơn"
    refuseBtn.textContent = "Xóa"
    acceptBtn.textContent = "Cập nhật"
    //Bật modal
    modalBill.style.display = "flex";

    refuseBtn.addEventListener("click", handleDeleteBill)
    form.addEventListener("submit", handleUpdateBill)
}

// ================================================== HÀM LẤY THÔNG TIN ==================================================
// RoomBill là những phòng có thể tính bil và thông tin phòng đó
const getRoomBill = async (billMonth) => {
    const month = new Date(billMonth.value).getMonth() + 1
    const year = new Date(billMonth.value).getFullYear()
    const resultRoomBill = await fetch(`${url}/room/bill/${month}/${year}`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    if (resultRoomBill.status === 200) {
        dataRoomBill = await resultRoomBill.json()
        roomId.innerHTML = ""
        if (dataRoomBill.length == 0) {
            toast({
                title: "Thất bại",
                message: "Không còn phòng cần tạo hóa đơn",
                type: "error"
            })
        } else {
            dataRoomBill.forEach(room => {
                const option = document.createElement("option")
                option.value = room.roomId;
                option.text = room.roomId;
                roomId.appendChild(option);
            })
            modalBill.style.display = "flex";
        }
    } else fetchFailed(resultRoomBill, "Không thể hiển thị phòng để tính hóa đơn")
}

//Hiển thị thông tin để tính hóa đơn theo phòng
const getRoomInfoToAddBill = async (billMonth) => {
    const month = new Date(billMonth.value).getMonth() + 1
    const year = new Date(billMonth.value).getFullYear()
    const result = await fetch(`${url}/bill/info/${roomId.value}/${month}/${year}`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    if (result.status === 200) {
        dataBillInfo = await result.json()
        displayInfoToAddBill()
    }
    else fetchFailed(result, "Không thể hiển thị danh sách phòng")
}
roomId.addEventListener("change", ()=>{
    getRoomInfoToAddBill(billMonth)
})

// Lấy hóa đơn
const getAllBillData = async () => {
    const result = await fetch(`${url}/bill/${month}/${year}`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token")
        }
    })
    if (result.status === 200) {
        dataBill = await result.json();
        handleFilterStatus();
    } else fetchFailed(result, "Không thể hiển thị thông tin hóa đơn")
}

//Tự động tính số điện tiêu thụ và tiền điện
electricNumberEnd.addEventListener("input", () => {
    electricConsume.innerHTML = electricNumberEnd.value - electricNumberBegin.value
    electricTotalPrice.innerHTML = convertNumberToCurrency(parseInt(electricConsume.textContent) * electricPrice.getAttribute('value'))
    electricTotalPrice.setAttribute("value", parseInt(electricConsume.textContent) * electricPrice.getAttribute('value'))
    getTotalPrice()
})

//Tự động tính số nước tiêu thụ và tiền nước
waterNumberEnd.addEventListener("input", () => {
    waterConsume.innerHTML = waterNumberEnd.value - waterNumberBegin.value
    waterTotalPrice.innerHTML = convertNumberToCurrency(parseInt(waterConsume.textContent) * waterPrice.getAttribute('value'))
    waterTotalPrice.setAttribute("value", parseInt(waterConsume.textContent) * waterPrice.getAttribute('value'))
    getTotalPrice()
})
//Tính tổng tiền hóa đơn
const getTotalPrice = async () => {
    const serviceTotalPrice = dataBillInfo.service.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
    const total = parseInt(roomTotalPrice.getAttribute('value')) + parseInt(electricTotalPrice.getAttribute('value')) +
        parseInt(waterTotalPrice.getAttribute('value')) + serviceTotalPrice
    totalPrice.innerHTML = convertNumberToCurrency(total)
    totalPrice.setAttribute("value", total)
}
const getCurrentMonthThisYear = async () => {
    const time = new Date();
    month = time.getMonth() + 1;
    year = time.getFullYear()
}

// ================================================== HÀM XỬ LÝ THAO TÁC ==================================================
//Xử lý thêm hóa đơn
const handleAddBill = async (e) => {
    e.preventDefault();
    const bill = {
        "beginDate": beginDate.value,
        "endDate": endDate.value,
        "electricNumberBegin": electricNumberBegin.value,
        "electricNumberEnd": electricNumberEnd.value,
        "waterNumberBegin": waterNumberBegin.value,
        "waterNumberEnd": waterNumberEnd.value,
        "note": note.value,
        "total": parseInt(totalPrice.getAttribute("value")),
        "roomId": roomId.value
    }
    console.log(bill)
    // post thông tin hóa đơn
    const check = await fetch(`${url}/bill/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify(bill)
    });

    if (check.status === 200) {
        toast({
            title: "Thành công",
            message: await check.text(),
            type: "success"
        })
        modalBill.style.display = "none";
        //Reset và load lại dữ liệu
        getNoticeData()
        handleFilterMonthYear()
    } else fetchFailed(check, await check.text())
}
//Xử lý cập nhật hóa đơn
const handleUpdateBill = async (e) => {
    e.preventDefault()
    const check = await fetch(`${url}/bill/${billId.value}/update`, {
        method: "PUT",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    })
    if (check.status == 200) {
        toast({
            title: "Thành công",
            message: await check.text(),
            type: "success"
        })
        modalBill.style.display = "none"
        getAllBillData()
    } else fetchFailed(check, await check.text())
}
//Xử lý xóa hóa đơn
const handleDeleteBill = async (e) => {
    const check = await fetch(`${url}/bill/${billId.value}/delete`, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    })
    if (check.status == 200) {
        toast({
            title: "Thành công",
            message: await check.text(),
            type: "success"
        })
        modalBill.style.display = "none"
        getNoticeData()
        getAllBillData();
    } else fetchFailed(check, await check.text())
}

const handleFilterMonthYear = async () => {
    month = filterMonth.value
    year = filterYear.value
    getAllBillData()
}
// loc phong
filterMonth.addEventListener("change", handleFilterMonthYear)
filterYear.addEventListener("change", handleFilterMonthYear)

const handleFilterStatus = async () => {
    switch (filterStatus.value) {
        case "1":
            displayBill(dataBill.filter((bill) => bill.isPaid == false))
            break
        case "2":
            displayBill(dataBill.filter((bill) => bill.isPaid == true))
            break
        default:
            displayBill(dataBill)
    }
}
// loc phong
filterStatus.addEventListener("change", handleFilterStatus)

// ================================================== HÀM RENDER RA GIAO DIỆN ==================================================
const displayAllMonthYear = () => {
    filterMonth.innerHTML = ""
    filterYear.innerHTML = ""
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option")
        option.value = i
        option.textContent = "Tháng " + i
        filterMonth.appendChild(option)
    }
    for (let i = year - 2; i <= year + 2; i++) {
        const option = document.createElement("option")
        option.value = i
        option.textContent = "Năm " + i
        filterYear.appendChild(option)
    }
    filterMonth.value = month
    filterYear.value = year
}

const displayBill = (data) => {
    billList.innerHTML = ""
    data.forEach(bill => {
        const div = document.createElement("div");
        bill.isPaid ? div.classList.add("room", "paid") : div.classList.add("room")
        div.innerHTML = `
            <div>Phòng</div>
            <div class="room-id">${bill.roomId}</div>
        `
        div.addEventListener("click", () => { openDetailBillModal(bill) })
        billList.appendChild(div)
    });
}
const displayInfoToAddBill = () => {
    //Hiện giá phòng
    roomTotalPrice.innerHTML = convertNumberToCurrency(dataBillInfo.roomPrice)
    roomTotalPrice.setAttribute("value", dataBillInfo.roomPrice)
    //Hiện số điện nước hiện tại và giá điện nước
    electricNumberBegin.value = dataBillInfo.electricNumberBegin
    electricNumberEnd.value = dataBillInfo.electricNumberBegin
    electricNumberEnd.min = dataBillInfo.electricNumberBegin
    electricPrice.innerHTML = convertNumberToCurrency(dataBillInfo.electricPrice)
    electricPrice.setAttribute("value", dataBillInfo.electricPrice)
    electricConsume.innerHTML = 0
    electricTotalPrice.innerHTML = 0
    electricTotalPrice.setAttribute("value", 0)

    waterNumberBegin.value = dataBillInfo.waterNumberBegin
    waterNumberEnd.value = dataBillInfo.waterNumberBegin
    waterNumberEnd.min = dataBillInfo.waterNumberBegin
    waterPrice.innerHTML = convertNumberToCurrency(dataBillInfo.waterPrice)
    waterPrice.setAttribute("value", dataBillInfo.waterPrice)
    waterConsume.innerHTML = 0
    waterTotalPrice.innerHTML = 0
    waterTotalPrice.setAttribute("value", 0)

    //Hiện dịch vụ phòng đang sử dụng
    tableService.innerHTML = ""
    if (dataBillInfo.service.length == 0) {
        tableService.innerHTML = `<tr><td colspan="10">Phòng không sử dụng dịch vụ</td></tr>`;
    } else {
        tableService.innerHTML = ""
        dataBillInfo.service.forEach((service) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="width: 30%;">${service.serviceName}</td>
                <td style="width: 15%;">${service.quantity}</td>
                <td style="width: 15%;">${convertNumberToCurrency(service.price)}</td>
                <td style="width: 15%;"></td>
                <td style="width: 25%;">${convertNumberToCurrency(service.quantity * service.price)}</td>
            `
            tableService.appendChild(tr)
        })
    }
    //Reset ghi chú
    note.value = ""
    //Cho chỉnh sửa thông tin hóa đơn
    electricNumberBegin.disabled = false
    electricNumberEnd.disabled = false
    waterNumberBegin.disabled = false
    waterNumberEnd.disabled = false
    note.disabled = false
    getTotalPrice()
}
const displayDetailBill = (dataDetailBill) => {
    //Hiện giá phòng
    roomPrice.innerHTML = convertNumberToCurrency(dataDetailBill.roomPrice)
    roomTotalPrice.innerHTML = convertNumberToCurrency(dataDetailBill.roomPrice)
    //Hiện số điện nước hiện tại và giá điện nước
    electricNumberBegin.value = dataDetailBill.electricNumberBegin
    electricNumberEnd.value = dataDetailBill.electricNumberEnd
    electricPrice.innerHTML = convertNumberToCurrency(dataDetailBill.electricPrice)
    electricConsume.innerHTML = dataDetailBill.electricNumberEnd - dataDetailBill.electricNumberBegin
    electricTotalPrice.innerHTML = convertNumberToCurrency(dataDetailBill.electricPrice *
        (dataDetailBill.electricNumberEnd - dataDetailBill.electricNumberBegin))

    waterNumberBegin.value = dataDetailBill.waterNumberBegin
    waterNumberEnd.value = dataDetailBill.waterNumberEnd
    waterPrice.innerHTML = convertNumberToCurrency(dataDetailBill.waterPrice)
    waterConsume.innerHTML = dataDetailBill.waterNumberEnd - dataDetailBill.waterNumberBegin
    waterTotalPrice.innerHTML = convertNumberToCurrency(dataDetailBill.waterPrice *
        (dataDetailBill.waterNumberEnd - dataDetailBill.waterNumberBegin))

    //Hiện dịch vụ phòng đang sử dụng
    tableService.innerHTML = ""
    if (dataDetailBill.service.length == 0) {
        tableService.innerHTML = `<tr><td colspan="10">Phòng không sử dụng dịch vụ</td></tr>`;
    } else {
        tableService.innerHTML = ""
        dataDetailBill.service.forEach((service) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="width: 30%;">${service.serviceName}</td>
                <td style="width: 15%;">${service.quantity}</td>
                <td style="width: 15%;">${convertNumberToCurrency(service.price)}</td>
                <td style="width: 15%;"></td>
                <td style="width: 25%;">${convertNumberToCurrency(service.quantity * service.price)}</td>
            `
            tableService.appendChild(tr)
        })
    }
    //Reset ghi chú
    note.value = dataDetailBill.note
    //Không cho chỉnh sửa thông tin hóa đơn
    electricNumberBegin.disabled = true
    electricNumberEnd.disabled = true
    waterNumberBegin.disabled = true
    waterNumberEnd.disabled = true
    note.disabled = true
    //Hiện tổng giá trị hóa đơn
    totalPrice.innerHTML = convertNumberToCurrency(dataDetailBill.total)
}

window.addEventListener("load", () => {
    getCurrentMonthThisYear()
    getAllBillData()
    displayAllMonthYear()
});