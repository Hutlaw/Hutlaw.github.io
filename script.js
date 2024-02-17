let elements = [
    { name: "fire", displayName: "Fire" },
    { name: "water", displayName: "Water" },
    { name: "earth", displayName: "Earth" },
    { name: "air", displayName: "Air" },
    { name: "plant", displayName: "Plant" },
    { name: "metal", displayName: "Metal" },
    { name: "sand", displayName: "Sand" }
];

let combinations = [
    { elements: ["fire", "water"], result: "Steam" },
    { elements: ["fire", "earth"], result: "Lava" },
    { elements: ["fire", "air"], result: "Energy" },
    { elements: ["water", "earth"], result: "Mud" },
    { elements: ["water", "air"], result: "Rain" },
    { elements: ["earth", "air"], result: "Dust" },
    { elements: ["plant", "earth"], result: "Tree" },
    { elements: ["plant", "fire"], result: "Flower" },
    { elements: ["metal", "fire"], result: "Gold" },
    { elements: ["sand", "fire"], result: "Glass" }
];

document.addEventListener("DOMContentLoaded", () => {
    updateElements();
    updateCombinations();
});

function updateElements() {
    let elementsContainer = document.getElementById("elements");
    elementsContainer.innerHTML = "";

    elements.forEach(element => {
        let elementDiv = document.createElement("div");
        elementDiv.classList.add("element");
        elementDiv.setAttribute("data-name", element.name);
        elementDiv.textContent = element.displayName;
        elementDiv.addEventListener("click", () => {
            combine(element.name);
        });
        elementsContainer.appendChild(elementDiv);
    });
}

function updateCombinations() {
    let combinationList = document.getElementById("combination-list");
    combinationList.innerHTML = "";

    combinations.forEach(combination => {
        let listItem = document.createElement("li");
        listItem.textContent = combination.elements.join(" + ") + " = " + combination.result;
        combinationList.appendChild(listItem);
    });
}

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
            updateCombinations();
        }
    }
}
