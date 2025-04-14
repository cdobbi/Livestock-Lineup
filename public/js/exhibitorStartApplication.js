export function initStartApplication() {
    const startButton = document.getElementById("start");
    const flippingCard = document.getElementById("flipping-card");
    if (!startButton) {
      console.error("Start Application button not found!");
      return;
    }
    
    startButton.addEventListener("click", () => {
      if (flippingCard) {
        // Get inner container so we can override the CSS animation
        const cardInner = flippingCard.querySelector(".flipping-card-inner");
        if (cardInner) {
          // Temporarily disable animation so the card remains static.
          cardInner.style.animation = "none";
        }
        
        // Set the card content to a static message.
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
        
        // Display the card (without the flip animation).
        flippingCard.style.display = "block";
        
        // After a few seconds, hide the card and restore the animation (for the save action later).
        setTimeout(() => {
          flippingCard.style.display = "none";
          if (cardInner) {
            // Clear the inline override so that the Save button can use its flipping animation.
            cardInner.style.animation = "";
          }
        }, 5000); // Display for 5 seconds; adjust timing as desired.
        
      } else {
        // Fallback in case the card element doesn't exist
        alert("Leave your phone's volume up. Waiting for notification...");
      }
    });
  }
  