let draggedElement = null;
let combinations = [
    { elements: ["fire", "water"], result: "Steam" },
    { elements: ["fire", "earth"], result: "Lava" },
    { elements: ["fire", "air"], result: "Energy" },
    { elements: ["water", "earth"], result: "Mud" },
    { elements: ["water", "air"], result: "Mist" },
    { elements: ["earth", "air"], result: "Dust" }
];

document.querySelectorAll(".element").forEach(element => {
    element.addEventListener("dragstart", dragStart);
    element.addEventListener("dragend", dragEnd);
});

function dragStart(event) {
    draggedElement = event.target.getAttribute("data-name");
}

function dragEnd() {
    draggedElement = null;
}

document.addEventListener("dragover", dragOver);
document.addEventListener("drop", drop);

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    let targetElement = event.target.closest(".element");
    if (!targetElement || targetElement === draggedElement) return;

    let targetElementName = targetElement.getAttribute("data-name");
    let combinedElement = combineElements(draggedElement, targetElementName);
    if (combinedElement) {
        showResult(combinedElement);
    }
}

function combineElements(element1, element2) {
    let combination = combinations.find(combination => {
        return combination.elements.includes(element1) && combination.elements.includes(element2);
    });

    if (combination) {
        return combination.result;
    } else {
        return null;
    }
}

function showResult(result) {
    let resultElement = document.getElementById("result");
    resultElement.textContent = result;
}
