import { submitExhibitorLineup } from "./lineupSubmission.js";

export function initStartApplication() {
  const startButton = document.getElementById("start");
  const flippingCard = document.getElementById("flipping-card");

  if (!startButton) {
    console.error("Start Application button not found!");
    return;
  }

  startButton.addEventListener("click", async () => {
    // Update the flipping card content
    if (flippingCard) {
      const cardInner = flippingCard.querySelector(".flipping-card-inner");
      if (cardInner) {
        cardInner.style.animation = "none";
      }
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
      const cardBack = flippingCard.querySelector(".flipping-card-back");
      if (cardBack) {
        cardBack.innerHTML = `<p>Waiting...</p>`;
      }
      flippingCard.style.display = "block";
    } else {
      alert("Leave your phone's volume up. Waiting for notification...");
    }

    // Gather dynamic data for the submission
    const exhibitor_id = document.getElementById("exhibitor-id").value; // Example: hidden input field
    const show_id = document.getElementById("show-select").value;
    const category_id = document.getElementById("category-select").value;
    const breed_ids = Array.from(document.querySelectorAll(".breed-button.active"))
      .map((button) => button.dataset.breed);

    if (!exhibitor_id || !show_id || !category_id || breed_ids.length === 0) {
      alert("Please ensure all fields are filled and at least one breed is selected.");
      return;
    }

    const payload = {
      exhibitor_id,
      show_id,
      category_id,
      breed_ids,
    };

    try {
      const submissionResponse = await submitExhibitorLineup(payload);
      console.log("Submission response:", submissionResponse);

      // Optionally store the submission in localStorage.
      localStorage.setItem("exhibitorSubmission", JSON.stringify(submissionResponse));
    } catch (error) {
      console.error("Error submitting exhibitor lineup:", error);
    }

    // Hide the card after a few seconds and restore animations
    setTimeout(() => {
      if (flippingCard) {
        flippingCard.style.display = "none";
        const cardInner = flippingCard.querySelector(".flipping-card-inner");
        if (cardInner) {
          cardInner.style.animation = "";
        }
      }
    }, 5000);
  });
}