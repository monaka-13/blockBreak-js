//config
var dx = 2;//角度
var dy = -2;//角度
var ballRadius = 5;//ボールの大きさ
var paddleHeight = 10;//パドルの高さ
var paddleWidth = 75;//パドルの幅
var brickRowCount = 3;//ブロックの横の数
var brickColumnCount = 5;//ブロックの縦の数
var brickWidth = 75;//ブロックの幅
var brickHeight = 20;//ブロックの高さ
var brickPadding = 10;//ブロックの間隔
var brickOffsetTop = 30;//ブロック配置位置
var brickOffsetLeft = 30;//ブロック配置位置
var blockRemain = brickRowCount * brickColumnCount;
var lives = 3;//life

//common config
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;//ボール開始位置
var y = canvas.height-30;//ボール開始位置
var paddleX = (canvas.width - paddleWidth) / 2;//パドル開始位置
var rightPressed = false;
var leftPressed = false;

var bricks = [];
for(var c = 0; c < brickColumnCount; c++){
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++){
        bricks[c][r]={x: 0, y: 0, status:1};
    }
}


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

function drawRemain(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095dd";
    ctx.fillText("blockRemain: "+blockRemain, 8, 20);
}

function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095dd";
    ctx.fillText("Lives: "+lives, 420, 20);
}

function draw(){
    //描画コード
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawRemain();
    drawLives();
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
            lives--;
            if(!lives){
                alert("GameOver");
                document.location.reload();
            }else{
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth){
        paddleX += 7;
    }else if(leftPressed && paddleX > 0){
        paddleX -= 7;
    }

    requestAnimationFrame(draw);
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
document.addEventListener("mousemove",mouseMoveHandler,false);
function mouseMoveHandler(e){
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX <canvas.width){
        paddleX = relativeX - paddleWidth/2;
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
                    blockRemain--;
                    if(blockRemain == 0){
                        alert("YouWin");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

draw();
