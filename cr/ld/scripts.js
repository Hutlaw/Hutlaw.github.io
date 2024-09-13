document.addEventListener('DOMContentLoaded', () => {
    const editableCells = document.querySelectorAll('td[contenteditable="true"]');

    editableCells.forEach(cell => {
        cell.addEventListener('focus', () => {
            cell.style.backgroundColor = '#777'; 
        });

        cell.addEventListener('blur', () => {
            cell.style.backgroundColor = '';
        });
    });
});
