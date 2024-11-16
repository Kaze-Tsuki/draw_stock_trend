import linearRegression from "./analysis.js"


// 將事件綁定放在這裡
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submit").addEventListener("click", submit);
});

function show_graph(tbl)
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
        name: '價位'
    };

    const trace2 = {
        x: xValues,
        y: regressionY,
        mode: 'lines',
        name: '回歸直線'
    };

    const layout = {
        title: '線性回歸分析',
        xaxis: { title: '月份' },
        yaxis: { title: '均價' }
    };
    Plotly.newPlot('myDiv', [trace1, trace2], layout);
}

async function submit()
{
    // fetch
    var stock_id = document.getElementById("input_stock");
    console.log("股票代號：" + stock_id.value);
    var html_tbl = await fetchAndConvertTableToJSON(stock_id.value);
    console.log("以下為讀取到的資料");
    for(var i = 0; i < html_tbl.length; i++)
    {
        console.log(html_tbl[i]);
    }
    //update graph
    show_graph(html_tbl);
}

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
    
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
    
        // 找到表格
        const table = doc.querySelector("table");
        if (!table) {
            console.error("找不到表格數據，請確認股票代碼是否正確。");
            return;
        }
    
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

        return data;
    } catch (error) {
        console.error("發生錯誤：", error);
    }
}
    
fetchAndConvertTableToJSON("0050"); // 測試有效股票代碼
  