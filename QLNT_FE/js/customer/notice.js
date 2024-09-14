
const urlUsrNotice = "http://localhost:8080/user";

const hideNotice = document.getElementsByClassName("wrapper__delete__notice")

var detailInfo
var listAllNotice = []
var index = []

console.log(listAllNotice)

async function getCustomerInfo () {
    const customerInfo = await fetch(urlUsrNotice + "/customer/"  + sessionStorage.getItem("id"), {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    });
    
    if (customerInfo.status === 200) {
        const infoCustomer = await customerInfo.json();
        if (infoCustomer !== null) {
            getAllNotice(infoCustomer.customerId)
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

async function getAllNotice (idToGetNotice) {
    const getAllNoticeAPI = await fetch(urlUsrNotice + "/request/history/" + idToGetNotice + "/false", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        }
    })
    if (getAllNoticeAPI.status === 200) {
        const listAllRequest = await getAllNoticeAPI.json()
        if (listAllRequest !== null) {
            console.log(listAllRequest)
            for (let i = 0; i < listAllRequest.length; i++) {
                listAllNotice.push([{'createdDate':listAllRequest[i].createdDate, 'message': listAllRequest[i].message, 'requestId': listAllRequest[i].requestId}, true])
            }

            // if (listAllNotice.length === 0) {
            //     for (let i = 0; i < listAllRequest.length; i++) {
            //         listAllNotice.push([{'createdDate':listAllRequest[i].createdDate, 'message': listAllRequest[i].message, 'requestId': listAllRequest[i].requestId}, true])
            //     }
            // } else {
            //     let check = true
            //     for (let i = 0; i < listAllNotice.length; i++) {
            //         if(listAllNotice[i][1] === false) {
            //             check = false
            //         }
            //     }
            //     if (check === false) {
            //         console.log("Push element")
            //         for (let i = 0; i < listAllRequest.length; i++) {
            //             listAllNotice.push([{'createdDate':listAllRequest[i].createdDate, 'message': listAllRequest[i].message, 'requestId': listAllRequest[i].requestId}, true])
            //         }
            //     } else {
            //         for (let i = 0; i < listAllRequest.length; i++) {
            //             for (let j = 0; j < listAllNotice.length; j++) {
            //                 if (listAllNotice[j][0].requestId === listAllRequest[i].requestId) {
            //                     console.log("Duplicate: ", listAllRequest[i].message)
            //                     listAllRequest.splice(i, 1)
            //                 } 
            //             }
            //         }
            //     }
            //     for (let i = 0; i < listAllRequest.length; i++) {
            //         listAllNotice.push([{'createdDate':listAllRequest[i].createdDate, 'message': listAllRequest[i].message, 'requestId': listAllRequest[i].requestId}, true])
            //     }
            // }

            console.log(listAllNotice, listAllRequest)   
            renderAllNotice(listAllNotice)         
        }
    } else if (getAllNoticeAPI.status === 401) {
        toast({
            title: "Hết hạn đăng nhập",
            message: "Vui lòng đăng nhập lại",
            type: "error"
        })
        const logout = setTimeout(() => { window.location.href = '../login.html' }, 2000);
    } else {
        toast({
            title: "Loading...",
            message: "Dữ liệu lỗi!!!",
            type: "error"
        })
    }
}

function checkStatus() {
    let check = true
    for (let i = 0; i < listAllNotice.length; i++) {
        if(listAllNotice[i][1] === false) {
            check = false
        }
    }
    return check
}

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

function renderAllNotice(listAllNotice) {
    let noticeArr = []
    index.length = 0
        for (let i = 0; i < listAllNotice.length; i++) {
            if (listAllNotice[i][1] === true) {
                index.push(i)
                noticeArr.push(
                    `
                    <div class="wrapper__detail__notice">
                        <div class="order__notice"><h4 id="order__number">${i + 1}</h4></div>
                        <div class="wrapper__content__detail__notice">
                            <p class="content__detail__notice">${listAllNotice[i][0].message}</p>
                        </div>
                        <div class="wrapper__datetime__detail__notice">
                            <p class="datetime__detail__notice">${formattedDateTime(listAllNotice[i][0].createdDate)}</p>
                        </div>
                    </div>
                    `
                )
            }           
        }    
        document.getElementById("wrapper__list__notice").innerHTML = noticeArr.join("")
}

/* <div class="wrapper__delete__notice">
    <i class="fa-solid fa-xmark" style="color: white"></i>
</div> */

// function hideNoticeFunc(index) {
//     for (let i = 0; i < index.length; i++) {
//         hideNotice[i].addEventListener('click', (e) => {
//             console.log("index: ",index)
//             console.log(listAllNotice)
//             listAllNotice[index[i]][1] = false
//             // listAllNotice[index[i]].splice(1, 1, false)
//             console.log(listAllNotice[index[i]][0].message)
//             renderAllNotice(listAllNotice)
//             console.log(e.target)
//         })
//     }
// }

getCustomerInfo()

