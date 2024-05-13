const bird = document.getElementById('bird');
const gameOverText = document.getElementById('game-over-text');
let gravity = 0.8;
let velocity = 0;
let lift = -12;

function flap() {
    velocity += lift;
}

function update() {
    velocity += gravity;
    bird.style.bottom = parseInt(bird.style.bottom) + velocity + 'px';

    // Game over if bird hits the ground
    if (parseInt(bird.style.bottom) <= 0) {
        bird.style.bottom = '0px';
        velocity = 0;
        gameOverText.style.display = 'block';
    }

    requestAnimationFrame(update);
}

document.addEventListener('click', flap);
update();
