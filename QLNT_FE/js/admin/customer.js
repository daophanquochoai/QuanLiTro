const modalCustomer = document.querySelector(".modal-customer")
const modalName = document.querySelector(".modal-name .modal-type")
const customerHistory = document.querySelector(".customer-history")
const form = document.querySelector(".modal-customer form");
//Thông tin khách thuê trong modal
const customerId = document.getElementById("customer_id");
const roomId = document.getElementById("room_id");
const lastName = document.getElementById("lastname");
const firstName = document.getElementById("firstname");
const male = document.getElementById("male");
const female = document.getElementById("female");
const birth = document.getElementById("birth");
const email = document.getElementById("email");
const identifier = document.getElementById("identifier");
const address = document.getElementById("address");
const phoneNumber = document.getElementById("phone_number");
const acceptBtn = document.querySelector(".modal-customer .accept-btn")
//Danh sách khách thuê
const customerList = document.querySelector(".customer-list__wrapper table tbody")
const historyList = document.querySelector(".customer-history .history-list")
const modalCustomerDelete = document.querySelector(".modal-customer__delete")
const deleteForm = document.querySelector(".modal-customer__delete form")
const modalMessage = document.querySelector(".modal-customer__delete .modal-message")
const filterCustomer = document.querySelector("#filter-tool select");
//Dữ liệu để kiểm tra và đổ ra giao diện
var dataCustomer = [];
var dataAllRoom = [];
var dataContract = [];
var dataHistory = [];

//Lấy ra những người có hợp đồng
const getContractData = async () => {
    const response = await fetch(`${url}/contract/all`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    if (response.status === 200) {
        dataContract = await response.json();
    } else fetchFailed(response, "Không thể hiển thị danh sách hợp đồng")
}

//Lấy ra những người có hợp đồng
const getHistoryData = async (customerId) => {
    const response = await fetch(`${url}/history/${customerId}`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    if (response.status === 200) {
        dataHistory = await response.json();
        displayHistory(dataHistory)
    } else fetchFailed(response, "Không thể hiển thị lịch sử thuê")
}

const getAllRoom = async () => {
    const check = await fetch(`${url}/room/all`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });
    if (check.status === 200) dataAllRoom = await check.json()
    else fetchFailed(check, "Không thể hiển thị danh sách tất cả phòng")
}


//Lấy ra các phòng trống để thêm khách thuê
const getAvailableRoom = async () => {
    //Phòng có thể ở = tất cả phòng - phòng đầy)
    const check = await fetch(`${url}/room/limit/3`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });
    if (check.status === 200) {
        roomId.innerHTML = ""
        const dataFullRoom = await check.json()
        dataAllRoom.forEach((room) => {
            const option = document.createElement("option");
            option.value = room.roomId;
            option.text = room.roomId;
            if (dataFullRoom.find((r) => r.roomId == room.roomId)) {
                option.hidden = true
                option.disabled = true
            }
            roomId.appendChild(option);
        })
    }
    else fetchFailed(check, "Không thể hiển thị danh sách các phòng đầy")
}

// Bật modal thêm khách thuê
function openAddCustomerModal() {
    form.removeEventListener("submit", handleUpdateCustomer)
    //Bật modal
    modalName.textContent = "Thêm mới khách thuê"
    acceptBtn.disabled = false
    acceptBtn.textContent = "Thêm"
    modalCustomer.style.display = "flex"
    customerHistory.style.display = "none"
    //Làm trống modal để thêm khách thuê
    customerId.value = ''
    firstName.value = ''
    lastName.value = ''
    male.checked = true;
    birth.value = ''
    email.value = ''
    identifier.value = ''
    address.value = ''
    phoneNumber.value = ''
    roomId.value = "";
    roomId.disabled = false

    form.addEventListener("submit", handleAddCustomer)
}

// Bật modal cập nhật thông tin khách thuê
function openUpdateCustomerModal(customer) {
    form.removeEventListener("submit", handleAddCustomer)
    //Bật modal
    modalName.textContent = "Cập nhật thông tin"
    //Không cho chỉnh thông tin khách đã từng ở
    customer.roomId == 0 ? acceptBtn.disabled = true : acceptBtn.disabled = false
    acceptBtn.textContent = "Cập nhật"
    modalCustomer.style.display = "flex"
    customerHistory.style.display = "block"
    //Thêm thông tin hiện tại của khách thuê để cập nhật
    customerId.value = customer.customerId;
    roomId.value = customer.roomId;
    //Thêm lịch sử thue của khách thuê
    getHistoryData(customer.customerId)
    // Nếu người này là người đại diện hợp đồng thì ko đc đổi phòng
    if (dataContract.some((contract) => contract.customer.customerId == customerId.value)) roomId.disabled = true
    else roomId.disabled = false
    firstName.value = customer.firstName;
    lastName.value = customer.lastName;
    customer.sex ? male.checked = true : female.checked = true;
    birth.value = customer.dateOfBirth.slice(0, 10);
    email.value = customer.email
    identifier.value = customer.identifier
    address.value = customer.infoAddress
    phoneNumber.value = customer.phoneNumber
    form.addEventListener("submit", handleUpdateCustomer)
}

