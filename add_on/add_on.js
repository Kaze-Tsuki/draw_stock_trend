var toggle_menu = true;

function call_menu()
{
    const menu_box= document.getElementById("menu_box");
    const menu_sign = document.getElementById("menu");
    if(toggle_menu)//not print
    {
        menu_box.style.display = "initial";
        toggle_menu = false;
        menu_sign.src = "add_on/cancel.png";
        //input_block.style.animation="input_move_right 0.1s ease";
    }
    else
    {
        menu_box.style.display = "none";
        toggle_menu = true;
        menu_sign.src = "add_on/menu.png";
        //input_block.style.animation="input_move_left 0.1s ease";
    }
}

about = () =>
{
    alert("這是一個使用線性代數分析股票的網頁，使用者可以輸入股票代號，並且獲得股票的回歸線。\n"+
    "並使用黃金價格、美元匯率、十年期國債利率、台股加權指數來預測股票的價格。");
}

formula = () =>
{
    alert("Index 1 = 黃金價格 * 0.561 + 美元匯率 * -0.696 + 台股加權指數 * 1 + 十年期國債利率 * -1.048\n"+
    "Index 2 = 黃金價格 * 1.325 + 美元匯率 * 1.188 + 台股加權指數 * 1 + 十年期國債利率 * 0.875");
}

disable = (ele) => ele.style.display = "none";