// fetchBreeds.js
export async function fetchAndRenderBreeds(apiUrl, containerElement) {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const breeds = await response.json();
      console.log("Breeds fetched:", breeds); // Debug: log the breed array
  
      // Clear the container
      containerElement.innerHTML = "";
  
      // For each breed, create a button element.
      breeds.forEach((breed) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "breed-button btn btn-outline-secondary m-2";
  
        // Use breed's name; adjust property names if necessary
        btn.textContent = breed.breed_name || breed.name || "Unknown Breed";
  
        // Use the correct breed identifier from the API (check both snake_case and camelCase)
        btn.dataset.breed = breed.breed_id || breed.id;
  
        // Toggle active state on click.
        btn.addEventListener("click", function () {
          btn.classList.toggle("active");
          console.log(`Breed ${btn.textContent} is now ${btn.classList.contains("active") ? 'selected' : 'deselected'}.`);
        });
  
        containerElement.appendChild(btn);
      });
    } catch (error) {
      console.error("Error fetching rabbit breeds:", error);
    }
  }
  