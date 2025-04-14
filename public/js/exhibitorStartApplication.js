export function initStartApplication() {
    const startButton = document.getElementById("start");
    const flippingCard = document.getElementById("flipping-card");
    if (!startButton) {
      console.error("Start Application button not found!");
      return;
    }
    
    startButton.addEventListener("click", () => {
      // For the start application, use the same card element,
      // set its content to the static message, and display it without flipping.
      if (flippingCard) {
        // Set the card's front content:
        const cardFront = flippingCard.querySelector(".flipping-card-front");
        if (cardFront) {
          cardFront.innerHTML = `
            <p>
              Leave your phone's volume up,<br>
              and you will be notified when it's time to take your submissions<br>
              to the judges table.
            </p>
          `;
        }
        
        // Optionally, set the card's back with a static message:
        const cardBack = flippingCard.querySelector(".flipping-card-back");
        if (cardBack) {
          cardBack.innerHTML = `<p>Waiting for notification...</p>`;
        }
        
        // Instead of adding the 'flipped' class, simply display the card.
        flippingCard.style.display = "block";
        // (Do not add flippingCard.classList.add("flipped");)
        
        // Optionally, you may want to remove any flipping class that might be left from a previous action:
        flippingCard.classList.remove("flipped");
      } else {
        // If the flipping card doesn't exist, fallback to a static alert.
        alert("Leave your phone's volume up. Waiting for notification...");
      }
    });
  }
  