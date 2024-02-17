const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let draggedElement = null;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;

// Event listener for mousedown on elements
document.querySelectorAll('.element').forEach(element => {
    element.addEventListener('mousedown', (event) => {
        draggedElement = element;
        isDragging = true;
        offsetX = event.offsetX;
        offsetY = event.offsetY;
    });
});

// Event listener for mousemove on canvas
canvas.addEventListener('mousemove', (event) => {
    if (isDragging && draggedElement) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - offsetX;
        const y = event.clientY - rect.top - offsetY;
        drawElement(draggedElement.textContent, x, y);
    }
});

// Event listener for mouseup on canvas
canvas.addEventListener('mouseup', (event) => {
    if (isDragging && draggedElement) {
        isDragging = false;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - offsetX;
        const y = event.clientY - rect.top - offsetY;
        drawElement(draggedElement.textContent, x, y);
    }
    draggedElement = null;
});

// Function to draw the element on the canvas
function drawElement(text, x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(text, x, y);
}
