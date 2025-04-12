export const fetchAndRenderBreeds = async (apiEndpoint, rabbitList) => {
    try {
        // Fetch the API endpoint
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
            throw new Error("Failed to fetch rabbit breeds.");
        }
        // Parse the JSON response
        const result = await response.json();
        console.log(result); // Inspect the API response structure

        // If the API returns an array directly, use it; otherwise, adjust as needed.
        const breeds = Array.isArray(result) ? result : (result.breeds || []);

        // Clear out any previous content
        rabbitList.innerHTML = "";

        // Loop through each breed from the API response
        breeds.forEach((breed) => {
            // Use breed.breed_name instead of breed.name -- trim in case of extra spaces
            const breedName = breed.breed_name ? breed.breed_name.trim() : "Unnamed";

            const button = document.createElement("button");
            button.className = "btn btn-outline-secondary btn-sm mx-1 my-1 breed-button";
            button.dataset.breed = breedName;
            button.textContent = breedName;

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
