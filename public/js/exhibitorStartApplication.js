export function initStartApplication() {
    const startButton = document.getElementById("start");
    if (!startButton) {
      console.error("Start Application button not found!");
      return;
    }
    
    startButton.addEventListener("click", () => {
      // Instead of showing a flipping card, simply set a message in a designated element.
      // Ensure your exhibitor HTML includes an element with id="notification-message".
      const notificationEl = document.getElementById("notification-message");
      if (notificationEl) {
        notificationEl.textContent = "Waiting for notification...";
      } else {
        // If the element is not found, fallback to an alert.
        alert("Waiting for notification...");
      }
      // (The notification sound will be handled by other parts of your code when the proper event arrives.)
    });
  }
  