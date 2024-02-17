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
