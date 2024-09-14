const tableUnsolvedRequest = document.querySelector(".unsolved-request tbody");
const tableSolvedRequest = document.querySelector(".solved-request tbody");
const deleteBtn = document.querySelector(".modal-request__delete .delete");
const solveBtn = document.querySelector(".modal-request__solve .accept");
const modalRequestDelete = document.querySelector(".modal-request__delete")
const modalRequestAccept = document.querySelector(".modal-request__solve")

var dataUnsolvedRequest = []
var dataSolvedRequest = [];


// Bật modal xác nhận đáp ứng yêu cầu
function openAcceptRequestModal(id) {
    //Bật modal
    modalRequestAccept.style.display = "flex"
    solveBtn.value = id
}
// Bật modal xác nhận xóa yeu cầu
function openDeleteRequestModal(id) {
    //Bật modal
    modalRequestDelete.style.display = "flex"
    deleteBtn.value = id
}

solveBtn.addEventListener("click", async (e) => {
    const check = await fetch(`${url}/request/${solveBtn.value}/update`, {
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
        modalRequestAccept.style.display = "none"
        dataSolvedRequest.push(dataUnsolvedRequest.filter(d => d.requestId == solveBtn.value)[0])
        dataUnsolvedRequest = dataUnsolvedRequest.filter(d => d.requestId != solveBtn.value)
        getNoticeData()
        displayData();
    } else fetchFailed(check, await check.text())
})
deleteBtn.addEventListener("click", async (e) => {
    const check = await fetch(`${url}/request/${deleteBtn.value}/delete`, {
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
        modalRequestDelete.style.display = "none"
        dataSolvedRequest = dataSolvedRequest.filter(d => d.requestId != deleteBtn.value)
        displayData();
    } else fetchFailed(check, await check.text())
})

const displayData = async () => {
    tableUnsolvedRequest.innerHTML = "";
    tableSolvedRequest.innerHTML = "";
    dataUnsolvedRequest.forEach((data, index) => {
        console.log(data)
        var tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${data.message}</td>
            <td>${data.lastName} ${data.firstName}</td>
            <td>${data.roomId}</td>
            <td>${new Date(data.createdDate).toLocaleString('VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</td>
            <td>
            <img onclick = openAcceptRequestModal(${data.requestId}) width="40" height="40" src="https://img.icons8.com/pulsar-color/40/checked.png" alt="checked"/>
            </td>
        `
        tableUnsolvedRequest.appendChild(tr);
    })
    dataSolvedRequest.forEach((data, index) => {
        var tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${data.message}</td>
            <td>${data.lastName} ${data.firstName}</td>
            <td>${data.roomId}</td>
            <td>${new Date(data.createdDate+'Z').toLocaleString('VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</td>
            <td>
            <img onclick = openDeleteRequestModal(${data.requestId}) width="40" height="40" src="https://img.icons8.com/pulsar-color/40/cancel.png" alt="cancel" />
            </td>
        `
        tableSolvedRequest.appendChild(tr);
    })

}

// fetch data
const fetchDataRequest = async (status) => {
    const result = await fetch(`${url}/request/${status}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    })
    if (result.status == 401) {
        toast({
            title: "Hết hạn đăng nhập",
            message: "Vui lòng đăng nhập lại",
            type: "error"
        })
        setTimeout(() => { window.location.href = '../login.html' }, 3000);
    }
    const data = await result.json();
    return data;
}


window.addEventListener("load", async () => {
    dataUnsolvedRequest = await fetchDataRequest("false");
    dataSolvedRequest = await fetchDataRequest("true");
    displayData();
})