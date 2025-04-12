// fetchBreeds.js
export async function fetchAndRenderBreeds(apiUrl, containerElement) {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const breeds = await response.json();
      console.log("Breeds fetched:", breeds); // Debug: log the breed array
  
      // Clear container
      containerElement.innerHTML = "";
  
      // For each breed, create a button element
      breeds.forEach((breed) => {
        // Create a button element for each breed
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "breed-button btn btn-outline-secondary m-2";
        
        // Use the breed’s name; adjust property name if necessary (e.g., breed_name or name)
        btn.textContent = breed.breed_name || breed.name || "Unknown Breed";
        
        // Set a data attribute with the breed's ID
        btn.dataset.breed = breed.id;
        
        // Add a click listener to toggle the active state
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
  