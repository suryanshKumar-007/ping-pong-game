// Game Variables
const gameContainer = document.getElementById('gameContainer');
const playerPaddle = document.getElementById('playerPaddle');
const computerPaddle = document.getElementById('computerPaddle');
const ball = document.getElementById('ball');
const playerScoreDisplay = document.getElementById('playerScore');
const computerScoreDisplay = document.getElementById('computerScore');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

// Game State
let gameRunning = false;
let playerScore = 0;
let computerScore = 0;

// Paddle properties
const paddleHeight = 100;
const paddleWidth = 10;
let playerY = gameContainer.clientHeight / 2 - paddleHeight / 2;
let computerY = gameContainer.clientHeight / 2 - paddleHeight / 2;
const paddleSpeed = 6;

// Ball properties
let ballX = gameContainer.clientWidth / 2;
let ballY = gameContainer.clientHeight / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
const ballRadius = 6;
const ballMaxSpeed = 8;

// Mouse tracking
let mouseY = gameContainer.clientHeight / 2;

// Keyboard tracking
const keys = {};

// Get container dimensions
const containerRect = gameContainer.getBoundingClientRect();

// Event Listeners
document.addEventListener('mousemove', (e) => {
    mouseY = e.clientY - containerRect.top;
});

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetScore);

// Start Game
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        startBtn.textContent = 'PAUSE';
        gameLoop();
    } else {
        gameRunning = false;
        startBtn.textContent = 'RESUME';
    }
}

// Reset Score
function resetScore() {
    playerScore = 0;
    computerScore = 0;
    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = computerScore;
    resetBall();
}

// Main Game Loop
function gameLoop() {
    if (gameRunning) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// Update Game State
function update() {
    // Update player paddle (mouse and arrow keys)
    if (mouseY - paddleHeight / 2 > 0 && mouseY - paddleHeight / 2 < gameContainer.clientHeight - paddleHeight) {
        playerY = mouseY - paddleHeight / 2;
    }

    // Arrow keys control
    if (keys['ArrowUp'] && playerY > 0) {
        playerY -= paddleSpeed;
    }
    if (keys['ArrowDown'] && playerY < gameContainer.clientHeight - paddleHeight) {
        playerY += paddleSpeed;
    }

    // Update computer paddle (AI)
    const computerCenter = computerY + paddleHeight / 2;
    const ballCenter = ballY;

    if (computerCenter < ballCenter - 35) {
        if (computerY < gameContainer.clientHeight - paddleHeight) {
            computerY += paddleSpeed * 0.8;
        }
    } else if (computerCenter > ballCenter + 35) {
        if (computerY > 0) {
            computerY -= paddleSpeed * 0.8;
        }
    }

    // Update ball position
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls
    if (ballY - ballRadius <= 0 || ballY + ballRadius >= gameContainer.clientHeight) {
        ballSpeedY = -ballSpeedY;
        ballY = Math.max(ballRadius, Math.min(gameContainer.clientHeight - ballRadius, ballY));
    }

    // Ball collision with paddles
    // Player paddle collision
    if (
        ballX - ballRadius <= paddleWidth + 15 &&
        ballY >= playerY &&
        ballY <= playerY + paddleHeight &&
        ballSpeedX < 0
    ) {
        ballSpeedX = -ballSpeedX;
        ballX = paddleWidth + 15 + ballRadius;

        // Add spin based on where ball hits paddle
        const hitPos = (ballY - (playerY + paddleHeight / 2)) / (paddleHeight / 2);
        ballSpeedY += hitPos * 3;

        // Limit ball speed
        if (Math.abs(ballSpeedY) > ballMaxSpeed) {
            ballSpeedY = (ballSpeedY / Math.abs(ballSpeedY)) * ballMaxSpeed;
        }
    }

    // Computer paddle collision
    if (
        ballX + ballRadius >= gameContainer.clientWidth - paddleWidth - 15 &&
        ballY >= computerY &&
        ballY <= computerY + paddleHeight &&
        ballSpeedX > 0
    ) {
        ballSpeedX = -ballSpeedX;
        ballX = gameContainer.clientWidth - paddleWidth - 15 - ballRadius;

        // Add spin based on where ball hits paddle
        const hitPos = (ballY - (computerY + paddleHeight / 2)) / (paddleHeight / 2);
        ballSpeedY += hitPos * 3;

        // Limit ball speed
        if (Math.abs(ballSpeedY) > ballMaxSpeed) {
            ballSpeedY = (ballSpeedY / Math.abs(ballSpeedY)) * ballMaxSpeed;
        }
    }

    // Ball out of bounds (scoring)
    if (ballX - ballRadius <= 0) {
        computerScore++;
        computerScoreDisplay.textContent = computerScore;
        resetBall();
    } else if (ballX + ballRadius >= gameContainer.clientWidth) {
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
        resetBall();
    }
}

// Reset Ball Position
function resetBall() {
    ballX = gameContainer.clientWidth / 2;
    ballY = gameContainer.clientHeight / 2;

    // Random initial direction
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 5;
    ballSpeedY = (Math.random() - 0.5) * 5;
}

// Draw Game Elements
function draw() {
    // Update player paddle position
    playerPaddle.style.top = playerY + 'px';

    // Update computer paddle position
    computerPaddle.style.top = computerY + 'px';

    // Update ball position
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}

// Initialize game
resetBall();
