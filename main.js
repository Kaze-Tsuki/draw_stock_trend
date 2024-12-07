import {linearRegression, multiLinearRegression} from "./analysis.js"

var cur_stock_id = 0;
// showed_stock prevent double fetching the same stock
var showed_stock = [];

// slope
var slope = [0, 0, 0];

// following are the const(in 12 months of 2023) will be filled by hand
// gold price
var gold_price = [
    1962.2,
    1853.2,
    2004.1,
    2018.3,
    1982.1,
    1929.4,
    2009.2,
    1965.9,
    1885.4,
    1994.3,
    2038.1,
    2071.8
];

// exchange rate
var exchange_rate = [
    29.994,
    30.715,
    30.535,
    30.738,
    30.693,
    31.129,
    31.433,
    31.844,
    32.23,
    32.468,
    31.361,
    30.682
];

// weighted stock price
var weighted_stock_price = [
    14137.69,
    15625.2,
    15503.79,
    15868.06,
    15579.18,
    16578.96,
    16915.54,
    17145.43,
    16634.51,
    16353.74,
    16001.27,
    17433.85
];

// public debt
var public_debt = [
    1.29,
    1.2,
    1.19,
    1.19,
    1.19,
    1.17,
    1.16,
    1.18,
    1.18,
    1.25,
    1.32,
    1.26
];

// 將事件綁定放在這裡
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submit").addEventListener("click", submit);
});
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("caculate").addEventListener("change", predict);
});

// Add value into points and planes, then update graph
function add_data_3d(x1, x2, stock_price, c, a, b) {
    // 三維散點數據
    // x1, x2, stock_price

    // y = c + ax1 + bx2
    // 構建回歸平面
    const xRange = [Math.min(...x1), Math.max(...x1)];
    const yRange = [Math.min(...x2), Math.max(...x2)];
    const xGrid = [];
    const yGrid = [];
    const zGrid = [];

    for (let x = xRange[0]; x <= xRange[1]; x += (xRange[1] - xRange[0]) / 10) {
        const rowX = [], rowY = [], rowZ = [];
        for (let y = yRange[0]; y <= yRange[1]; y += (yRange[1] - yRange[0]) / 10) {
            rowX.push(x);
            rowY.push(y);
            rowZ.push(a * x + b * y + c);   //需要你們的方程式
        }
        xGrid.push(rowX);
        yGrid.push(rowY);
        zGrid.push(rowZ);
    }

    // 三維散點
    const trace1 = {
        x: x1,
        y: x2,
        z: stock_price,
        mode: 'markers',
        type: 'scatter3d',
        name: cur_stock_id,
        marker: { size: 4, color: 'blue' }
    };

    // 回歸平面
    const surface = {
        x: xGrid,
        y: yGrid,
        z: zGrid,
        type: 'surface',
        name: `回歸平面`,
        opacity: 0.6,
        colorscale: 'Viridis'
    };

    const layout = {
        title: '三維線性回歸分析',
        scene: {
            xaxis: { title: 'idx_1' },
            yaxis: { title: 'idx_2' },
            zaxis: { title: '均價' }
        }
    };

    Plotly.react('myDiv', [trace1, surface], layout);
}


async function submit()
{
    // init
    var stock_id = document.getElementById("input_stock");
    //check same stock
    if(cur_stock_id == stock_id.value)
    {
        alert(`Has Showed ${stock_id.value}`);
        return;
    }

    console.log("股票代號：" + stock_id.value);
    showed_stock.push(stock_id.value);

    //fetch
    var {data: html_tbl, firstRow: stockName} = await fetchAndConvertTableToJSON(stock_id.value);
    // show fetched info
    console.log("以下為讀取到的資料");
    for(var i = 0; i < html_tbl.length; i++)console.log(html_tbl[i]);

    console.log(stockName);
    cur_stock_id = stock_id.value;

    //update graph
    connect(html_tbl);

}

function predict()
{
    var gold = document.getElementById("input_gold").value;
    var exchange = document.getElementById("input_exchange").value;
    var public_debt = document.getElementById("input_debt").value;
    var weighted = document.getElementById("input_weighted").value;
    // caculate idx_1 & idx_2
    // gold * 0.561 + exchange * -0.696 + weighted * 1 + public_debt * -1.048 = x1
    // gold * 1.325 + exchange * 1.188 + weighted * 1 + public_debt * 0.875 = x2
    var x1 = gold * 0.561 + exchange * -0.696 + weighted * 1 + public_debt * -1.048;
    var x2 = gold * 1.325 + exchange * 1.188 + weighted * 1 + public_debt * 0.875;
    // predict y = [0] + [1] * x1 + [2] * x2
    var predict = slope[0] + slope[1] * x1 + slope[2] * x2;
    document.getElementById("idx_1").innerText = x1;
    document.getElementById("idx_2").innerText = x2;
    document.getElementById("result").innerText = predict;
}

function connect(html_tbl)
{
    // parse out stock price
    var stock_price = html_tbl.map(item => parseFloat(item["加權(A/B)平均價"].replace(/,/g, "")));
    // call the analyser & get weighted index array
    const { c, a, b, x1, x2 } = multiLinearRegression(weighted_stock_price, gold_price, exchange_rate, public_debt, stock_price);
    slope = [c, a, b];
    // generate plotly 3D graph
    add_data_3d(x1, x2, stock_price, c, a, b);
    predict();
}

// fetch json return {data, firstRow}
async function fetchAndConvertTableToJSON(stock) 
{
    if (!stock || stock === "0") {
    console.error("請輸入有效的股票代碼。");
    return;
    }

    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/FMSRFK?date=20230101&stockNo=${stock}&response=html`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`無法取得數據，HTTP 錯誤狀態碼：${response.status}`);
            return;
        }
        
        // 將html檔轉文字，再parse
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
    
        // 找到表格
        const table = doc.querySelector("table");
        if (!table) {
            console.error("找不到表格數據，請確認股票代碼是否正確。");
            return;
        }
        
        // 讀取表格名稱
        const firstRow = table.querySelector("thead > tr > th").innerText.replace(/\s+/g, ' ').trim();

        // 讀取表頭資料 從第二行開始
        const headers = Array.from(table.querySelectorAll("thead tr:nth-child(2) th")).map(th => th.innerText.trim());
    
        // 讀取表格資料行
        const rows = Array.from(table.querySelectorAll("tbody tr"));
        console.log(`總共有 ${rows.length} 行數據`);
    
        const data = rows.map(row => {
            const cells = row.querySelectorAll("td");
            const rowData = {};
    
            // 確保每一列的數據與表頭對應
            headers.forEach((header, i) => {
            rowData[header] = cells[i] ? cells[i].innerText.trim() : ''; // 防止 cells 長度不一致
            });
    
            return rowData;
        });
    
        // 輸出結果
        // const json = JSON.stringify(data, null, 2);
        // console.log(json);

        return {data, firstRow};
    } catch (error) {
        console.error("發生錯誤：", error);
    }
}
  