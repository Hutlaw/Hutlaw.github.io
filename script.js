const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let draggedElement = null;

// Default elements
const elements = ['Air', 'Earth', 'Fire', 'Water'];
const elementWidth = 100;
const elementHeight = 50;
const elementSpacing = 20;

function drawElements() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    elements.forEach((element, index) => {
        const x = 10;
        const y = 10 + index * (elementHeight + elementSpacing);
        ctx.fillText(element, x, y + 20);
    });
}

drawElements();

document.querySelectorAll('.element').forEach(element => {
    element.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = rect.width / 2 - elementWidth / 2;
        const y = rect.height / 2 - elementHeight / 2;
        // Draw the clicked element on the canvas
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(element.textContent, x, y);
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

// Prevent right-click context menu
canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});
