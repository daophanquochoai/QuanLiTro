var dataContract = []
var dataRoom = []
var dataCustomer = []

//Thông tin khách thuê trong modal
const contractId = document.getElementById("contract_id");
const roomId = document.getElementById("room_id");
const customerId = document.getElementById("customer_id");
const email = document.getElementById("email");
const identifier = document.getElementById("identifier");
const phoneNumber = document.getElementById("phone_number");
const createdDate = document.getElementById("created_date");
const beginDate = document.getElementById("begin_date");
const endDate = document.getElementById("end_date");
const modalContract = document.querySelector(".modal-contract")
const modalDelete = document.querySelector(".modal-delete")
const modalName = document.querySelector(".modal-name .modal-type")
const acceptBtn = document.querySelector(".modal-contract .accept-btn")
const form = document.querySelector(".modal-contract form");
const deleteForm = document.querySelector(".modal-delete form");
const contractList = document.querySelector(".contract-list__container");
const filterContract = document.querySelector("#filter-tool select");

//Lấy ra các phòng chưa có hợp đồng
const getAllRoomWithoutContract = async () => {
    const allRoomWithContract = await fetch(`${url}/room/withContract`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });
    const allRoom = await fetch(`${url}/room/all`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });
    if (allRoomWithContract.status === 200 && allRoom.status === 200) {
        dataRoom = await allRoom.json()
        const dataAllRoomWithContract = await allRoomWithContract.json()
        roomId.innerHTML = ""
        dataRoom.forEach((room) => {
            const option = document.createElement("option");
            option.value = room.roomId;
            option.text = room.roomId;
            if (dataAllRoomWithContract.find((r) => r.roomId == room.roomId)) {
                option.hidden = true
                option.disabled = true
            }
            roomId.appendChild(option);
        })
    }
    else fetchFailed(allRoom, "Không thể hiển thị các phòng chưa có hợp đồng")
};

//Lấy ra tất cả khách thuê của 1 phòng
const getAllCustomerInRoom = async (roomId) => {
    const check = await fetch(`${url}/customer/room/${roomId}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });
    if (check.status === 200) {
        // Reset thông tin trong modal
        customerId.innerHTML = ""
        identifier.value = ""
        email.value = ""
        phoneNumber.value = ""

        dataCustomer = await check.json()
        dataCustomer.forEach((customer, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.text = customer.lastName + " " + customer.firstName;
            customerId.appendChild(option);
        })
        customerId.value = ""
    }
    else fetchFailed(check, "Không thể hiển thị thông tin khách thuê")
}

roomId.addEventListener("change", () => {
    getAllCustomerInRoom(roomId.value)
})
customerId.addEventListener("change", () => {
    identifier.value = dataCustomer[customerId.value].identifier
    email.value = dataCustomer[customerId.value].email
    phoneNumber.value = dataCustomer[customerId.value].phoneNumber
})

// Bật modal thêm hợp đồng
function openAddContractModal() {
    form.removeEventListener("submit", openDeleteModal)

    //Bật modal
    modalName.textContent = "Tạo hợp đồng"
    acceptBtn.textContent = "Tạo"
    modalContract.style.display = "flex"
    //Reset thông tin trong  modal
    contractId.textContent = "_ _ _ _ _";
    roomId.value = ""
    customerId.innerHTML = ""
    identifier.value = ""
    email.value = ""
    phoneNumber.value = ""
    createdDate.value = new Date().toLocaleDateString('en-CA')
    beginDate.value = ""
    endDate.value = ""
    // Cho phép việc chỉnh sửa
    roomId.disabled = false
    customerId.disabled = false
    createdDate.disabled = false
    beginDate.disabled = false
    endDate.disabled = false
    acceptBtn.disabled = false

    form.addEventListener("submit", handleAddContract)
}
// Bật modal xem chi tiết hợp đồng
function openViewContractModal(contract) {
    form.removeEventListener("submit", handleAddContract)

    //Bật modal
    modalName.textContent = "Chi tiết hợp đồng"
    acceptBtn.textContent = "Hủy hợp đồng"
    modalContract.style.display = "flex"
    //Thông tin hợp đồng trong  modal
    contractId.textContent = contract.contractId
    roomId.value = contract.room.roomId
    customerId.innerHTML = `<option>${contract.customer.lastName} ${contract.customer.firstName}</option>`
    identifier.value = contract.customer.identifier
    email.value = contract.customer.email
    phoneNumber.value = contract.customer.phoneNumber
    createdDate.value = contract.createdDate
    beginDate.value = contract.beginDate
    endDate.value = contract.endDate
    // Vô hiệu hóa việc chỉnh sửa
    roomId.disabled = true
    customerId.disabled = true
    createdDate.disabled = true
    beginDate.disabled = true
    endDate.disabled = true
    contract.status ? acceptBtn.disabled = false : acceptBtn.disabled = true

    form.addEventListener("submit", openDeleteModal)
}

function openDeleteModal(e) {
    e.preventDefault()
    //Bật modal
    modalDelete.style.display = "flex"
}


// Xử lý thêm hợp đồng
async function handleAddContract(e) {
    e.preventDefault();
    const contract = {
        "customerId": dataCustomer[customerId.value].customerId,
        "roomId": roomId.value,
        "createdDate": createdDate.value,
        "beginDate": beginDate.value,
        "endDate": endDate.value,
    }
    console.log(contract)

    const check = await fetch(`${url}/contract/${contract.customerId}/${contract.roomId}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify(contract)
    });
    if (check.status === 200) {
        toast({
            title: "Thành công",
            message: await check.text(),
            type: "success"
        })
        modalContract.style.display = "none";
        await getAllRoomWithoutContract()
        getContractData()
        getNoticeData()
    } else fetchFailed(check, await check.text())
}
// Xử lý xóa hợp đồng
const handleDeleteContract = async (e) => {
    e.preventDefault()
    const check = await fetch(`${url}/contract/${contractId.textContent}/delete`, {
        method: "PUT",
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
        getContractData()
        getNoticeData()
        getAllRoomWithoutContract()
        modalContract.style.display = "none"
    } else fetchFailed(check, await check.text())
}
deleteForm.addEventListener("submit", handleDeleteContract)

// Lọc khách thuê
const handleFilter = async () => {
    switch (filterContract.value) {
        case "0":
            displayContract(dataContract.filter((contract) => contract.status == true))
            break
        case "1":
            displayContract(dataContract.filter((contract) => contract.status == false))
            break
    }
}
filterContract.addEventListener("change", handleFilter)

const displayContract = (dateSource) => {
    contractList.innerHTML = ""
    dateSource.forEach((contract) => {
        const div = document.createElement("div");
        contract.status ? div.classList.add("room", "available") : div.classList.add("room")
        div.addEventListener('click', () => { openViewContractModal(contract) })
        div.innerHTML = `
            <div>Phòng</div>
            <div class="room-id">${contract.room.roomId}</div>
        `
        contractList.appendChild(div)
    })
}

// Hiển thị danh sách các hợp đồng
const getContractData = async () => {
    const response = await fetch(`${url}/contract/all`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    if (response.status === 200) {
        dataContract = await response.json();
        handleFilter()
    } else fetchFailed(response, "Không thể hiển thị danh sách hợp đồng")
}

window.addEventListener("load",()=>{
    getContractData()
    getAllRoomWithoutContract()
});