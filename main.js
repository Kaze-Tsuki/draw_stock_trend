import {linearRegression, multiLinearRegression} from "./analysis.js"

//points and lines record all fetched infos
var points=[], lines=[];
// showed_stock prevent double fetching the same stock
var showed_stock = [];

// following are the const(in 12 months) will be filled by hand
// gold price
var gold_price = [];
// exchange rate
var exchange_rate = [];
// weighted stock price
var weighted_stock_price = [];
// public debt
var public_debt = [];

// 將事件綁定放在這裡
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submit").addEventListener("click", submit);
});

//add value into points and lines, then update graph
function add_data(tbl, name)
{
    // 散點數據
    var xValues = tbl.map(item => parseFloat(item["月份"]));
    var yValues = tbl.map(item => parseFloat(item["加權(A/B)平均價"].replace(/,/g, "")));
    const { slope, intercept } = linearRegression(xValues, yValues);
    const regressionY = xValues.map(xi => slope * xi + intercept);

    const trace1 = {
        x: xValues,
        y: yValues,
        mode: 'markers',
        name: name
    };

    const trace2 = {
        x: xValues,
        y: regressionY,
        mode: 'lines',
        name: name+"點"
    };
    points.push(trace1);
    lines.push(trace2);
    show_graph();
}

//update graph
function show_graph()
{

    const layout = {
        title: '線性回歸分析',
        xaxis: { title: '月份' },
        yaxis: { title: '均價' }
    };

    Plotly.react('myDiv', points.concat(lines), layout);
}

async function submit()
{
    // init
    var stock_id = document.getElementById("input_stock");
    //check same stock
    if(showed_stock.includes(stock_id.value))
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

    //update graph
    connect(html_tbl);
    add_data(html_tbl, stockName);
}

function connect(html_tbl)
{
    // parse out stock price
    var stock_price = html_tbl.map(item => parseFloat(item["加權(A/B)平均價"].replace(/,/g, "")));
    // call the analyser & get weighted index array
    const { c, a, b, x1, x2 } = multiLinearRegression(weighted_stock_price, gold_price, exchange_rate, public_debt, stock_price);
    
    // generate plotly 3D graph
    add_data_3d(x1, x2, stock_price, c, a, b);
}

// fetch json return {data, firstRow}
async function fetchAndConvertTableToJSON(stock) 
{
    if (!stock || stock === "0") {
    console.error("請輸入有效的股票代碼。");
    return;
    }

    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/FMSRFK?date=20241114&stockNo=${stock}&response=html`;

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
  