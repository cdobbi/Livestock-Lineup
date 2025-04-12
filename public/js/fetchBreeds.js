export const fetchAndRenderBreeds = async (apiEndpoint, rabbitList) => {
    try {
        // Fetch the breeds API endpoint
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
            throw new Error("Failed to fetch rabbit breeds.");
        }
        // Parse the JSON response
        const breeds = await response.json();
        
        // Log the API response to inspect its structure
        console.log(breeds);
        
        // Clear any existing content
        rabbitList.innerHTML = "";

        // Loop through each breed and create a button
        breeds.forEach((breed) => {
            // Use a fallback name if breed.name is missing
            const breedName = breed.name || "breeds";
            
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
