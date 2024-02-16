const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let draggedElement = null;

// Default elements
const elements = ['Earth', 'Air', 'Water', 'Fire'];
const elementWidth = 100;
const elementHeight = 50;
const elementSpacing = 20;

function drawElements() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elements.forEach((element, index) => {
        const x = 10;
        const y = 10 + index * (elementHeight + elementSpacing);
        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, elementWidth, elementHeight);
        ctx.fillStyle = 'white';
        ctx.fillText(element, x + 10, y + 30);
    });
}

drawElements();

// Event listeners for dragging elements
document.querySelectorAll('.element').forEach(element => {
    element.addEventListener('dragstart', (event) => {
        draggedElement = event.target;
    });
});

canvas.addEventListener('dragover', (event) => {
    event.preventDefault();
});

canvas.addEventListener('drop', (event) => {
    event.preventDefault();
    if (draggedElement) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        // Check if dropping on the right side
        if (x > elementWidth) {
            // Draw the dropped element on the canvas
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText(draggedElement.textContent, x, y);
            // Reset dragged element
            draggedElement = null;
        }
    }
});
