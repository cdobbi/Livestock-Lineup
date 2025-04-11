// Does this file need to go into the uiHandlers.bundle.js file? Also which html file does it belong in if any? If it doesn't belong in an HTML or any of the other files, how is it initialized, called or used? What is it's purpose? Please, verify, ensure that this file is updated to use ES Modals and dont use the weird notations. ensure that all variables, functions, and wording are consistent across files and that everything links properly.

export const fetchBreeds = async (apiUrl, rabbitListElement) => {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch rabbit breeds.");
        }

        const breeds = await response.json();
        rabbitListElement.innerHTML = ""; // Clear existing content

        breeds.forEach((breed) => {
            const button = document.createElement("button");
            button.className = "btn btn-outline-secondary btn-sm mx-1 my-1 breed-button";
            button.dataset.breed = breed.name;
            button.textContent = breed.name;

            button.addEventListener("click", function () {
                this.classList.toggle("active");
                console.log(`Breed ${this.dataset.breed} is now ${this.classList.contains("active") ? "selected" : "deselected"}.`);
            });

            rabbitListElement.appendChild(button);
        });
    } catch (error) {
        console.error("Error fetching rabbit breeds:", error);
        rabbitListElement.innerHTML = "<div class='text-danger'>Failed to load rabbit breeds.</div>";
    }
};

export const saveLineup = async (category, show, breeds, apiUrl, organizerId) => {
    if (!category || !show || breeds.length === 0) {
        alert("Please select a category, show, and at least one breed.");
        return;
    }

    try {
        const lineup = { category, show, breeds };
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ organizerId, lineups: [lineup] }),
        });

        if (response.ok) {
            alert("Lineup saved successfully!");
        } else {
            console.error("Failed to save lineup:", response.statusText);
            alert("Failed to save lineup. Please try again.");
        }
    } catch (error) {
        console.error("Error saving lineup:", error);
        alert("An error occurred while saving the lineup.");
    }
};