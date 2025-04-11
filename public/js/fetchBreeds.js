// Does this file need to go into the uiHandlers.bundle.js file? Also which html file does it belong in if any? If it doesn't belong in an HTML or any of the other files, how is it initialized, called or used? What is it's purpose? Please, Verify, ensure that require and module.exports are used and teir are no weird notations. Please ensure that all variables, functions, and wording are consistent accrossed files and that everything links properly.


const fetchAndRenderBreeds = async (apiEndpoint, rabbitList) => {
    try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
            throw new Error("Failed to fetch rabbit breeds.");
        }
        const breeds = await response.json();
        rabbitList.innerHTML = ""; // Clear existing content

        breeds.forEach((breed) => {
            const button = document.createElement("button");
            button.className = "btn btn-outline-secondary btn-sm mx-1 my-1 breed-button";
            button.dataset.breed = breed.name;
            button.textContent = breed.name;

            button.addEventListener("click", function () {
                this.classList.toggle("active");
                console.log(
                    `Breed ${this.dataset.breed} is now ${this.classList.contains("active") ? "selected" : "deselected"}.`
                );
            });
            rabbitList.appendChild(button);
        });
    } catch (error) {
        console.error("Error fetching rabbit breeds:", error);
        rabbitList.innerHTML = "<div class='text-danger'>Failed to load rabbit breeds.</div>";
    }
};

// Export the function for use in other files
module.exports = {
    fetchAndRenderBreeds,
};