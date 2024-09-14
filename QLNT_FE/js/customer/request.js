
const urlUser = "http://localhost:8080/user";


const outsideForm = document.getElementById("outside__form")
const sendRequestForm = document.getElementById("send__request__form")
const inputContent = document.getElementById("input-content")
const sendRequestBtn = document.getElementById("send-btn")
const warning = document.getElementById("warning")

var info
var historyData

function formattedDateTime(date) {
    const dateObject = new Date(Date.parse(date));
    return dateObject.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit',
        minute: '2-digit'
    });
}

async function getCustomerInfo () {
    const customerInfo = await fetch(urlUser + "/customer/"  + sessionStorage.getItem("id"), {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });
    
    if (customerInfo.status === 200) {
        info = await customerInfo.json();
        if (info !== null) {
            historyRequest()
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

async function sendRequest() {
    const requestAPI = await fetch(urlUser + "/request/" + info.customerId + "/add" , {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: inputContent.value
    })
    console.log(inputContent.value)
    if (requestAPI.status === 200) {
        historyRequest()
        toast({
            title: "Thành công",
            message: "Yêu cầu đã được gửi đi!",
            type: "success"
        })
    } else if (requestAPI.status === 401) {
        toast({
            title: "Hết hạn đăng nhập",
            message: "Vui lòng đăng nhập lại",
            type: "error"
        })
        const logout = setTimeout(() => { window.location.href = '../login.html' }, 3000);
    }
    else {
        toast({
            title: "Loading...",
            message: "Dữ liệu lỗi!!!",
            type: "error"
        })
    }
    inputContent.value = ""
}

async function historyRequest() {
    const historyRequestAPI = await fetch(urlUser + "/request/history/" + info.customerId  + "/true", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        }
    })
    if (historyRequestAPI.status === 200) {
        const history = await historyRequestAPI.json()
        if (history !== null) {
            historyData = history
            renderHistoryRequest()
            console.log(history, historyData)
        }
    }
}

function renderHistoryRequest() {
    let historyArr = []
    if (historyData.length === 0) {
        historyArr.push(
            `
                <h3 id="no__request">Không có yêu cầu</h3>
            `
        )
        document.getElementById("history").innerHTML = historyArr.join("")
    } else {
        historyArr.push(
            `
            <tr class="table-header">
                <th id="order-col">STT</th>
                <th>Nội dung</th>
                <th id="time-col">Thời gian</th>
                <th id="status-col">Trạng thái</th>
            </tr>
            `
        )
        for (let i = 0; i < historyData.length; i++) {
            if (i % 2 !== 0) {
                historyArr.push(
                    `   
                    <tr class="table__content__odd">
                        <td class="order">${i + 1}</td>
                        <td class="contentRequest">${historyData[i].message}</td>
                        <td class="createTime">${formattedDateTime(historyData[i].createdDate)}</td>
                        <td id="isSolve" class="status">${historyData[i].status === true ? "Đã giải quyết" : "Chưa giải quyết"}</td>
                    </tr>
                    `
                )
            } else {
                historyArr.push(
                    `   
                    <tr class="table__content__even">
                        <td class="order">${i + 1}</td>
                        <td class="contentRequest">${historyData[i].message}</td>
                        <td class="createTime">${formattedDateTime(historyData[i].createdDate)}</td>
                        <td id="isSolve" class="status">${historyData[i].status === true ? "Đã giải quyết" : "Chưa giải quyết"}</td>
                    </tr>
                    `
                )
            }
        }
        document.getElementById("history").innerHTML = historyArr.join("")
    }

}

getCustomerInfo()

sendRequestBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if (inputContent.value === "") {
        //e.preventDefault()
        warning.textContent = "Vui lòng nhập nội dung yêu cầu!"
        warning.style.opacity = 1
    } 
    else if (inputContent.value.length <= 15) {
        //e.preventDefault()
        warning.textContent = "Hãy nhập nội dung chi tiết hơn!"
        warning.style.opacity = 1
    } else {
        warning.style.opacity = 0
        sendRequestForm.addEventListener("submit", sendRequest())
    }
    //sendRequestForm.addEventListener("submit", sendRequest())
})

sendRequestBtn.addEventListener('mousedown', (e) => {
    sendRequestBtn.style.scale = 0.98})

sendRequestBtn.addEventListener('mouseup', (e) => {
    sendRequestBtn.style.scale = 1
})