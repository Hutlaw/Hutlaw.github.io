const bird = document.getElementById('bird');
const gameOverText = document.getElementById('game-over-text');
const gameContainer = document.querySelector('.game-container');
let gravity = 0.8;
let velocity = 0;
let lift = -12;
let isGameOver = false;
let pipeInterval;
let pipes = [];

function flap() {
    if (!isGameOver) {
        velocity += lift;
    }
}

function createPipe() {
    const pipeHeight = Math.random() * 200 + 100;
    const pipeTop = document.createElement('div');
    pipeTop.className = 'pipe pipe-top';
    pipeTop.style.height = pipeHeight + 'px';
    gameContainer.appendChild(pipeTop);

    const pipeBottom = document.createElement('div');
    pipeBottom.className = 'pipe pipe-bottom';
    pipeBottom.style.height = (gameContainer.clientHeight - pipeHeight - 100) + 'px'; 
    gameContainer.appendChild(pipeBottom);

    pipes.push({ top: pipeTop, bottom: pipeBottom });
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.top.style.left = parseInt(pipe.top.style.left) - 2 + 'px';
        pipe.bottom.style.left = parseInt(pipe.bottom.style.left) - 2 + 'px';

        if (parseInt(pipe.top.style.left) < -pipe.top.clientWidth) {
            gameContainer.removeChild(pipe.top);
            gameContainer.removeChild(pipe.bottom);
        }

        // Check for collision with pipes
        const birdRect = bird.getBoundingClientRect();
        const topRect = pipe.top.getBoundingClientRect();
        const bottomRect = pipe.bottom.getBoundingClientRect();
        if (
            birdRect.right > topRect.left && birdRect.left < topRect.right &&
            (birdRect.top < topRect.bottom || birdRect.bottom > bottomRect.top)
        ) {
            gameOver();
        }
    });

    pipes = pipes.filter(pipe => parseInt(pipe.top.style.left) > -pipe.top.clientWidth);
}

function gameOver() {
    isGameOver = true;
    clearInterval(pipeInterval);
    gameOverText.style.display = 'block';
}

pipeInterval = setInterval(() => {
    createPipe();
}, 2000);

function update() {
    if (!isGameOver) {
        velocity += gravity;
        bird.style.bottom = Math.max(0, parseInt(bird.style.bottom) + velocity) + 'px';
        updatePipes();
    }

    requestAnimationFrame(update);
}

document.addEventListener('click', flap);
document.addEventListener('touchstart', flap);
update();
