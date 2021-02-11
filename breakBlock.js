var canvas = document.getElementById("myCanvas");
 //2D描画コンテキストを保存
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

var ballRadius = 10;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
}

function draw(){
    //描画コード
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();

    x += dx;
    y += dy;

    //衝突検知
    if(x + dx > canvas.width - ballRadius || x + dx < 0 + ballRadius){
        dx = -dx;
    }
    if(y + dy < ballRadius){
        dy = -dy;
    }else if(y + dy > canvas.height-ballRadius){
        if(x > paddleX && x < paddleX + paddleWidth){
            //パドルで弾けたとき
            dy = -dy;
        }else{
            alert("GameOver");
            document.location.reload();
            clearInterval(interval);
        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth){
        paddleX += 7;
    }else if(leftPressed && paddleX > 0){
        paddleX -= 7;
    }
}

//操作入力
document.addEventListener("keydown", keyDownHandler, false);
function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if(e.key = "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}
document.addEventListener("keyup", keyUpHandler, false);
function keyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if(e.key = "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}
var interval = setInterval(draw, 10);
