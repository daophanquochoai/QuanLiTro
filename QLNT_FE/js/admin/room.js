//Modal
const modalRoom = document.querySelector(".modal-room")
const modalRoomType = document.querySelector(".modal-room-type")
const modalRoomDetail = document.querySelector(".modal-room__detail")
const modalDelete = document.querySelector(".modal-delete")
const modalName = document.querySelector(".modal-name")
//Table
const roomListTable = document.querySelector(".room-list__wrapper tbody");
const roomTypeListTable = document.querySelector(".modal-room-type tbody");
const customerInRoomListTable = document.querySelector(".modal-room__detail .customer-info tbody");
const serviceInRoomListTable = document.querySelector(".modal-room__detail .service-info tbody");
const serviceList = document.querySelector(".modal-room-service .service-list");
//Form
const roomForm = document.querySelector(".modal-room form");
const roomTypeForm = document.querySelector(".modal-room-type form");
const roomServiceForm = document.querySelector(".modal-room-service form");
const roomDetailForm = document.querySelector(".modal-room__detail form");
const deleteForm = document.querySelector(".modal-delete form")
//Thông tin phòng trong modal room
const roomRoomId = document.querySelector(".modal-room #room_id");
const roomRoomTypeId = document.querySelector(".modal-room #room-type_id");
const roomRoomTypeName = document.querySelector(".modal-room-type #room-type_name");
const roomPrice = document.querySelector(".modal-room #price");
const roomLimit = document.querySelector(".modal-room #limit");
const acceptBtn = document.querySelector(".modal-room .accept-btn")
//Thông tin trong modal room_detail
const roomDetailRoomId = document.querySelector(".modal-room__detail #room_id");
const roomDetailRoomTypeName = document.querySelector(".modal-room__detail #room-type_name");
const roomDetailPrice = document.querySelector(".modal-room__detail #price");
const roomDetailLimit = document.querySelector(".modal-room__detail #limit");
const roomDetailStaying = document.querySelector(".modal-room__detail #staying");

// Lọc và tìm kiếm
const filterRoom = document.getElementsByClassName("filter-field")[0];
const inputSearchRoom = document.querySelector("#search-tool input");
const filterSearchRoom = document.getElementsByClassName("search-field")[0];
//data room
var dataRoomType = []
var dataRoom = []
var dataCustomerInRoom = []
var dataService = []
var dataServiceInRoom = []
var maxRoomId

// ================================================== HÀM THAO TÁC VỚI MODAL ==================================================
// Bật modal thêm phòng
function openAddRoomModal() {
    roomForm.removeEventListener("submit", handleUpdateRoom)
    //Bật modal
    modalName.textContent = "Thêm phòng mới"
    acceptBtn.textContent = "Thêm"
    modalRoom.style.display = "flex";
    //Làm trống modal để thêm phòng
    roomRoomId.readOnly = false
    roomRoomId.value = Math.max(roomRoomId.value, maxRoomId + 1);
    roomRoomTypeId.value = '';
    roomLimit.value = '';
    roomPrice.value = '';
    //Nhận xử lý thêm phòng
    roomForm.addEventListener("submit", handleAddRoom)
};

//Bật modal xem thông tin chi tiết phòng
async function openDetailRoomModal(room) {
    //Hiển thị danh sách khách thuê đang ở trong phòng
    await getCustomerInRoomData(room.roomId)
    //Hiển thị dịch vụ phòng đang sử dụng nếu phòng có người ở
    if (dataCustomerInRoom.length != 0) {
        console.log(dataCustomerInRoom.length)
        await getServiceData()
        await getServiceInRoomData(room.roomId)
    }else{
        console.log(dataCustomerInRoom.length)
        dataService = []
        displayServiceInRoom()
    }
    //Hiển thị thông tin phòng
    roomDetailRoomId.innerHTML = room.roomId
    const roomRoomTypeName = dataRoomType.find((item) => item.roomTypeId === room.roomTypeId).roomTypeName
    roomDetailRoomTypeName.innerHTML = roomRoomTypeName
    roomDetailPrice.innerHTML = room.price
    roomDetailLimit.innerHTML = room.limit
    roomDetailStaying.innerHTML = dataCustomerInRoom.length
    //Bật modal
    modalRoomDetail.style.display = "flex";
};

// Bật modal thêm loại phòng
function openAddRoomTypeModal() {
    //Bật modal
    modalRoomType.style.display = "flex";
    //Làm trống modal để thêm loại phòng
    roomRoomTypeName.value = ""
};

// Bật modal cập nhật thông tin phòng
function openUpdateRoomModal(d) {
    roomForm.removeEventListener("submit", handleAddRoom)
    //Bật modal
    modalName.textContent = "Cập nhật thông tin phòng"
    acceptBtn.textContent = "Cập nhật"
    modalRoom.style.display = "flex";
    //Thêm thông tin hiện tại của phòng
    roomRoomId.readOnly = true
    roomRoomId.value = d.roomId;
    roomRoomTypeId.value = d.roomTypeId;
    roomLimit.value = d.limit;
    roomPrice.value = d.price;
    //Nhận xử lý chỉnh sửa phòng
    roomForm.addEventListener("submit", handleUpdateRoom)
};

