// exhibitor.js
import { initSaveLineup } from "./exhibitorSaveLineup.js";
import { initStartApplication } from "./exhibitorStartApplication.js";
import { initPrintSubmissions } from "./exhibitorPrintSubmissions.js";
import { initClearSubmissions } from "./exhibitorClearSubmissions.js";
import { initializePusher } from "./pusherNotifications.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Initialize exhibitor functionalities.
  initSaveLineup();
  initStartApplication();
  initPrintSubmissions();
  initClearSubmissions();

  // Real-time notifications (Pusher functionality).
  try {
    const pusherInstance = await initializePusher();
    if (pusherInstance) {
      const channel = pusherInstance.channel;
      channel.bind("breed-notification", (data) => {
        const { breed, category, show } = data;
        alert(`Notification for Category: ${category}, Show: ${show}, Breed: ${breed}`);
        try {
          const notificationSound = new Audio("./sounds/alert.mp3");
          notificationSound.play();
        } catch (error) {
          console.error("Error playing notification sound:", error);
        }
      });
    }
  } catch (error) {
    console.error("Error initializing Pusher:", error);
  }
});
