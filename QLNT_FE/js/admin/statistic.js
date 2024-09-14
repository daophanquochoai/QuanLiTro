const doanhThu = document.getElementsByClassName("span_doanhThu")[0];
const phongDaThanhToan = document.getElementsByClassName("span_phongDaThanhToan")[0];
const phongChuaDong = document.getElementsByClassName("span_phongChuaDong")[0];
const tongThue = document.getElementsByClassName("span_tongPhongThu")[0];
const thongChuaThue = document.getElementsByClassName("span_tongPhongChuaThue   ")[0];

var dataProfit = [];

const getProfitData = async () => {
    const result = await fetch(`${url}/statistical`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
    })
    dataProfit = await result.json();
    console.log(dataProfit);

    const data = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        datasets: [{
            label: 'Doanh thu theo tháng',
            data: dataProfit.revenue,
            backgroundColor: [
                'rgba(255, 26, 104, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 26, 104, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
                'rgba(255, 26, 104, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 26, 104, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };
    const myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    doanhThu.textContent = convertNumberToCurrency(dataProfit.revenue.reduce((total,num)=> total + num),0);
    phongDaThanhToan.innerHTML = dataProfit.numberOfPaidRoom;
    phongChuaDong.innerHTML = dataProfit.numberOfUnpaidRoom;
    tongThue.innerHTML = dataProfit.numberOfAvailableRoom + dataProfit.numberOfFullRoom;
    thongChuaThue.innerHTML = dataProfit.numberOfEmptyRoom;
}

window.addEventListener("load", getProfitData);