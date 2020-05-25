let canvas = document.getElementById("game");
let context = canvas.getContext('2d');
    

let ball = {
    x : 549,
    y : 579,
    dx: 3,
    dy: 3.5,
    radius: 12,
}
let paddle = {
    width: 100,
    height: 10,
    x: 500,
    y: canvas.height - 10,
    speed: 10,
    isMovingLeft: false,
    isMovingRight: false,
};
let bricksConfig = {
    offsetX: 30,
    offsetY: 30,
    margin: 30,
    width: 70,
    height: 15,
    totalRow: 5,
    totalCol: 10,
};
let isGameOver = false;
let isGameWin = false;
let userScore = 0;
let maxScore = bricksConfig.totalRow * bricksConfig.totalCol;

let brickList = [];
for(i = 0; i < bricksConfig.totalRow; i++){
    for(j = 0; j < bricksConfig.totalCol; j++){
        brickList.push({
            x: bricksConfig.offsetX + j * (bricksConfig.width + bricksConfig.margin),
            y: bricksConfig.offsetY + i * (bricksConfig.height + bricksConfig.margin),
            isBroken: false,
        });
    }
}

document.addEventListener('keyup', function(event){
    if(event.keyCode == 37){
        paddle.isMovingLeft = false;
    }else if(event.keyCode == 39){
            paddle.isMovingRight = false;
        }
    
});

document.addEventListener('keydown', function(event){
    if(event.keyCode == 37){
        paddle.isMovingLeft = true;
    }else if(event.keyCode == 39){
            paddle.isMovingRight = true;
        }
    
});

function drawBall(){
context.beginPath();
context.arc(ball.x,ball.y,ball.radius,0, Math.PI *2);
context.fillStyle = "white";
context.fill();
context.closePath();
}

function drawPaddle(){
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fillStyle = "#ADFF2F"
    context.fill();
    context.closePath();
}

// 2 *OFFSET + 10 * width + 9 * MARGIN = 1000
// OFFSET = MARGIN = 30
// => width = 70
// row = 5
// col = 10

function drawBricks(){
    brickList.forEach(function (b){
        if(!b.isBroken){
            context.beginPath();
            context.rect( b.x, b.y, bricksConfig.width, bricksConfig.height);
            context.fillStyle = "#ffff00"
            context.fill();
            context.closePath();
        }
    });          
}

function handleBallCollidBound(){
    if(ball.x < ball.radius || ball.x > canvas.width - ball.radius){
        ball.dx = -ball.dx
    }
    if(ball.y < ball.radius ){
        ball.dy = -ball.dy
    }
}

function handBallCollidPaddle(){
    if(ball.x + ball.radius >= paddle.x && ball.x + ball.radius <= paddle.x + paddle.width && ball.y + ball.radius >= canvas.height - paddle.height){
        ball.dy = -ball.dy;
    }
}

function handleBallCollidBrick(){
    brickList.forEach(function(b){
        if(!b.isBroken){
            if(ball.x >= b.x && ball.x <= b.x + bricksConfig.width && 
                ball.y + ball.radius >=b.y && ball.y - ball.radius <= b.y + bricksConfig.height){
                ball.dy = -ball.dy;
                b.isBroken = true;
                userScore += 1;
                
                if(userScore >= maxScore){
                    isGameOver = true;
                    isGameWin = true;
                }
            }
        }
    })
    updateScore();
}


function updateScore(){
    userScore;
};
function updateBallPosition(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function updatePaddlePosition(){
    if(paddle.isMovingLeft){
        paddle.x -= paddle.speed
    }else if(paddle.isMovingRight){
        paddle.x += paddle.speed
    }
    if(paddle.x < 0 ){
        paddle.x = 0}
    else if(paddle.x > canvas.width - paddle.width){
        paddle.x = canvas.width - paddle.width}
}

function checkGameOver(){
    if( ball.y > canvas.height - ball.radius){
        isGameOver = true;
    }
}

function handleGameOver(){
    if(isGameWin){
        alert("YOU WIN!" + '\n' + "YOUR SCORE IS " + userScore)
    }else {
        alert("YOU LOSE!" + '\n' + "YOUR SCORE IS " + userScore)
    }
}

function draw(){
    if(!isGameOver){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    updateBallPosition();
    checkGameOver();
    updatePaddlePosition();
    handleBallCollidBound();
    handBallCollidPaddle();
    handleBallCollidBrick();
    updateScore();
    requestAnimationFrame(draw);
}else {
    handleGameOver();
}
};
draw();