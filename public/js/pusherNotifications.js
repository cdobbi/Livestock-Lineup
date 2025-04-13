import Pusher from "pusher-js";

const NOTIFICATION_SOUND_PATH = "/sounds/alert.mp3";
const NOTIFICATION_ICON_PATH = "/images/notification-icon.png";
const PUSHER_CHANNEL_NAME = "livestock-lineup";

export async function initializePusher() {
    try {
        const response = await fetch("https://livestock-lineup.onrender.com/pusher-config");
        if (!response.ok) {
            throw new Error(`Failed to fetch Pusher configuration. Status: ${response.status}`);
        }

        const pusherConfig = await response.json();

        const pusher = new Pusher(pusherConfig.key, {
            cluster: pusherConfig.cluster,
        });

        const channel = pusher.subscribe(PUSHER_CHANNEL_NAME);

        channel.bind("breed-notification", (data) => {
            const { breed, category, show } = data;
            console.log(`Notification received for Category: ${category}, Show: ${show}, Breed: ${breed}`);
            handleNotification(breed, category, show);
        });

        return { pusher, channel };
    } catch (error) {
        console.error("Error initializing Pusher:", error);
        alert("Real-time notifications are currently unavailable. Please refresh the page or try again later.");
        return null;
    }
}

function handleNotification(breed, category, show) {
    try {
        const notificationSound = new Audio(NOTIFICATION_SOUND_PATH);
        notificationSound.play();

        if ("Notification" in window) {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification("Table-Time Alert", {
                        body: `Your breed (${breed}) is up next!`,
                        icon: NOTIFICATION_ICON_PATH,
                    });
                } else {
                    console.warn("Notifications permission denied. Falling back to UI alert.");
                    updateNotificationArea(breed, category, show);
                }
            });
        } else {
            updateNotificationArea(breed, category, show);
        }
    } catch (error) {
        console.error("Error handling notification:", error);
    }
}

function updateNotificationArea(breed, category, show) {
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

    setTimeout(() => {
        notificationArea.style.display = "none";
    }, 10000);
}