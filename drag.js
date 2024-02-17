let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

// Event listeners for mousedown on elements
document.querySelectorAll('.element').forEach(element => {
    element.addEventListener('mousedown', (event) => {
        draggedElement = event.target;
        const rect = canvas.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
    });
});

// Event listener for mousemove on canvas
canvas.addEventListener('mousemove', (event) => {
    if (draggedElement) {
        event.preventDefault(); // Prevent default to allow dropping
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - offsetX;
        const y = event.clientY - rect.top - offsetY;
        drawElement(draggedElement.textContent, x, y);
    }
});
