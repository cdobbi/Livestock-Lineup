// exhibitor_save_lineup.js
export function initSaveLineup() {
    const save_lineup_button = document.getElementById("save-lineup");
    const category_select = document.getElementById("category-select");
    const show_select = document.getElementById("show-select");
    const rabbit_list_container = document.getElementById("rabbit-list");
    const flipping_card = document.getElementById("flipping-card");
    // Try to obtain exhibitor_id from a hidden element; adjust as needed.
    const exhibitor_id_element = document.getElementById("exhibitor-id");
  
    if (!save_lineup_button) {
      console.error("Save Lineup button not found!");
      return;
    }
  
    save_lineup_button.addEventListener("click", async () => {
      const category_id = category_select.value;
      const show_id = show_select.value;
  
      // Collect selected breeds from buttons with the "active" class.
      const selected_breeds = [];
      const selected_buttons = rabbit_list_container.querySelectorAll(".breed-button.active");
      selected_buttons.forEach((button) => {
        // Each button must have a "data-breed" attribute.
        selected_breeds.push(button.dataset.breed);
      });
  
      if (!category_id || !show_id) {
        alert("Please select both a category and a show.");
        return;
      }
      if (selected_breeds.length === 0) {
        alert("Please select at least one breed to start the application.");
        return;
      }
  
      // Get exhibitor_id value; if not available, default to "1" (update this as needed for your app)
      const exhibitor_id = exhibitor_id_element ? exhibitor_id_element.value : "1";
  
      // Build payload using snake_case keys
      // The payload is now: { exhibitor_id, show_id, category_id, breed_ids }
      const submission = {
        exhibitor_id: exhibitorId, // Get this from the form or user session
        show_id: relatedShow,      // Derived from the breeds table
        category_id: category,     // Derived from the breeds table
        breed_ids: selectedBreeds  // Array of selected breed IDs
    };
    
    // Send the submission to the backend
    fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Submission saved:", data);
        })
        .catch((error) => {
            console.error("Error saving submission:", error);
        });
  
      try {
        const response = await fetch("https://livestock-lineup.onrender.com/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        });
  
        // Read the response body once.
        const response_data = await response.json();
        console.log("Response from save:", response_data);
  
        if (!response.ok) {
          // If the server returns a 400 error, show the full response details.
          console.error("Failed to save lineup:", response_data);
          alert("Failed to save lineup: " + JSON.stringify(response_data));
          return;
        }
  
        // On successful save, show the flipping card animation.
        flipping_card.style.display = "block";
        flipping_card.classList.add("flipped");
  
        setTimeout(() => {
          flipping_card.classList.remove("flipped");
          flipping_card.style.display = "none";
          alert(
            `Category: ${category_select.options[category_select.selectedIndex].text}\n` +
            `Show: ${show_select.options[show_select.selectedIndex].text}\n` +
            `Breeds: ${selected_breeds.join(", ")}\n\nSubmission saved successfully! Save another or click on 'Start Application'.`
          );
        }, 2000);
      } catch (error) {
        console.error("Error saving lineup:", error);
        alert("An error occurred while saving your lineup.");
      }
    });
  }
  