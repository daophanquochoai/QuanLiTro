//List
const serviceListInfo = document.querySelector(".service-list__info")
const serviceListStatistic = document.querySelector(".service-list__statistic")

//Modal
const modalService = document.querySelector(".modal-service")
const modalDelete = document.querySelector(".modal-service__delete")
const modalName = document.querySelector(".modal-name")
//Form
const serviceForm = document.querySelector(".modal-service form");
const deleteForm = document.querySelector(".modal-service__delete form")
//Thông tin trong modal
const serviceId = document.querySelector(".modal-service #service-id");
const serviceName = document.querySelector(".modal-service #service-name");
const price = document.querySelector(".modal-service #price");
const acceptBtn = document.querySelector(".modal-service .accept-btn")

//data Service
var dataService = []
var dataServiceInUse = []
var colors = ['#FFC470', '#AFD198', '#BC7FCD', '#FB9AD1', '#6096B4']

// ================================================== HÀM THAO TÁC VỚI MODAL ==================================================
// Bật modal thêm service
function openAddServiceModal() {
    serviceForm.removeEventListener("submit", handleUpdateService)
    //Bật modal
    modalName.textContent = "Thêm dịch vụ mới"
    acceptBtn.textContent = "Thêm"
    modalService.style.display = "flex";
    //Làm trống modal để thêm service
    serviceId.value = '';
    serviceName.value = '';
    price.value = '';
    //Nhận xử lý thêm service
    serviceForm.addEventListener("submit", handleAddService)
};

// Bật modal cập nhật thông tin service
function openUpdateServiceModal(s) {
    serviceForm.removeEventListener("submit", handleAddService)
    //Bật modal
    modalName.textContent = "Cập nhật dịch vụ"
    acceptBtn.textContent = "Cập nhật"
    modalService.style.display = "flex";
    //Thêm thông tin hiện tại của service
    serviceId.value = s.serviceId;
    serviceName.value = s.serviceName;
    price.value = s.price;
    //Nhận xử lý chỉnh sửa service
    serviceForm.addEventListener("submit", handleUpdateService)
};

// Bật modal xác nhận xóa service
var id //Biến này để xác định đối tượng cần xóa
function openDeleteModal(i) {
    id = i
    //Bật modal
    modalDelete.style.display = "flex"
}

// ================================================== HÀM LẤY THÔNG TIN ==================================================
// Lấy thông tin service
const getServiceData = async () => {
    const result = await fetch(`${url}/service/all`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    if (result.status === 200) {
        dataService = await result.json()
        displayService(dataService);
    }
    else fetchFailed(result, "Không thể hiển thị danh sách dịch vụ")
};

// Lấy thông tin thống kê service có bao nhiêu phòng đang dùng
const getServiceInUse = async () => {
    const result = await fetch(`${url}/roomService/all`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    if (result.status === 200) {
        dataServiceInUse = await result.json()
        displayServiceInUse()
    }
    else fetchFailed(result, "Không thể hiển thị danh sách service")
};

// ================================================== HÀM XỬ LÝ THAO TÁC ==================================================
// Xử lý thêm service
const handleAddService = async (e) => {
    e.preventDefault();
    const service = {
        serviceName: serviceName.value,
        price: price.value,
    };

    const check = await fetch(`${url}/service/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify(service)
    });

    if (check.status === 200) {
        toast({
            title: "Thành công",
            message: await check.text(),
            type: "success"
        })
        serviceId.value = '';
        serviceName.value = '';
        price.value = '';
        modalService.style.display = "none";
        getServiceData()
    } else fetchFailed(check, await check.text())
};

// Xử lý cập nhật thông tin service
const handleUpdateService = async (e) => {
    e.preventDefault();
    const service = {
        serviceId: serviceId.value,
        serviceName: serviceName.value,
        price: price.value
    };

    // gửi request cập nhật service
    const check = await fetch(`${url}/service/${serviceId.value}/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify(service)
    });

    if (check.status === 200) {
        toast({
            title: "Thành công",
            message: await check.text(),
            type: "success"
        })
        modalService.style.display = "none";
        getServiceData();
    } else fetchFailed(check, await check.text())
};
//Xử lý xóa service
const handleDelete = async (e) => {
    e.preventDefault()
    const check = await fetch(`${url}/service/${id}/delete`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        }
    });
    modalDelete.style.display = "none";
    if (check.status === 200) {
        toast({
            title: "Thành công",
            message: await check.text(),
            type: "success"
        })
        getServiceData()
        getServiceInUse()
    } else fetchFailed(check, await check.text())
}
deleteForm.addEventListener("submit", handleDelete)

// ================================================== HÀM RENDER RA GIAO DIỆN ==================================================

const displayService = () => {
    serviceListInfo.innerHTML = ""
    dataService.forEach((service, index) => {
        const div = document.createElement("div");
        div.classList.add("service")
        div.style.backgroundColor = colors[index % 5]
        div.innerHTML = `
            <div class="service-name">${service.serviceName}</div>
            <div class="service-info">
                <div class="price">
                    <span>Mức giá</span>
                    <span>${convertNumberToCurrency(service.price)}</span>
                </div>
                <div class="btn-wrapper">
                    <button class="delete-btn">Xóa</button>
                    <button class="update-btn">Chỉnh sửa</button>
                </div>
            </div>
        `
        div.querySelector(".delete-btn").addEventListener("click", () => { openDeleteModal(service.serviceId) })
        div.querySelector(".update-btn").addEventListener("click", () => { openUpdateServiceModal(service) })
        serviceListInfo.appendChild(div)
    })
}
const displayServiceInUse = () => {
    serviceListStatistic.innerHTML = ""
    console.log(dataServiceInUse)
    const serviceInUse = dataServiceInUse.reduce((accumulator, cur) =>{
        accumulator[cur.service.serviceName] = accumulator[cur.service.serviceName] || 0
        accumulator[cur.service.serviceName]++
        return accumulator
    },{})
    console.log(serviceInUse)
    Object.entries(serviceInUse).forEach((roomService,index) => {
        const div = document.createElement("div");
        div.classList.add("wrapper")
        div.innerHTML = `
        <div class="service-statistic p-10 m-10">
        <div class="service-name">${roomService[0]}</div>
        <div id="using-quantity">${roomService[1]}</div>
        </div>
        `
        div.style.backgroundColor = colors[index % 5]
        div.querySelector(".service-statistic").style.backgroundColor = colors[index % 5]
        serviceListStatistic.appendChild(div)
    })
}

window.addEventListener("load", async () => {
    getServiceData()
    getServiceInUse()
})
