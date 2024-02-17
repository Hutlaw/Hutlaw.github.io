const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let draggedElement = null;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;

// Event listeners for mousedown on elements
document.querySelectorAll('.element').forEach(element => {
    element.addEventListener('mousedown', (event) => {
        draggedElement = element;
        isDragging = true;
        const rect = canvas.getBoundingClientRect();
        offsetX = event.clientX - rect.left - parseInt(window.getComputedStyle(element).left);
        offsetY = event.clientY - rect.top - parseInt(window.getComputedStyle(element).top);
    });
});

// Event listener for mousemove on canvas
canvas.addEventListener('mousemove', (event) => {
    if (isDragging && draggedElement) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - offsetX;
        const y = event.clientY - rect.top - offsetY;
        draggedElement.style.left = x + 'px';
        draggedElement.style.top = y + 'px';
    }
});

// Event listener for mouseup on canvas
canvas.addEventListener('mouseup', (event) => {
    if (isDragging && draggedElement) {
        isDragging = false;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const newElement = document.createElement('div');
        newElement.textContent = draggedElement.textContent;
        newElement.className = 'element';
        newElement.style.position = 'absolute';
        newElement.style.left = x + 'px';
        newElement.style.top = y + 'px';
        document.body.appendChild(newElement);
    }
    draggedElement = null;
});
