# Draw Stock Trend

## 目標

1. 擷取API
2. 展示API
3. 找回歸線
4. 分析數據
5. 加入CSS

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

### 加入CSS

可以變美觀，但不加也無傷大雅

## 函式與變數功用

### submit

綁定按鈕，會先fetch api，再更新圖表

### fetchAndConvertTableToJSON

將api以json檔的形式傳回  
其回傳為二參數 {data, firstRow}
分別為json檔與該股票的名稱

### show_graph

使用全局變數points & lines更新圖表

### add_data

傳入json檔，取出其均價與月份  
生成回歸線，並將寫入points 和 lines  
自動呼叫show_graph更新圖表

### addEventListener

請勿更動，確保按鈕與submit可以連接

### linearRegression

屬於數據分析  
使用最小平方法找出回歸線

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
hello world
