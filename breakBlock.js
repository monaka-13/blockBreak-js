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

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for(var c = 0; c < brickColumnCount; c++){
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++){
        bricks[c][r]={x: 0, y: 0, status:1};
    }
}

var score = 0;

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

function drawBricks(){
    for(var c = 0; c < brickColumnCount; c++){
        for(var r = 0; r < brickRowCount; r++){
            if(bricks[c][r].status == 1){
                var brickX =(c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY =(r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw(){
    //描画コード
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

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

function collisionDetection(){
    for (var c = 0; c < brickColumnCount; c++){
        for(var r = 0; r < brickRowCount; r++){
            var b =bricks[c][r];
            if(b.status == 1){
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b. y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount){
                        alert("YouWin");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095dd";
    ctx.fillText("Score: "+score, 8, 20);
}

var interval = setInterval(draw, 10);

