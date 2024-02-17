// Event listener for dragover on canvas
canvas.addEventListener('dragover', (event) => {
    event.preventDefault(); // Allow dropping
});

// Event listener for drop on canvas
canvas.addEventListener('drop', (event) => {
    event.preventDefault();
    if (draggedElement) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - offsetX;
        const y = event.clientY - rect.top - offsetY;
        drawElement(draggedElement.textContent, x, y);
        draggedElement = null;
    }
});