// Xử lý thêm khách thuê
const handleAddCustomer = async (e) => {
    e.preventDefault();
    const info = {
        'firstName': firstName.value,
        'lastName': lastName.value,
        'identifier': identifier.value,
        'dateOfBirth': birth.value,
        'sex': male.checked,
        'roomId': roomId.value,
        'infoAddress': address.value,
        'phoneNumber': phoneNumber.value,
        'email': email.value,
        'username': email.value,
        'password': "123"
    }
    console.log(info)
    // post customer
    const check = await fetch(`${url}/customer/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify(info)
    });

    if (check.status === 200) {
        toast({
            title: "Thành công",
            message: await check.text(),
            type: "success"
        })
        //Reset và load lại dữ liệu
        customerId.value = ''
        firstName.value = ''
        lastName.value = ''
        male.checked = true;
        birth.value = ''
        email.value = ''
        identifier.value = ''
        address.value = ''
        phoneNumber.value = ''
        modalCustomer.style.display = "none";
        getCustomerData()
        getAvailableRoom()
    } else fetchFailed(check, await check.text())

};
// Xử lý cập nhật thông tin khách thuê
const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    const info = {
        'customerId': customerId.value,
        'roomId': roomId.value,
        'firstName': firstName.value,
        'lastName': lastName.value,
        'identifier': identifier.value,
        'dateOfBirth': birth.value,
        'sex': male.checked,
        'infoAddress': address.value,
        'phoneNumber': phoneNumber.value,
        'email': email.value
    }
    console.log(info)
    // post thông tin customer đã cập nhật
    const check = await fetch(`${url}/customer/${customerId.value}/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify(info)
    });

    if (check.status === 200) {
        toast({
            title: "Thành công",
            message: await check.text(),
            type: "success"
        })
        modalCustomer.style.display = "none";
        //Reset và load lại dữ liệu
        getCustomerData()
        getAvailableRoom()
    } else fetchFailed(check, await check.text())
};


// Bật modal xác nhận xóa khách thuê
var id //Biến này để xác định đối tượng cần xóa
function openDeleteCustomerModal(customerId) {
    //Bật modal
    modalCustomerDelete.style.display = "flex"
    id = customerId;
}

//xac nhan xoa 
const handleDelete = async (e) => {
    e.preventDefault();
    const check = await fetch(`${url}/customer/${id}/delete`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        }
    });
    modalCustomerDelete.style.display = "none";
    if (check.status === 200) {
        toast({
            title: "Thành công",
            message: await check.text(),
            type: "success"
        })
        //Reset và load lại dữ liệu
        getCustomerData()
        getAvailableRoom()
    } else fetchFailed(check, await check.text())
}
deleteForm.addEventListener("submit", handleDelete)

const displayCustomer = (dateSource) => {
    customerList.textContent = ''
    dateSource.forEach((customer, index) => {
        const DOB = new Date(customer.dateOfBirth).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const tr = document.createElement("tr");
        tr.addEventListener('click', () => { openUpdateCustomerModal(customer) })
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td plain-value="${customer.lastName}">${customer.lastName}</td>
            <td plain-value="${customer.firstName}">${customer.firstName}</td>
            <td>${customer.sex ? "Nam" : "Nữ"}</td>
            <td plain-value="${DOB}">${DOB}</td>
            <td plain-value="${customer.phoneNumber}">${customer.phoneNumber}</td>
            <td plain-value="${customer.email}">${customer.email}</td>
            <td>
                <img width="40" height="40"
                    src="https://img.icons8.com/pulsar-color/40/cancel.png" alt="cancel" />
            </td>
            `

        //Chặn hành vi click bật modal chỉnh sửa mà chỉ bật modal xác nhận
        tr.querySelector("img").addEventListener('click', (e) => {
            e.stopPropagation()
            openDeleteCustomerModal(customer.customerId)
        })
        customerList.appendChild(tr)
    })
    plainTableRows = [...document.querySelectorAll('tbody tr')];
    customizeSearchingListEvent(plainTableRows)
}

const displayHistory = (dateSource) => {
    console.log(dateSource)
    historyList.textContent = ''
    dateSource.forEach(history => {
        const div = document.createElement("div");
        div.classList.add("history-record", "p-10")
        div.innerHTML = `
        <div class="room-change center">
            <div class="room-old">${history.roomOld.roomId}</div>
            <img width="40" height="40" src="https://img.icons8.com/pulsar-line/40/forward.png" alt="forward"/>
            <div class="room-new">${history.roomNew != null ? history.roomNew.roomId : "---"}</div>
        </div>
        <div class="begin-date">
            <span>Ngày bắt đầu</span>
            <span id="begin-date">${new Date(history.beginDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
        </div>
        <div class="end-date">
            <span>Ngày kết thúc</span>
            <span id="end-date">${history.endDate != null ? new Date(history.endDate)
                .toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "---"}</span>
        </div>
            `
            historyList.appendChild(div)
    })
}

// Hiển thị danh sách khách thuê
const getCustomerData = async () => {
    const check = await fetch(`${url}/customer/all`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    if (check.status === 200) {
        dataCustomer = await check.json();
        console.log(dataCustomer)
        handleFilter()
    } else fetchFailed(check, "Không thể hiển thị danh sách khách thuê")
}

// Lọc khách thuê
const handleFilter = async () => {
    switch (filterCustomer.value) {
        case "0":
            modalMessage.textContent = "Hãy chắc chắn rằng khách thuê này đã trả phòng ?"
            displayCustomer(dataCustomer.filter((customer) => customer.roomId != 0))
            break
        case "1":
            modalMessage.textContent = "Bạn có chắc chắn muốn xóa khách thuê này không ?"
            displayCustomer(dataCustomer.filter((customer) => customer.roomId == 0))
            break
        default:
            displayCustomer(dataCustomer)
    }
}
filterCustomer.addEventListener("change", handleFilter)

window.addEventListener("load", async () => {
    await getCustomerData()
    await getAllRoom()
    displayCustomer(dataCustomer)
    getAvailableRoom()
    getContractData()
    handleFilter()
    customizeSortingListEvent()
});


