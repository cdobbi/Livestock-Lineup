// exhibitorSaveLineup.js
export function initSaveLineup() {
    const saveLineupButton = document.getElementById("save-lineup");
    const categorySelect = document.getElementById("category-select");
    const showSelect = document.getElementById("show-select");
    const rabbitListContainer = document.getElementById("rabbit-list");
    const flippingCard = document.getElementById("flipping-card");
    // Attempt to get exhibitor_id from a hidden element; adjust as needed.
    const exhibitorIdElement = document.getElementById("exhibitor-id");
  
    if (!saveLineupButton) {
      console.error("Save Lineup button not found!");
      return;
    }
  
    saveLineupButton.addEventListener("click", async () => {
      const categoryId = categorySelect.value;
      const showId = showSelect.value;
  
      // Collect selected breeds from buttons with the "active" class:
      const selectedBreeds = [];
      const selectedButtons = rabbitListContainer.querySelectorAll(".breed-button.active");
      selectedButtons.forEach((button) => {
        // Each button must have a "data-breed" attribute.
        selectedBreeds.push(button.dataset.breed);
      });
  
      if (!categoryId || !showId) {
        alert("Please select both a category and a show.");
        return;
      }
      if (selectedBreeds.length === 0) {
        alert("Please select at least one breed to start the application.");
        return;
      }
  
      // Get exhibitor_id value; if not available, adjust accordingly.
      const exhibitor_id = exhibitorIdElement ? exhibitorIdElement.value : "1"; // Replace "1" with a real value if possible
  
      // Build payload with the keys the server expects:
      // The server validations expect: exhibitor_id, showId, categoryId, breedIds
      const submission = {
        exhibitor_id,       // now included!
        showId: showId,
        categoryId: categoryId,
        breedIds: selectedBreeds,
      };
  
      console.log("Sending payload:", submission);
  
      try {
        const response = await fetch("https://livestock-lineup.onrender.com/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        });
  
        // Read the response body only once.
        const responseData = await response.json();
        console.log("Response from save:", responseData);
  
        if (!response.ok) {
          // If the server returns a 400 error, it will likely include details about the missing or invalid field(s)
          console.error("Failed to save lineup:", responseData);
          alert("Failed to save lineup: " + (responseData.message || "Validation error"));
          return;
        }
  
        // On success, show the flipping card animation:
        flippingCard.style.display = "block";
        flippingCard.classList.add("flipped");
  
        setTimeout(() => {
          flippingCard.classList.remove("flipped");
          flippingCard.style.display = "none";
          alert(
            `Category: ${categorySelect.options[categorySelect.selectedIndex].text}\n` +
            `Show: ${showSelect.options[showSelect.selectedIndex].text}\n` +
            `Breeds: ${selectedBreeds.join(", ")}\n\nSubmission saved successfully! Save another or click on 'Start Application'.`
          );
        }, 2000);
      } catch (error) {
        console.error("Error saving lineup:", error);
        alert("An error occurred while saving your lineup.");
      }
    });
  }
  