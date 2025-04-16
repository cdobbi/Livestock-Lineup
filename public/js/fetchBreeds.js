// fetchBreeds.js
export async function fetchAndRenderBreeds(apiUrl, containerElement) {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const breeds = await response.json();
      console.log("Breeds fetched:", breeds); 
  
      containerElement.innerHTML = "";
  
      breeds.forEach((breed) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "breed-button btn btn-outline-secondary m-2";
  
        btn.textContent = breed.breed_name || breed.name || "Unknown Breed";
  
        btn.dataset.breed = breed.breed_id || breed.id || "";
  
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
  
  