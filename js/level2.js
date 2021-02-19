var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 50;
var dx = 2;
var dy = 2;
var ballRadius = 5;
var ballColor = "#fff33f";
var itemColor = "green";
var bound = ballRadius / 3 * 2;
var paddleHeight = 10;
var paddleWidth = 120;
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

for(var i=0;i<lives;i++){//ライフ初期生成
    life+=("♥");
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawItems();
    drawRemain();
    drawLives();
    collisionDetection();
    wallBound();
    paddleBound();
    getItem();
    pressKey();



    requestAnimationFrame(draw);
}

function drawBall(){//ボール描画
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
    x += dx;
    y += dy;

}

function drawPaddle() {//パドル描画
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}


var items = [];
var itemCount = 0;

var bricks = [];//ブロック生成
for(var c=0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(var r = 0; r<brickRowCount; r++) {
        var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;


        if(c == 2 && (r == 2 || r == 4)){
            bricks[c][r] = { x: brickX, y: brickY, status:3, item: itemCount};
            var ix = bricks[c][r].x + brickWidth/2;
            var iy = bricks[c][r].y + brickHeight/2;
            items[itemCount] = {col: c, row: r, itemX: ix, itemY: iy, itemStatus: 0, type: "life"}
            itemCount++;
        }else if(r == 1){
            bricks[c][r] = { x: brickX, y: brickY, status:2 };
        }else{
            bricks[c][r] = { x: brickX, y: brickY, status:1 };
        }
    }
}

function drawBricks() {//ブロック描画
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status > 0){
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                if(bricks[c][r].status == 1){
                    ctx.fillStyle = "#b87333";//brown
                }else if(bricks[c][r].status == 2){
                    ctx.fillStyle = "#00cc00";//green
                }else{
                    ctx.fillStyle = "#ff0000";//red
                }
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


function drawItems(){
    for(var i = 0; i < itemCount; i++){
        if(items[i].itemStatus == 1){
            var item = items[i];
            ctx.beginPath();
            ctx.arc(item.itemX, item.itemY, 10, 0, Math.PI*2);
            ctx.fillStyle = "purple";
            ctx.fill();
            ctx.closePath();
            item.itemY += 2;
            if(item.itemY >= canvas.height){
                item.itemStatus = 0;
            }
            if(item.itemY==paddleY){
                if(item.itemX > paddleX && x < item.itemX + paddleWidth){
                    item.itemStatus = 2;
                }
            }
        }
    }
}
function getItem(){

}

function drawRemain(){//残り時間描画
    ctx.font = "16px Arial";
    ctx.fillStyle = fontColor;
    ctx.fillText("残り: "+remain, 8, 20);
}
function drawLives(){//ライフ描画
    ctx.font = "16px Arial";
    ctx.fillStyle = fontColor;
    ctx.fillText(life, 440, 20);
}

function collisionDetection() {//衝突検知
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status > 1){
                if (x + bound > b.x && x - bound < b.x + brickWidth && y + bound > b.y && y - bound < b.y + brickHeight) {
                    dy = -dy;
                    if(b.status==3){//アイテム生成
                        items[b.item].itemStatus = 1;
                    }
                    b.status--;
                }
            }else if(b.status == 1){
                if (x + bound > b.x && x - bound < b.x + brickWidth && y + bound > b.y && y - bound < b.y + brickHeight) {
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
function wallBound(){
    if(x + dx - bound < 0 || x + dx + bound > canvas.width){//横壁
        dx = -dx;
    }
    if(y + dy - bound < 0){//縦壁
        dy = -dy;
    }else if(y + dy> canvas.height){//ミス時処理
        lives--;
        life="";
        for(var i=0;i<lives;i++){
            life+=("♥");
        }
        if(!lives){//ライフ全損
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
}
function paddleBound(){
    //バーのバウンド
    if(y==paddleY){
        if((x > paddleX && x < paddleX + paddleWidth * 0.1)||(x > paddleX + paddleWidth * 0.9 && x < paddleX + paddleWidth)){
            dx = dx * 0.5;
            dy = -dy * 0.5;
        }else if(x > paddleX && x < paddleX + paddleWidth){
            if (dy >= 2){
                dx = dx * 1.05;
                dy = -dy * 1.05;
            }else{
                if(dx > 0){
                    dx = 2;
                }else{
                    dx = -2;
                }
                dy = -2;
            }
        }
    }
}
function pressKey(){
    //キー操作
    if(rightPressed) {
        paddleX += 3;
    }
    else if(leftPressed) {
        paddleX -= 3;
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
draw();
