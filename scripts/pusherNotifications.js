// Fetch Pusher configuration from the server and initialize Pusher
async function initializePusher() {
    try {
        // Fetch Pusher configuration from the server
        const response = await fetch("https://livestock.lineup.onrender.com/pusher-config");
        if (!response.ok) {
            throw new Error("Failed to fetch Pusher configuration.");
        }

        const pusherConfig = await response.json();

        // Initialize Pusher using the fetched configuration
        const pusher = new pusher(pusherConfig.key, {
            cluster: pusherConfig.cluster,
        });

        // Subscribe to the "table-time" channel
        const channel = pusher.subscribe("table-time");

        // Listen for "breed-notification" events
        channel.bind("breed-notification", (data) => {
            // Trigger mobile-friendly notifications
            handleNotification(data.breed);
        });

        return { pusher, channel };
    } catch (error) {
        console.error("Error initializing Pusher:", error);
        return null;
    }
}

// Handle incoming notifications with sound and polished notifications
function handleNotification(breed) {
    // Play notification sound
    const notificationSound = new Audio("/sounds/alert.mp3");
    notificationSound.play();

    // Use Browser Notification API if supported
    if ("Notification" in window) {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification("Table-Time Alert", {
                    body: `Your breed (${breed}) is up next!`,
                    icon: "/images/notification-icon.png", // Optional: add an icon for a polished look
                });
            } else {
                console.warn("Notifications permission denied. Falling back to UI alert.");
                updateNotificationArea(breed);
            }
        });
    } else {
        // Fall back to updating the UI if browser notifications are unsupported
        updateNotificationArea(breed);
    }
}

// Dynamically update the UI to display the notification
function updateNotificationArea(breed) {
    const notificationArea = document.getElementById("notification-area");

    if (!notificationArea) {
        console.error("Notification area element not found in the DOM.");
        return;
    }

    // Display the notification message in the UI
    notificationArea.textContent = `Your breed (${breed}) is up next!`;
    notificationArea.style.display = "block";

    // Auto-hide the notification after 10 seconds
    setTimeout(() => {
        notificationArea.style.display = "none";
    }, 10000);
}

// Export the initialization function
export { initializePusher };
