export function initStartApplication() {
    const startButton = document.getElementById("start");
    const flippingCard = document.getElementById("flipping-card");
    if (!startButton) {
      console.error("Start Application button not found!");
      return;
    }
    
    startButton.addEventListener("click", () => {
      // This is the current code that triggers the flipping card:
      const cardFront = flippingCard.querySelector(".flipping-card-front");
      const cardBack = flippingCard.querySelector(".flipping-card-back");
      
      if (cardFront) {
        cardFront.innerHTML = `
          <p>
            Leave your phone's volume up,<br>
            and you will be notified when it's time to take your submissions<br>
            to the judges table.
          </p>
        `;
      }
      if (cardBack) {
        cardBack.innerHTML = `<p>Waiting for notification...</p>`;
      }
      
      flippingCard.style.display = "block";
      flippingCard.classList.add("flipped");
      
      setTimeout(() => {
        flippingCard.classList.remove("flipped");
        // Optionally, to hide the card after a delay:
        // flippingCard.style.display = "none";
      }, 5000);
    });
  }
  