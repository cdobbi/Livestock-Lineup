// exhibitorSaveLineup.js
export function initSaveLineup() {
    const saveLineupButton = document.getElementById("save-lineup");
    const categorySelect = document.getElementById("category-select");
    const showSelect = document.getElementById("show-select");
    const rabbitListContainer = document.getElementById("rabbit-list");
    const flippingCard = document.getElementById("flipping-card");
  
    if (!saveLineupButton) {
      console.error("Save Lineup button not found!");
      return;
    }
  
    saveLineupButton.addEventListener("click", async () => {
      const categoryId = categorySelect.value;
      const showId = showSelect.value;
  
      // Collect selected breeds from buttons that have the active class.
      const selectedBreeds = [];
      const selectedButtons = rabbitListContainer.querySelectorAll(".breed-button.active");
      selectedButtons.forEach((button) => {
        // Each button should have a data-breed attribute.
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
  
      // Build payload with camelCase keys as expected by your API.
      const submission = {
        categoryId: categoryId,
        showId: showId,
        breedIds: selectedBreeds,
      };
  
      console.log("Sending payload:", submission);
  
      try {
        const response = await fetch("https://livestock-lineup.onrender.com/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        });
  
        if (response.ok) {
          // Show flipping card animation on success.
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
        } else {
          const errorData = await response.json();
          console.error("Failed to save lineup:", errorData);
          alert("Failed to save lineup: " + errorData.message);
        }
      } catch (error) {
        console.error("Error saving lineup:", error);
        alert("An error occurred while saving your lineup.");
      }
    });
  }
  