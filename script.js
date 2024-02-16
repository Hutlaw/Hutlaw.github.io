const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let draggedElement = null;

// Default elements
const elements = ['Earth', 'Air', 'Water', 'Fire'];
const elementSpacing = 20;

function drawElements() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    elements.forEach((element, index) => {
        const textWidth = ctx.measureText(element).width;
        const x = 10;
        const y = 10 + index * (20 + elementSpacing);
        const width = textWidth + 20; // Add some padding
        const height = 20 + 20; // Add some padding
        // Draw the box outline
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.stroke();
        // Draw the text
        ctx.fillText(element, x + 10, y + 20);
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
        if (x > 120) { // Adjust this value based on the size of your elements
            // Draw the dropped element on the canvas
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText(draggedElement.textContent, x, y);
            // Reset dragged element
            draggedElement = null;
        }
    }
});
