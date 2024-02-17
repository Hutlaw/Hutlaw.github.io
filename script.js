const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Function to draw the element on the canvas
function drawElement(text, x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(text, x, y);
}
