const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let draggedElement = null;

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
        // Draw the dropped element on the canvas
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(draggedElement.textContent, x, y);
        // Reset dragged element
        draggedElement = null;
    }
});
