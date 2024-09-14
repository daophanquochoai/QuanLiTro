const header = document.querySelector(".header")
const sidebar = document.querySelector(".sidebar")
var numberNotice
const url = "http://localhost:8080/admin";
const urlUser = "http://localhost:8080/user";

async function fetchHeaderAndSidebar() {
    // Tải giao diện header
    try {
        const response = await fetch("../admin/include/header.html");
        if (!response.ok) {
            throw new Error('Fetch header failed');
        }
        const content = await response.text();
        header.innerHTML = content;
        //thoat chuong trinh
        const exit = document.getElementsByClassName('accept-btn')[0]
        exit.addEventListener("click", () => {
            sessionStorage.clear();
            window.location.href = '../../html/login.html';
        })
        closeModals()
        getNoticeData()
    } catch (error) {
        console.error('Error fetching header:', error)
    }

    // Tải giao diện sidebar
    try {
        const response = await fetch("../admin/include/sidebar.html");
        if (!response.ok) {
            throw new Error('Fetch sidebar failed');
        }
        const content = await response.text();
        sidebar.innerHTML = content
        // Sidebar kích hoạt active cho từng mục
        const currentPage = window.location.pathname.split('/').pop(); // Xác định trang hiện tại
        const sidebarItems = sidebar.querySelectorAll(".sidebar-menu li")
        sidebarItems.forEach(item => {
            if (item.id + ".html" === currentPage) {
                item.classList.add('active');
            }
        });
    } catch (error) {
        console.error('Error fetching sidebar:', error)
    }
}

const addNotice = (message) => {
    const noticeList = document.querySelector('.notice-list')
    const div = document.createElement('div')
    div.classList.add('notice')
    div.innerHTML = `
        <span>${numberNotice}</span>
        <div class="message">
            ${message}
        </div>
    `
    noticeList.appendChild(div)
}

const request = async () => {
    const response = await fetch(`${url}/request/false`, {
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });
    if (response.status === 200) {
        const dataRequest = await response.json();
        if (dataRequest.length != 0) {
            numberNotice++
            addNotice(`Bạn có ${dataRequest.length} yêu cầu từ khách thuê chưa được xử lý`)
        }
    }
}

