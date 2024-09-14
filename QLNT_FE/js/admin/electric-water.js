const tableElec = document.querySelector(".electric-container .history-price__table tbody")
const tableWater = document.querySelector(".water-container .history-price__table tbody")
const inputWater = document.getElementsByClassName("inputWater")[0];
const inputElec = document.getElementsByClassName('inputElec')[0];
const modalConfirm = document.querySelector(".modal-confirm")
const acceptBtn = document.querySelector(".modal-confirm .accept-btn")
//Biến lưu giá điện nước hiện tại
let currentElectricPrice
let currentWaterPrice
//Biến tùy chỉnh submit form = 1 (form electric) / form = 0 (form water)
let form

var dataElectricPrice = []
var dataWaterPrice = []

//Thêm sự kiện enter và blur cho input
inputElec.addEventListener("blur", () => {
    form = 1
    openConfirmModal()
})
inputElec.addEventListener("keydown", (e) => {
    if (e.key == 'Enter') inputElec.blur()
})

inputWater.addEventListener("blur", () => {
    form = 0
    openConfirmModal()
})
inputWater.addEventListener("keydown", (e) => {
    if (e.key == 'Enter') inputWater.blur()
})
// Tùy chỉnh update giá điện hay nước khi nhấn xác nhận
acceptBtn.addEventListener("click", (e) => {
    // form = 1 (form electric) / form = 0 (form water)
    handleUpdatePrice(e, form)
})

//Bật modal xác nhận thay đổi
function openConfirmModal() {
    modalConfirm.style.display = "flex";
};

//Xử lý thay đổi giá điện
const handleUpdatePrice = async (e, form) => {
    // Nếu giá không sự thay đổi
    if (form ? currentElectricPrice === inputElec.value : currentWaterPrice === inputWater.value) {
        toast({
            title: "Thất bại",
            message: "Giá " + (form ? "điện" : "nước") + " không có sự thay đổi",
            type: "error"
        })
        modalConfirm.style.display = "none";
        return
    }
    // Nếu giá tiền < 0
    if (form ? inputElec.value < 0 : inputWater.value < 0){
        toast({
            title: "Thất bại",
            message: "Giá " + (form ? "điện" : "nước") + " không thể bé hơn 0",
            type: "error"
        })
        form ? inputElec.value = currentElectricPrice : inputWater.value = currentWaterPrice
        modalConfirm.style.display = "none";
        return
    }

    // post gia len
    const price = {
        price: form ? inputElec.value : inputWater.value,
        changedDate: new Date().toJSON()
    };
    console.log(price)

    const check = await fetch(`${url}/price/${form ? "electric":"water"}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify(price)
    });

    if (check.status === 200) {
        toast({
            title: "Thành công",
            message: await check.text(),
            type: "success"
        })
        modalConfirm.style.display = "none";
        fetchData()
    } else fetchFailed(check, await check.text())
};

// hien thi don gia
const displayPrice = (dataElectricPrice, dataWaterPrice) => {
    // Reset dữ liệu của bảng
    tableElec.innerHTML = ''
    tableWater.innerHTML = ''
    if (dataElectricPrice.length === 0) {
        tableElec.innerHTML = `<tr><td colspan="10">Không có dữ liệu</td></tr>`
    }else{
        inputElec.value = dataElectricPrice[0].price;
    }

    if (dataWaterPrice.length === 0) {
        tableWater.innerHTML = `<tr><td colspan="10">Không có dữ liệu</td></tr>`
    }else{
        inputWater.value = dataWaterPrice[0].price;
    }

    //Lấy ra giá điện nước hiện tại
    currentElectricPrice = inputElec.value
    currentWaterPrice = inputWater.value
    
    dataElectricPrice.forEach((data) => {
        // do data vao bang dien
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${convertNumberToCurrency(data.price)}</td>
            <td>${new Date(data.changedDate).toLocaleString('VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</td>
        `
        tableElec.appendChild(tr);
    })

    dataWaterPrice.forEach((data) => {
        // do data vao bang nuoc
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${convertNumberToCurrency(data.price)}</td>
            <td>${new Date(data.changedDate).toLocaleString('VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</td>
        `
        tableWater.appendChild(tr);
    })
}

const fetchData = async () => {
    const resultElectric = await fetch(`${url}/price/electric/all`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    })
    const resultWater = await fetch(`${url}/price/water/all`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    })

    if (resultElectric.status === 200) { dataElectricPrice = await resultElectric.json(); }
    else fetchFailed(resultElectric, "Không thể hiển thị lịch sử giá điện")

    if (resultWater.status === 200) { dataWaterPrice = await resultWater.json(); }
    else fetchFailed(resultElectric, "Không thể hiển thị lịch sử giá nước")

    displayPrice(dataElectricPrice, dataWaterPrice);
}
window.addEventListener("load", fetchData)