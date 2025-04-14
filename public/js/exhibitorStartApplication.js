export function initStartApplication() {
    const startButton = document.getElementById("start");
    if (!startButton) {
      console.error("Start Application button not found!");
      return;
    }
    
    startButton.addEventListener("click", () => {
      // Instead of showing a flipping card, create a Bootstrap alert dynamically.
      // First, see if there is an element with id "notification-container"
      let container = document.getElementById("notification-container");
      
      // If one doesn't exist, create and append it to the body (or another suitable parent)
      if (!container) {
        container = document.createElement("div");
        container.id = "notification-container";
        // Optionally add some Bootstrap spacing classes
        container.className = "mt-3";
        document.body.prepend(container);
      }
      
      // Clear any previous content
      container.innerHTML = "";
      
      // Create the alert div
      const alertDiv = document.createElement("div");
      // Use Bootstrap alert classes (make sure Bootstrap CSS is loaded)
      alertDiv.className = "alert alert-info";
      alertDiv.textContent = "Waiting for notification...";
      
      container.appendChild(alertDiv);
      
      // Play the notification sound.
      // (Ensure that the sound file exists at the given path and that the browser permits audio playback)
      const notificationSound = new Audio("../sounds/alert.mp3");
      notificationSound.play().catch(error => {
        console.error("Error playing notification sound:", error);
      });
      
      // (Optional) If you want to remove the message after a few seconds, uncomment:
      // setTimeout(() => {
      //   container.innerHTML = "";
      // }, 5000);
    });
  }
  