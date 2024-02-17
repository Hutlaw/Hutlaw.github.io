// Event listener for dragover on canvas
canvas.addEventListener('dragover', (event) => {
    event.preventDefault(); // Allow dropping
});

// Event listener for drop on canvas
canvas.addEventListener('drop', (event) => {
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const text = event.dataTransfer.getData('text/plain');
    drawElement(text, x, y);
});

// Function to draw the element on the canvas
function drawElement(text, x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(text, x, y);
}