// Bật modal xác nhận xóa phòng
var form //Biến này để xác định xóa room hay roomType
var id //Biến này để xác định đối tượng cần xóa
function openDeleteModal(i, f) {
    id = i
    form = f
    //Bật modal
    modalDelete.style.display = "flex"
}

// ================================================== HÀM LẤY THÔNG TIN ==================================================
// Lấy thông tin phòng
const getRoomData = async () => {
    const result = await fetch(`${url}/room/all`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    if (result.status === 200) {
        dataRoom = await result.json()
        displayRoom(dataRoom);
        maxRoomId = dataRoom.reduce((acc, cur) => cur.roomId > acc.roomId ? cur : acc).roomId
    }
    else fetchFailed(result, "Không thể hiển thị danh sách phòng")
};
// Lấy thông tin khách thuê trong phòng
const getCustomerInRoomData = async (roomId) => {
    const result = await fetch(`${url}/customer/room/${roomId}`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    if (result.status === 200) {
        dataCustomerInRoom = await result.json()
        displayCustomerInRoom()
    }
    else fetchFailed(result, "Không thể hiển thị danh sách phòng")
};
// Lấy thông tin tất cả dịch vụ
const getServiceData = async () => {
    const result = await fetch(`${url}/service/all`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    if (result.status === 200) {
        dataService = await result.json()
    }
    else fetchFailed(result, "Không thể hiển thị danh sách phòng")
};
// Lấy thông tin dịch vụ phòng đang sử dụng
const getServiceInRoomData = async (roomId) => {
    const result = await fetch(`${url}/roomService/room/${roomId}`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    if (result.status === 200) {
        dataServiceInRoom = await result.json()
        displayServiceInRoom()
    }
    else fetchFailed(result, "Không thể hiển thị danh sách phòng")
};
// Lấy thông tin loại phòng
const getRoomTypeData = async () => {
    const response = await fetch(`${url}/roomType/all`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    if (response.status === 200) {
        dataRoomType = await response.json();
        roomRoomTypeId.innerHTML = ""
        dataRoomType.forEach((type) => {
            const option = document.createElement("option");
            option.value = type.roomTypeId;
            option.text = type.roomTypeName;
            roomRoomTypeId.appendChild(option);
        })
        displayRoomType()
    }
    else fetchFailed(response, "Không thể hiển thị loại phòng")
}

// ================================================== HÀM XỬ LÝ THAO TÁC ==================================================
// Xử lý thêm phòng
const handleAddRoom = async (e) => {
    e.preventDefault();
    const room = {
        roomId: roomRoomId.value,
        limit: roomLimit.value,
        roomTypeId: roomRoomTypeId.value,
        price: roomPrice.value,
    };

    const check = await fetch(`${url}/room/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify(room)
    });

    if (check.status === 200) {
        toast({
            title: "Thành công",
            message: await check.text(),
            type: "success"
        })
        roomRoomId.value = '';
        roomLimit.value = '';
        roomPrice.value = '';
        handleFilter();
    } else fetchFailed(check, await check.text())
};

// Xử lý thêm loại phòng
const handleAddRoomType = async (e) => {
    e.preventDefault();
    const roomType = {
        roomTypeName: roomRoomTypeName.value
    };

    const check = await fetch(`${url}/roomType/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify(roomType)
    });

    if (check.status === 200) {
        toast({
            title: "Thành công",
            message: await check.text(),
            type: "success"
        })
        roomRoomTypeName.value = '';
        getRoomTypeData()
    } else fetchFailed(check, await check.text())
};
roomTypeForm.addEventListener("submit", handleAddRoomType)

// Xử lý sửa dịch vụ phòng
const handleUpdateRoomService = async (e) => {
    e.preventDefault();
    const serviceList = roomDetailForm.querySelectorAll("input[name='service_id']")
    const quantityList = roomDetailForm.querySelectorAll("input[name='quantity']")
    //Update dịch vụ phòng
    const roomServiceUpdate = [];
    console.log(serviceList.length)
    console.log(quantityList.length)
    for (var i = 0; i < serviceList.length; i++) {
        if (serviceList[i].checked) {
            roomServiceUpdate.push({
                "roomId": roomDetailRoomId.textContent,
                "serviceId": serviceList[i].value,
                "quantity": quantityList[i].value
            });
        }
    }
    console.log(roomServiceUpdate)

    const check = await fetch(`${url}/roomService/${roomDetailRoomId.textContent}/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify(roomServiceUpdate)
    });

    if (check.status === 200) {
        toast({
            title: "Thành công",
            message: await check.text(),
            type: "success"
        })
        modalRoomDetail.style.display = "none"
    } else fetchFailed(check, await check.text())
};
roomDetailForm.addEventListener("submit", handleUpdateRoomService)

// Xử lý cập nhật thông tin phòng
const handleUpdateRoom = async (e) => {
    e.preventDefault();
    const room = {
        room: roomRoomId.value,
        limit: roomLimit.value,
        roomTypeId: roomRoomTypeId.value,
        price: roomPrice.value
    };
    console.log(room)

    // gửi request cập nhật phòng
    const check = await fetch(`${url}/room/${roomRoomId.value}/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify(room)
    });

    if (check.status === 200) {
        toast({
            title: "Thành công",
            message: await check.text(),
            type: "success"
        })
        modalRoom.style.display = "none";
        handleFilter();
    } else fetchFailed(check, await check.text())
};
//Xử lý xóa room hoặc roomType
const handleDelete = async (e) => {
    e.preventDefault()
    const check = await fetch(`${url}/${form}/${id}/delete`, {
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
        await getRoomTypeData()
        displayRoomType()
        handleFilter()
    } else fetchFailed(check, await check.text())
}
deleteForm.addEventListener("submit", handleDelete)
//Xử lý lọc
const handleFilter = async () => {
    if (filterRoom.value == 0) {
        getRoomData();
        displayRoom(dataRoom);
        return;
    }
    const result = await fetch(`${url}/room/limit/${filterRoom.value}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });
    if (result.status === 200) {
        dataRoom = await result.json()
        displayRoom(dataRoom);
    }
    else fetchFailed(result, "Không thể lọc danh sách phòng")
}
// loc phong
filterRoom.addEventListener("change", handleFilter)

// ================================================== HÀM RENDER RA GIAO DIỆN ==================================================

const displayRoom = (tableData) => {
    roomListTable.innerHTML = "";
    tableData.forEach((room, index) => {
        const roomRoomTypeName = dataRoomType.find((item) => item.roomTypeId === room.roomTypeId).roomTypeName
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td plain-value="${room.roomId}">${room.roomId}</td>
            <td plain-value="${roomRoomTypeName}">${roomRoomTypeName}</td>
            <td plain-value="${room.limit}">${room.limit}</td>
            <td plain-value="${room.price}">${convertNumberToCurrency(room.price)}</td>
            <td class="table-btn center">
                <div class="update-button center mr-20">
                    <img width="30" height="30" src="https://img.icons8.com/pulsar-color/30/pencil.png"
                        alt="pencil" />
                    Chỉnh sửa
                </div>
                <div class="delete-button center">
                    <img width="30" height="30" src="https://img.icons8.com/pulsar-color/30/delete-trash.png"
                        alt="delete-trash" />
                    Xóa
                </div>
            </td>
            `
        tr.addEventListener('click', () => { openDetailRoomModal(room) })
        //Chặn hành vi click bật modal chỉnh sửa mà chỉ bật modal xác nhận
        tr.querySelector(".update-button").addEventListener('click', (e) => {
            e.stopPropagation()
            openUpdateRoomModal(room)
        })
        tr.querySelector(".delete-button").addEventListener('click', (e) => {
            e.stopPropagation()
            openDeleteModal(room.roomId, "room")
        })
        roomListTable.appendChild(tr);
    });
    plainTableRows = [...roomListTable.querySelectorAll('tbody tr')];
    customizeSearchingListEvent(plainTableRows)
}

//Hiển thị danh sách loại phòng
const displayRoomType = () => {
    roomTypeListTable.innerHTML = ""
    dataRoomType.forEach((roomType, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${roomType.roomTypeName}</td>
            <td>
                <div class="delete-button">
                    <img width="36" height="36"
                    src="https://img.icons8.com/pulsar-color/36/clear-symbol.png" alt="clear-symbol" />
                </div>
            </td>
        `
        tr.querySelector(".delete-button").addEventListener("click", () => { openDeleteModal(roomType.roomTypeId, "roomType") })
        roomTypeListTable.appendChild(tr)
    })
}
//Hiển thị danh sách khách trong phòng
const displayCustomerInRoom = () => {
    customerInRoomListTable.innerHTML = ""
    dataCustomerInRoom.forEach((customer, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${customer.lastName} ${customer.firstName}</td>
            <td>${customer.phoneNumber}</td>
        `
        customerInRoomListTable.appendChild(tr)
    })
}

//Hiển thị danh sách dịch vụ phòng
const displayServiceInRoom = () => {
    serviceInRoomListTable.innerHTML = ""
    dataService.forEach((service) => {
        const tr = document.createElement("tr");
        //Kiểm tra dịch vụ nào thuộc room trong tất cả các dịch vụ
        const check = dataServiceInRoom.some(serviceInRoom => serviceInRoom.serviceId == service.serviceId)
        let quantity = 1
        if (check) {
            quantity = dataServiceInRoom.find(serviceInRoom => serviceInRoom.serviceId == service.serviceId).quantity
        }
        tr.innerHTML = `
            <td style="text-align: start;">
                <div>
                    <input type="checkbox" name="service_id" value="${service.serviceId}" ${check ? "checked" : ""}>
                    <span>${service.serviceName}</span>
                </div>
            </td>
            <td>
                <div><input type="number" name="quantity" min=1 value=${quantity}></div>
            </td>
            <td>${convertNumberToCurrency(service.price)}</td>
        `
        serviceInRoomListTable.appendChild(tr)
    })
}

window.addEventListener("load", async () => {
    getRoomTypeData()
    getRoomData()
    customizeSortingListEvent()
})
