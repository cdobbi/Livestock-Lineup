export const saveLineup = async (category_id, show_id, breed_ids, apiEndpoint) => {
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id,
          show_id,
          breed_ids,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save lineup: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log("Lineup saved successfully:", result);
      return result; // Return saved results so organizer.js can present a message.
    } catch (error) {
      console.error("Error saving lineup:", error);
      throw error;
    }
};

// Trigger the flipping card animation once the lineups render successfully.
function triggerFlippingCard() {
    const flippingCard = document.getElementById("flipping-card");
    if (!flippingCard) return;
  
    // Add the "flipped" class for the animation
    flippingCard.classList.add("flipped");
  
    // Remove the "flipped" class after 3 seconds
    setTimeout(() => {
      flippingCard.classList.remove("flipped");
    }, 3000);
  }
  