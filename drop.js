// Event listener for mousemove on canvas
canvas.addEventListener('mousemove', (event) => {
    if (draggedElement) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - offsetX;
        const y = event.clientY - rect.top - offsetY;
        drawElement(draggedElement.textContent, x, y);
    }
});

// Event listener for mouseup on canvas
canvas.addEventListener('mouseup', () => {
    draggedElement = null;
});
