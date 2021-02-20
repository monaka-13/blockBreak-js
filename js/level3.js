var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//ball
var x = canvas.width / 2;
var y = canvas.height - 50;
var dx = 2;
var dy = 2;
var ballRadius = 5;
var ballColor = "#fff33f";
var bound = ballRadius / 3 * 2;

//paddle
var paddleHeight = 10;
var paddleWidth = 120;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleY = canvas.height - paddleHeight * 3;
var paddleColor = "#c0c0c0";

//bricks
var bricks = []; //ブロック生成
var brickRowCount = 5;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brickColor1 = "#b87333"; //brown
var brickColor2 = "#00cc00"; //green
var brickColor3 = "#cc0000"; //red

//items
var items = [];
var itemCount = 0;
var itemRadius = 10;
var itemColor = "purple";
var diy = 2;
var itemColor_life = "purple";
var itemTime=0;

//remain
var remain = brickRowCount * brickColumnCount;
var remainFontColor = "#fff33f";
var remainFont = "16px Arial";
var remainX = 8;
var remainY = 20;

//life
var lives = 3;
var life = "";
var lifeFont = "16px Arial";
var lifeFontColor = "#fff33f";
var lifeX = 420;
var lifeY = 20;


//keyboard
var rightPressed = false;
var leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
prepare();
game();

function prepare() { //描画準備
    createLife();
    createBlock();
    createItem();
}

function createLife() { //ライフ初期生成
    life = "";
    for (var i = 0; i < lives; i++) {
        life += ("♥");
    }
}

function createBlock() { //ブロック配列生成
    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
            var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
            bricks[c][r] = {
                x: brickX, y: brickY, status: 1, item: 999
            };
            var brick = bricks[c][r];
            var ix = brick.x + brickWidth / 2;
            var iy = brick.y + brickHeight / 2;

            //statusControl
            if (c == 2 && (r == 2 || r == 4)) {
                brick.status = 3;
            } else if (r == 1 || r == 3) {
                brick.status = 2
            } else {
                brick.status = 1
            }

            //itemControl
            if (c == 2 && (r == 2 || r == 4)) {
                brick.item = itemCount;
                items[brick.item] = { col: c, row: r, itemX: ix, itemY: iy, itemStatus: 0, type: "" }
                itemCount++;
            }
        }
    }
}

function createItem() {
    for (var i = 0; i < itemCount; i++) {
        if (i == 0) {//item-life
            items[i].type = "life";
            console.log("createLife");
        }
        if (i == 1) {//item-length
            items[i].type = "length";
            console.log(items[i].type);
        }
    }
}

function game() { //ゲームを統括
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    bounds();
    pressKey();
    requestAnimationFrame(game);
}

function draw() { //描画を統括
    drawBall();
    drawPaddle();
    drawBricks();
    drawItems();
    drawRemain();
    drawLives();
}

function bounds() { //衝突関連を統括
    collisionDetection();
    wallBound();
    paddleBound();
}

function drawBall() { //ボール描画
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
    x += dx;
    y += dy;

}

function drawPaddle() { //パドル描画
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() { //ブロック描画
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status > 0) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                if (bricks[c][r].status == 1) {
                    ctx.fillStyle = brickColor1;
                } else if (bricks[c][r].status == 2) {
                    ctx.fillStyle = brickColor2;
                } else {
                    ctx.fillStyle = brickColor3;
                }
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawItems() { //アイテム描画
    for (var i = 0; i < itemCount; i++) {
        if (items[i].itemStatus == 1) {
            var item = items[i];
            ctx.beginPath();
            ctx.arc(item.itemX, item.itemY, itemRadius, 0, Math.PI * 2);
            if (item.type == "life") {
                ctx.fillStyle = itemColor_life;
            } else {
                ctx.fillStyle = "orange";
            }
            ctx.fill();
            ctx.closePath();
            item.itemY += diy;

            if (item.itemY >= canvas.height) {
                item.itemStatus = 0;
            }

            if (item.itemY == paddleY) {
                if (item.itemX > paddleX && x < item.itemX + paddleWidth) {
                    item.itemStatus = 0;
                    console.log(item);
                    if (item.type == "life") {
                        itemAddLife();
                    } else if (item.type = "length") {
                        itemPaddleLength();
                    } else {
                        console.log("itemOther");
                    }
                }
            }
        }
        itemTime-=10;
        if(itemTime==0){
            paddleWidth=120;
        }
    }
}
function itemAddLife() {
    console.log("itemAddLife");
    lives++;
    createLife();
}
function itemPaddleLength() {
    paddleWidth=200;
    console.log("itemPaddleLength");
    itemTime=20000;
}

function drawRemain() { //残り時間描画
    ctx.font = remainFont;
    ctx.fillStyle = remainFontColor;
    ctx.fillText("残り: " + remain, remainX, remainY);
}

function drawLives() { //ライフ描画
    ctx.font = lifeFont;
    ctx.fillStyle = lifeFontColor;
    ctx.fillText(life, lifeX, lifeY);
}

function collisionDetection() { //衝突検知
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status > 1) {
                if (x + bound > b.x && x - bound < b.x + brickWidth && y + bound > b.y && y - bound < b.y + brickHeight) {
                    dy = -dy;
                    if (b.status == 3) { //アイテム生成
                        items[b.item].itemStatus = 1;
                    }
                    b.status--;
                }
            } else if (b.status == 1) {
                if (x + bound > b.x && x - bound < b.x + brickWidth && y + bound > b.y && y - bound < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    remain--;
                    if (remain == 0) {
                        alert("YOU WIN!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function wallBound() {
    if (x + dx - bound < 0 || x + dx + bound > canvas.width) { //横壁
        dx = -dx;
    }
    if (y + dy - bound < 0) { //縦壁
        dy = -dy;
    } else if (y + dy > canvas.height) { //ミス時処理
        lives--;
        life = "";
        createLife();
        if (!lives) { //ライフ全損
            alert("GameOver");
            document.location.reload();
            clearInterval(interval);
        } else {
            x = canvas.width / 2;
            y = paddleY;
            dx = 2;
            dy = 2;
            paddleX = (canvas.width - paddleWidth) / 2;
        }
    }
}

function paddleBound() {
    //バーのバウンド
    if (y == paddleY) {
        if ((x > paddleX && x < paddleX + paddleWidth * 0.2) || (x > paddleX + paddleWidth * 0.8 && x < paddleX + paddleWidth)) {
            var temp = dx;
            if (dx > 0) {
                dx = dy * 1;
                dy = -temp * 0.5;
            } else if (dx < 0) {
                dx = -dy * 1;
                dy = temp * 0.5;
            }

        } else if (x > paddleX && x < paddleX + paddleWidth) {
            if (dy >= 2) {
                dx = dx * 1.05;
                dy = -dy * 1.05;
            } else {
                if (dx > 0) {
                    dx = 2;
                } else {
                    dx = -2;
                }
                dy = -2;
            }
        }
    }
}
function pressKey() {
    //キー操作
    if (rightPressed) {
        paddleX += 3;
    } else if (leftPressed) {
        paddleX -= 3;
    }
}

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}