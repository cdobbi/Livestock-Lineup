document.addEventListener("DOMContentLoaded", async () => {
    // Initialize Pusher for notifications
    const pusherInstance = await initializePusher();
    if (!pusherInstance) {
      console.error("Failed to initialize Pusher. Notifications will not work.");
    }
  
    const rabbitListContainer = document.getElementById("rabbit-list");
    const saveLineupButton = document.getElementById("save-lineup");
    const categorySelect = document.getElementById("category-select");
    const showSelect = document.getElementById("show-select");
    const flippingCard = document.getElementById("flipping-card");
  
    // Handle Save Lineup button click
    saveLineupButton.addEventListener("click", async () => {
      const categoryId = categorySelect.value;
      const showId = showSelect.value;
    
      // Collect selected breeds from those buttons with the active state
      const selectedBreeds = [];
      const selectedButtons = rabbitListContainer.querySelectorAll(".breed-button.active");
      selectedButtons.forEach((button) => {
        // Ensure your buttons have a data attribute like data-breed="ID"
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
    
      // Use camelCase keys to match the API's expectations
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
          // Show flipping card animation
          flippingCard.style.display = "block";
          flippingCard.classList.add("flipped");
    
          setTimeout(() => {
            flippingCard.classList.remove("flipped");
            flippingCard.style.display = "none";
            alert(
              `Category: ${categorySelect.options[categorySelect.selectedIndex].text}\n` +
              `Show: ${showSelect.options[showSelect.selectedIndex].text}\n` +
              `Breeds: ${selectedBreeds.join(", ")}\n\nSubmission saved! Save another or click on 'Start Application'.`
            );
          }, 4000);
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
    
    // Use Pusher for real-time notifications
    const channel = pusherInstance.channel;
    channel.bind("breed-notification", (data) => {
      const { breed, category, show } = data;
      alert(`Notification for Category: ${category}, Show: ${show}, Breed: ${breed}`);
      try {
        const notificationSound = new Audio("/sounds/alert.mp3");
        notificationSound.play();
      } catch (error) {
        console.error("Error playing notification sound:", error);
      }
    });
  });
  