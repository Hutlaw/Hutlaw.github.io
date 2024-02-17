// Event listeners for mousedown on elements
document.querySelectorAll('.element').forEach(element => {
    element.addEventListener('mousedown', (event) => {
        event.dataTransfer.setData('text/plain', element.textContent);
    });
});
