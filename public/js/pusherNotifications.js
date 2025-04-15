import Pusher from "https://cdn.skypack.dev/pusher-js@8.4.0";

const NOTIFICATION_SOUND_PATH = "/sounds/alert.mp3"; // Adjusted path to match convention
const NOTIFICATION_ICON_PATH = "../images/notification-icon.png"; // Adjusted path to match convention
const PUSHER_CHANNEL_NAME = "livestock-lineup";

export async function initializePusher() {
  console.log("Initializing Pusher...");
  try {
    // Fetch the Pusher configuration from the server
    const response = await fetch("/pusher-config");
    console.log("Fetch response from /pusher-config:", response);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pusher configuration. Status: ${response.status}`);
    }

    const pusherConfig = await response.json();
    console.log("Pusher configuration fetched:", pusherConfig);

    // Initialize Pusher with the fetched config
    const pusher = new Pusher(pusherConfig.key, {
      cluster: pusherConfig.cluster,
    });
    console.log("Pusher initialized:", pusher);

    // Subscribe to the designated channel
    const channel = pusher.subscribe(PUSHER_CHANNEL_NAME);
    console.log(`Subscribed to channel: ${PUSHER_CHANNEL_NAME}`);

    channel.bind("breed-notification", (data) => {
        console.log("Received breed-notification event with data:", data);
        handleNotification(data.breed, data.category, data.show);
      });
      

    return { pusher, channel };
  } catch (error) {
    console.error("Error initializing Pusher:", error);
    alert("Real-time notifications are currently unavailable. Please refresh the page or try again later.");
    return null;
  }
}

function handleNotification(breed, category, show) {
  console.log("Handling notification for breed:", breed);
  try {
    // Attempt to play the notification sound
    const notificationSound = new Audio(NOTIFICATION_SOUND_PATH);
    console.log("Attempting to play sound from:", NOTIFICATION_SOUND_PATH);
    notificationSound.play()
      .then(() => console.log("Notification sound played successfully."))
      .catch((err) => console.error("Error playing notification sound:", err));

    // Check if the browser supports notifications
    if ("Notification" in window) {
      Notification.requestPermission()
        .then((permission) => {
          console.log("Notification permission status:", permission);
          if (permission === "granted") {
            console.log("Displaying browser notification...");
            new Notification("Table-Time Alert", {
              body: `Your breed (${breed}) is up next!`,
              icon: NOTIFICATION_ICON_PATH,
            });
          } else {
            console.warn("Notifications permission denied. Falling back to UI alert.");
            updateNotificationArea(breed, category, show);
          }
        })
        .catch((err) => {
          console.error("Error requesting notification permission:", err);
          updateNotificationArea(breed, category, show);
        });
    } else {
      console.warn("Browser does not support notifications, falling back to UI alert.");
      updateNotificationArea(breed, category, show);
    }
  } catch (error) {
    console.error("Error in handleNotification:", error);
  }
}

function updateNotificationArea(breed, category, show) {
  console.log("Updating notification area with the message.");
  let notificationArea = document.getElementById("notification-area");

  if (!notificationArea) {
    console.warn("Notification area element not found. Creating one dynamically.");
    notificationArea = document.createElement("div");
    notificationArea.id = "notification-area";
    notificationArea.style.position = "fixed";
    notificationArea.style.bottom = "10px";
    notificationArea.style.right = "10px";
    notificationArea.style.backgroundColor = "#f8d7da";
    notificationArea.style.color = "#721c24";
    notificationArea.style.padding = "10px";
    notificationArea.style.border = "1px solid #f5c6cb";
    notificationArea.style.borderRadius = "5px";
    notificationArea.style.zIndex = "1000";
    document.body.appendChild(notificationArea);
  }

  notificationArea.textContent = `Category: ${category}, Show: ${show}\nYour breed (${breed}) is up next!`;
  notificationArea.style.display = "block";
  console.log("Notification area updated:", notificationArea.textContent);

  setTimeout(() => {
    notificationArea.style.display = "none";
    console.log("Notification area hidden after 10 seconds.");
  }, 10000);
}

export function testNotificationSound() {
  console.log("Testing notification sound manually.");
  const testSound = new Audio(NOTIFICATION_SOUND_PATH);
  testSound.play()
    .then(() => console.log("Manual test: notification sound played successfully."))
    .catch((err) => console.error("Manual test: error playing notification sound:", err));
}

// IMPORTANT: Attach testNotificationSound to the global scope for testing
console.log("Attaching testNotificationSound to window:", testNotificationSound);
window.testNotificationSound = testNotificationSound;
