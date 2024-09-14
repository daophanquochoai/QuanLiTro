const urlUser = "http://localhost:8080/user";

const contractId = document.querySelector("#contractId")
const customerName = document.querySelector("#customerName")
const ownerName = document.querySelector("#ownerName")
const room = document.querySelector("#room")
const price = document.querySelector("#price")
const deposit = document.querySelector("#deposit")
const createContract = document.querySelector("#createContract")
const startTime = document.querySelector("#startTime")
const endTime = document.querySelector("#endTime")
var fullname = {}
var onlyContractId


function formattedDateTIime(date) {
    const dateObject = new Date(Date.parse(date));
    return dateObject.toLocaleDateString('vi-VN', {
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    });
}

function formatCurrency(price) {
    const number = parseFloat(price);
    if (isNaN(number)) {
      return 'Invalid input';
    }
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(number);
    return formattedPrice.toString();
  }

async function getContract(contractId) {
    const contractInfo = await fetch(urlUser + "/contract/" + sessionStorage.getItem('id') , {
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });

    if (contractInfo.status === 200) {
        const contractDetail = await contractInfo.json();
        console.log("Contract: ",contractDetail)
        renderContract(contractDetail)
    }
    
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

        fullname.f_name = info.firstName
        fullname.l_name = info.lastName

        getRoomId(info.roomId)
    }
}

async function getRoomId (roomId) {
    const roomInfo = await fetch(urlUser + "/room/" + roomId, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        }
    });
    if (roomInfo.status === 200) {
        const detailRoomInfo = await roomInfo.json()
        if (detailRoomInfo !== null) {
            onlyContractId = detailRoomInfo.contract.contractId
            getContract(detailRoomInfo.contract.contractId)
        }
    }
}

function renderContract (contractInfo) {
    contractId.textContent = onlyContractId
    customerName.textContent = fullname.f_name + " " + fullname.l_name
    room.textContent = contractInfo.roomId
    //deposit.textContent = formatCurrency(2000000)
    createContract.textContent = formattedDateTIime(contractInfo.createdDate)
    startTime.textContent = formattedDateTIime(contractInfo.beginDate)
    endTime.textContent = formattedDateTIime(contractInfo.endDate)
}

getCustomerInfo()
