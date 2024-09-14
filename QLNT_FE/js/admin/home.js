const tableRoom = document.getElementsByClassName('table_room')[0];
const tableRequest = document.getElementsByClassName("table_request")[0];
const numberRoom = document.querySelector(".main-content .card__detail.room h1");
const numberCustomer = document.querySelector(".main-content .card__detail.customer h1");
const loiNhuan = document.getElementsByClassName("loiNhuan")[0];
const soYeuCau = document.getElementsByClassName("soYeuCau")[0];
var roomType = []
var yeucau = 0;
// them vao table room 
const dataRoom = async () => {
    // lay tat ca phong
    const response = await fetch(`${url}/room/all`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token")
          },
    });
    // load so khach hang
    const customer = await fetch(`${url}/customer/all`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    // lay doanh thu
    const doanhThu = await fetch(`${url}/statistical`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    })

    if( response.status === 200 ){
        // chuyen doi data phong
        const data = await response.json();
        numberRoom.innerHTML = data.length;
        // hien thi so nguoi thue
        const dataCustomer = await customer.json();
        numberCustomer.innerHTML = dataCustomer.length;
        // hien thi doanh thu
        const dataDoanhThu = await doanhThu.json();
        loiNhuan.innerHTML = convertNumberToCurrencySymbol(dataDoanhThu.revenue.reduce((total,num)=> total + num),0)
        // hien thi so yeu cau
        soYeuCau.innerHTML = yeucau;
        data.forEach( (d, index)=>{
            const roomTypeName = roomType.find((item)=> item.roomTypeId === d.roomTypeId).roomTypeName
            // tao hang
            const tr = document.createElement('tr');
            //tao cot
            const td = document.createElement('td')
            td.textContent = index + 1
            td.style.width = '10%';
            const td1 = document.createElement('td')
            td1.textContent = d.roomId
            td1.style.width = '25%';
            const td2 = document.createElement('td')
            td2.textContent = roomTypeName
            td2.style.width = '35%';
            const td3 = document.createElement('td')
            td3.textContent = convertNumberToCurrency(d['price'])
            td3.style.width = '30%';
            // them phan tu con vao
            tr.appendChild(td)
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tableRoom.appendChild(tr);
        });
    }else fetchFailed(response,"Không thể hiển thị danh sách phòng")
}

// lay yeu cau ng gửi
const dataRequest = async () =>{
    const response = await fetch(`${url}/request/false`, {
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
          },
    });

    if( response.status === 200 ){
        const data = await response.json();
        console.log(data)
        yeucau = data.length
        data.forEach( (d, index)=>{
        // // tao hang
        const tr = document.createElement('tr');
        //tao cot
        const td = document.createElement('td')
        td.textContent = index + 1
        td.style.width = '5%';
        const td1 = document.createElement('td')
        td1.textContent = d.lastName +' ' + d.firstName;
        td1.style.width = '30%';
        const td2 = document.createElement('td')
        td2.textContent = d.message
        td2.style.width = '45%';
        const td3 = document.createElement('td')
        td3.textContent = d.createdDate
        td3.style.width = '20%';
        // them phan tu con vao
        tr.appendChild(td)
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tableRequest.appendChild(tr);
    });
    }else fetchFailed(response,"Không thể hiển thị danh sách yêu cầu")
}

const dataRoomType = async () =>{
    const response = await fetch(`${url}/roomType/all`, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    });
    if (response.status === 200) {
        roomType = await response.json();
    }
    else fetchFailed(response,"Không thể hiển thị loại phòng")
}

window.addEventListener("load",()=>{
    dataRoomType();
    dataRoom();
    dataRequest();
})