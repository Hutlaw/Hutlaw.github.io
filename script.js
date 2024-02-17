let elements = [];

function combine() {
    let input = document.getElementById("input").value.trim().toLowerCase();
    if (input === "") return;

    let newElement = { name: input, created: false };
    elements.push(newElement);

    updateElements();
    document.getElementById("input").value = "";
}

function updateElements() {
    let elementsList = document.getElementById("elements");
    elementsList.innerHTML = "";
    
    elements.forEach(element => {
        let listItem = document.createElement("li");
        listItem.textContent = element.name;
        elementsList.appendChild(listItem);
    });
}
