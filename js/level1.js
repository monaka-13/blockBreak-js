var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 50;
var dx = 2;
var dy = 2;
var ballRadius = 5;
var ballColor = "#fff33f"
var bound = ballRadius / 3 * 2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var paddleY =canvas.height-paddleHeight*3;
var paddleColor = "#c0c0c0";
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var remain = brickRowCount*brickColumnCount;
var fontColor = "#fff33f";
var lives = 3;
var life = "";
for(var i=0;i<lives;i++){
    life+=("♥");
}


var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status:1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1){
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#b87333";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function drawRemain(){
    ctx.font = "16px Arial";
    ctx.fillStyle = fontColor;
    ctx.fillText("残り: "+remain, 8, 20);
}
function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = fontColor;
    ctx.fillText(life, 440, 20);
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawRemain();
    drawLives();
    drawBricks();
    collisionDetection();
    if(x + dx - bound < 0 || x + dx + bound > canvas.width){
        dx = -dx;
    }

    if(y + dy - bound < 0){
        dy = -dy;
    }else if(y + dy> canvas.height){
        lives--;
        life="";
        for(var i=0;i<lives;i++){
            life+=("♥");
        }
        if(!lives){
        alert("GameOver");
        document.location.reload();
        clearInterval(interval);
        }else{
            x = canvas.width/2;
            y = canvas.height-50;
            dx = 2;
            dy = 2;
            paddleX = (canvas.width-paddleWidth)/2;
        }
    }

    if(y==paddleY && x > paddleX && x < paddleX + paddleWidth){//バーのバウンド
        dy = -dy;
    }

    if(rightPressed) {
        paddleX += 3;
    }
    else if(leftPressed) {
        paddleX -= 3;
    }

    x += dx;
    y += dy;
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1){
                if (x+bound > b.x && x-bound < b.x+brickWidth && y+bound > b.y && y-bound < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    remain--;
                    if(remain == 0){
                        alert("YOU WIN!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}
var interval = setInterval(draw, 10);
