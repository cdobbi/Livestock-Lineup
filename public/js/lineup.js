// Does this file need to go into the uiHandlers.bundle.js file? Also which html file does it belong in if any? If it doesn't belong in an HTML or any of the other files, how is it initialized, called or used? What is it's purpose? Please, verify, ensure that this file is updated to use ES Modals and dont use the weird notations. ensure that all variables, functions, and wording are consistent across files and that everything links properly.


export function displayLineups(lineupContainer, showLineups) {
    console.log("Clearing lineup container...");
    lineupContainer.innerHTML = "";

    Object.keys(showLineups).forEach((category) => {
        Object.keys(showLineups[category]).forEach((show) => {
            const lineup = showLineups[category][show];
            const showDiv = document.createElement("div");
            showDiv.classList.add("lineup", "mb-4", "p-3", "border", "rounded");

            const showTitle = document.createElement("h3");
            showTitle.textContent = `Category: ${category} - Show: ${show}`;
            showTitle.classList.add("text-primary");
            showDiv.appendChild(showTitle);

            const breedList = document.createElement("ul");
            breedList.classList.add("list-group");

            lineup.breeds.forEach((breed) => {
                const breedItem = document.createElement("li");
                breedItem.classList.add("list-group-item");

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = `checkbox-${breed}`;
                checkbox.classList.add("breed-checkbox");

                const label = document.createElement("label");
                label.htmlFor = `checkbox-${breed}`;
                label.textContent = breed;

                breedItem.appendChild(checkbox);
                breedItem.appendChild(label);
                breedList.appendChild(breedItem);
            });

            showDiv.appendChild(breedList);
            lineupContainer.appendChild(showDiv);
        });
    });
}