const roomBill = async () => {
    const currentDate = new Date();
    let month = currentDate.getMonth() + 1
    let year = currentDate.getFullYear()
    const resultRoomBill = await fetch(`${url}/room/bill/${month}/${year}`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    if (resultRoomBill.status === 200) {
        const dataRoomBill = await resultRoomBill.json()
        if (dataRoomBill.length > 0) {
            numberNotice++
            addNotice(`Bạn có ${dataRoomBill.length} phòng chưa lập hóa đơn tháng ${month} năm ${year}`)
        }
    }
}

const contract = async () => {
    const response = await fetch(`${url}/contract/all`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    if (response.status === 200) {
        const dataContract = await response.json();
        dataContract.forEach((contract) => {
            let endDate = new Date(contract.endDate)
            endDate.setMonth(endDate.getMonth() - 1)
            if (endDate <= new Date()) {
                numberNotice++
                endDate = new Date(contract.endDate).toLocaleString('VN', { timeZone: 'Asia/Ho_Chi_Minh' }).slice(9, 18)
                addNotice(`Hợp đồng phòng ${contract.room.roomId} sắp hết hiệu lực (${endDate})`)
            }
        })
    } else fetchFailed(response, "Không thể hiển thị danh sách hợp đồng")
}

// Áp dụng việc thoát modal khi nhấn Không hoặc khi nhấn ra ngoài cho tất cả modal
function closeModals() {
    const modals = document.querySelectorAll(".modal")
    modals.forEach((modal) => {
        const refuseBtn = modal.querySelector(".refuse-btn")
        const modalContainer = modal.querySelector(".modal-container")
        if (refuseBtn != null) {
            refuseBtn.addEventListener("click", () => {
                modal.style.display = "none"
            })
        }
        modalContainer.addEventListener("click", (event) => {
            event.stopPropagation()
        })
        modal.addEventListener("click", () => {
            modal.style.display = "none"
        })
    })
}

// Bật thông báo xác nhận đăng xuất 
function openLogoutModal() {
    const modalLogout = document.querySelector(".modal-logout")
    //Bật modal
    modalLogout.style.display = "flex"
}

//Sắp xếp theo field
function customizeSortingListEvent() {
    const sortField = document.querySelectorAll('.main-content table thead th:not(:last-child)')
    let isAscending = true
    sortField.forEach((field, index) => {
        field.addEventListener("click", () => {
            //Thay đổi tăng dần hoặc giảm dần
            isAscending = !isAscending
            //Lấy ra tất cả các hàng
            const rows = [...document.querySelectorAll('.main-content tbody tr')];
            //Lấy ra các ô của field vừa click
            const cellsOfField = rows.map(row => {
                return row.querySelectorAll('td')[index]
            });
            let searchingDataFieldType = ""
            //Kiểm tra kiểu dữ liệu của cột để sắp xếp
            const date = cellsOfField[0].textContent.split('/');
            if (!isNaN(Date.parse(date[1] + '/' + date[0] + '/' + date[2]))) searchingDataFieldType = "Date";
            else if (!Number.isNaN(Number.parseInt(cellsOfField[0].textContent))) searchingDataFieldType = "Number";
            else searchingDataFieldType = "String";


            rows.sort((row1, row2) => {
                a = row1.cells[index].textContent
                b = row2.cells[index].textContent
                if (searchingDataFieldType === "Number")
                    return isAscending ? Number.parseInt(a) - Number.parseInt(b) : Number.parseInt(b) - Number.parseInt(a);
                else if (searchingDataFieldType === "Date") {
                    let [day, month, year] = a.split('/').map(Number);
                    const dateA = new Date(year, month - 1, day);
                    [day, month, year] = b.split('/').map(Number);
                    const dateB = new Date(year, month - 1, day);
                    return isAscending ? dateA - dateB : dateB - dateA;
                } else return isAscending ? a.localeCompare(b) : b.localeCompare(a);
            });

            // Sắp xếp lại các hàng trong bảng
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = '';
            rows.forEach(row => tbody.appendChild(row));
        })
    })
}

//Tìm kiếm theo field
function customizeSearchingListEvent(plainTableRows) {
    const searchingInputTag = document.querySelector('#search-tool input');
    const selectField = document.querySelector('#search-tool select');
    let tableBody = document.querySelector('tbody');
    if (plainTableRows.length === 0)
        tableBody.innerHTML = `<tr><td colspan="10">Không tìm thấy dữ liệu</td></tr>`;
    const handleSearchingListEvent = e => {
        tableBody = document.querySelector('tbody');
        if (searchingInputTag.value === "") {
            tableBody.innerHTML = plainTableRows.reduce((accumulator, elem) => accumulator + elem.outerHTML, "");
            return;
        }

        let searchingResult = plainTableRows.reduce((accumulator, row) => {
            let currentCellElement = row.querySelectorAll('td')[selectField.value];
            let currentCellValue = currentCellElement.getAttribute("plain-value").trim().toUpperCase();
            let isBeingFoundValue = currentCellValue.search(searchingInputTag.value.trim().toUpperCase()) !== -1;

            return accumulator + (isBeingFoundValue ? row.outerHTML : "");
        }, "");

        if (searchingResult === "")
            tableBody.innerHTML = `<tr><td colspan="10">Không tìm thấy dữ liệu</td></tr>`;
        else
            tableBody.innerHTML = searchingResult;
    }

    searchingInputTag.addEventListener("keyup", handleSearchingListEvent);
}

function convertNumberToCurrency(number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(number))
}

function convertNumberToCurrencySymbol(number) {
    if (number >= 1000000000) return number = (parseInt(number) / 1000000000).toFixed(1) + " tỷ"
    else if (number >= 1000000) return number = (parseInt(number) / 1000000).toFixed(1) + "tr"
    else if (number >= 1000) return number = (parseInt(number) / 1000).toFixed(1) + "k"
    else return number + "đ"
}

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

//Hiện thông báo fetch thất bại
function fetchFailed(response, errorMessage) {
    if (response.status === 401) {
        toast({
            title: "Hết hạn đăng nhập",
            message: "Vui lòng đăng nhập lại",
            type: "error"
        })
        setTimeout(() => { window.location.href = '../login.html' }, 2000);
    }
    else {
        toast({
            title: "Thất bại",
            message: errorMessage,
            type: "error"
        })
    }
}

async function getNoticeData() {
    numberNotice = 0
    document.querySelector('.notice-list').innerHTML = ""
    await request()
    await roomBill()
    await contract()
    const bell = document.querySelector(".header__right .notice-bell");
    bell.setAttribute("data-number", numberNotice)
    if (numberNotice != 0) {
        bell.classList.add("ring");
    } else {
        bell.classList.remove("ring");
    }
}

window.addEventListener("load", fetchHeaderAndSidebar);

