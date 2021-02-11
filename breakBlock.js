var canvas = document.getElementById("myCanvas");
 //2D描画コンテキストを保存
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI*2);
    ctx.fillStyle="#0095dd";
    ctx.fill();
    ctx.closePath();
}

function draw(){
    //描画コード
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    x += dx;
    y += dy;
}

setInterval(draw, 10);
