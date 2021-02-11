var canvas = document.getElementById("myCanvas");
 //2D描画コンテキストを保存
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

var ballRadius = 10;

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
}

function draw(){
    //描画コード
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    x += dx;
    y += dy;

    //衝突検知
    if(x + dx > canvas.width - ballRadius || x + dx < 0 + ballRadius){
        dx = -dx;
    }
    if(y + dy > canvas.height-ballRadius || y + dy < 0 + ballRadius){
        dy = -dy;
    }
}

setInterval(draw, 10);
