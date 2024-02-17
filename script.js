const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let draggedElement = null;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;

// Event listener for mousedown on canvas
canvas.addEventListener('mousedown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if the click is inside an element
    document.querySelectorAll('.element').forEach(element => {
        const bounds = element.getBoundingClientRect();
        if (x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom) {
            draggedElement = element;
            isDragging = true;
            offsetX = x - bounds.left;
            offsetY = y - bounds.top;
        }
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
canvas.addEventListener('mouseup', () => {
    isDragging = false;
    draggedElement = null;
});

// Function to draw the element on the canvas
function drawElement(text, x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(text, x, y);
}
