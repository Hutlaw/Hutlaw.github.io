const bird = document.getElementById('bird');
const gameContainer = document.querySelector('.game-container');
const gameOverText = document.getElementById('game-over-text');
let gravity = 0.6;
let velocity = 0;
let lift = -10;
let isGameOver = false;
let gameLoop;

function flap() {
    if (!isGameOver) {
        velocity += lift;
    }
}

function update() {
    if (!isGameOver) {
        velocity += gravity;
        bird.style.bottom = Math.max(0, parseInt(bird.style.bottom) + velocity) + 'px';

        // Check for collision with ground
        if (parseInt(bird.style.bottom) <= 0 || parseInt(bird.style.bottom) >= gameContainer.clientHeight - bird.clientHeight) {
            gameOver();
        }
    }

    gameLoop = requestAnimationFrame(update);
}

function gameOver() {
    isGameOver = true;
    cancelAnimationFrame(gameLoop);
    gameOverText.style.display = 'block';
}

document.addEventListener('click', flap);
document.addEventListener('touchstart', flap); 
update();
