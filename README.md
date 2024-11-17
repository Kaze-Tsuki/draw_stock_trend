# Draw Stock Trend

## 目標

1. 擷取API
2. 展示API
3. 找回歸線
4. 分析數據

### 目前進度

只做到第2.5步  
其餘的資料分析篩選還沒有實現，希望可以放在analysis裡面

### 擷取API

目前用fetchAndConvertTableToJSON函式完成  
需要傳入股票代號(台灣)，會用fetch找證交所API
並轉換為json 格式

### 展示API

使用生成好的JSON檔案  
配合add_data，將資料傳入points、lines
呼叫show_graph，讀取兩個變數並更新圖表

### 找回歸線

目前沒有使用矩陣運算，而是使用最小平方法計算(標準差那個)  
使用的函式在analysis裡面(linearRegression)

## DEBUGGER

目前可能發生問題

1. API無效
2. 沒有CORS

### API無效

特徵：TypeError: Failed to fetch  
檢查方式：前往證交所網站看看他API是不是爆了  
修復方式：無

### 沒有CORS

特徵：Failed to load resource: net::ERR_FAILED  
檢查方式：console報錯會有"has been blocked by CORS policy"  
修復方式：請使用伺服器(php, python, node.js)開啟一個server
