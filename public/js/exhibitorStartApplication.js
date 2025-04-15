// exhibitorStartApplication.js

// Import your submission function (adjust the path as necessary)
import { submitExhibitorLineup } from "./lineupSubmission.js"; 
// For example, lineupSubmission.js contains your runtime code to call the /api/submissions endpoint.

export function initStartApplication() {
  const startButton = document.getElementById("start");
  const flippingCard = document.getElementById("flipping-card");
  
  if (!startButton) {
    console.error("Start Application button not found!");
    return;
  }
  
  startButton.addEventListener("click", async () => {
    // If the flipping card element exists, update its content
    if (flippingCard) {
      const cardInner = flippingCard.querySelector(".flipping-card-inner");
      if (cardInner) {
        // Temporarily disable animation so the card remains static.
        cardInner.style.animation = "none";
      }
      
      // Update the card content
      const cardFront = flippingCard.querySelector(".flipping-card-front");
      if (cardFront) {
        cardFront.innerHTML = `
          <p>
            Leave your phone's volume up,<br>
            and you will be notified when it's time to take your submissions.<br>
            Waiting for notification...
          </p>
        `;
      }
      
      // Optionally update the card back too
      const cardBack = flippingCard.querySelector(".flipping-card-back");
      if (cardBack) {
        cardBack.innerHTML = `<p>Waiting...</p>`;
      }
      
      // Display the card (without the flip animation)
      flippingCard.style.display = "block";
    } else {
      // Fallback in case the card element doesn't exist
      alert("Leave your phone's volume up. Waiting for notification...");
    }
    
        // --- NEW: Trigger the submission logic ---
    // Replace these hardcoded values with data gathered dynamically as needed.
    const exhibitorId = 1;         // Example: current exhibitor's ID (should be dynamic)
    const showId = 6;              // Example show ID; adjust according to your app logic
    const categoryId = 2;          // Example category ID (for instance, Open)
    const breedIds = [5, 8, 12];     // Example selected breed IDs array

    // Build a payload object with snake_case keys
    const payload = {
    exhibitor_id: exhibitorId,
    show_id: showId,
    category_id: categoryId,
    breed_ids: breedIds,
    };

    try {
    const submissionResponse = await submitExhibitorLineup(payload);
    console.log("Submission response:", submissionResponse);
    
    // Optionally store the submission in localStorage.
    localStorage.setItem("exhibitorSubmission", JSON.stringify(submissionResponse));
    } catch (error) {
    console.error("Error submitting exhibitor lineup:", error);
    }

    
    // --- End submission logic ---
    
    // Hide the card after a few seconds and restore animations
    setTimeout(() => {
      if (flippingCard) {
        flippingCard.style.display = "none";
        const cardInner = flippingCard.querySelector(".flipping-card-inner");
        if (cardInner) {
          // Restore the normal animation
          cardInner.style.animation = "";
        }
      }
    }, 5000);
  });
}
