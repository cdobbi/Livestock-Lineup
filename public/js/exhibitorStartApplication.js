// exhibitorStartApplication.js
export function initStartApplication() {
    const startButton = document.getElementById("start");
    const flippingCard = document.getElementById("flipping-card");
  
    if (!startButton) {
      console.error("Start Application button not found!");
      return;
    }
    
    startButton.addEventListener("click", () => {
      // Replace the simple alert with an animated card message.
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
      
      // Display the card and add a flipping animation.
      flippingCard.style.display = "block";
      flippingCard.classList.add("flipped");
      
      // Optionally hide the card after a delay.
      setTimeout(() => {
        flippingCard.classList.remove("flipped");
        // Optionally, you could hide it:
        // flippingCard.style.display = "none";
      }, 5000);
    });
  }
  