let elements = [
    { name: "fire", displayName: "Fire" },
    { name: "water", displayName: "Water" },
    { name: "earth", displayName: "Earth" },
    { name: "air", displayName: "Air" }
];

let combinations = [
    { elements: ["fire", "water"], result: "Steam" },
    { elements: ["fire", "earth"], result: "Lava" },
    { elements: ["fire", "air"], result: "Energy" },
    { elements: ["water", "earth"], result: "Mud" },
    { elements: ["water", "air"], result: "Mist" },
    { elements: ["earth", "air"], result: "Dust" }
];

document.querySelectorAll(".element").forEach(element => {
    element.addEventListener("click", () => {
        let selectedElement = element.getAttribute("data-name");
        combine(selectedElement);
    });
});

function combine(selectedElement) {
    let combination = combinations.find(combination => {
        return combination.elements.includes(selectedElement);
    });

    if (combination) {
        let resultElement = elements.find(element => {
            return element.name === combination.result.toLowerCase();
        });

        if (resultElement && !elements.includes(resultElement)) {
            elements.push(resultElement);
            updateElements();
        }
    }
}

function updateElements() {
    let elementsContainer = document.getElementById("elements");
    elementsContainer.innerHTML = "";

    elements.forEach(element => {
        let elementDiv = document.createElement("div");
        elementDiv.classList.add("element");
        elementDiv.setAttribute("data-name", element.name);
        elementDiv.textContent = element.displayName;
        elementsContainer.appendChild(elementDiv);
    });
}
