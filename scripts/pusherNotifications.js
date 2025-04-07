// Fetch Pusher configuration from the server and initialize Pusher
async function initializePusher() {
    try {
        // Fetch Pusher configuration from the server
        const response = await fetch("https://livestock-lineup.onrender.com/pusher-config");
        if (!response.ok) {
            throw new Error("Failed to fetch Pusher configuration.");
        }

        const pusherConfig = await response.json();

        // Initialize Pusher using the fetched configuration
        const pusher = new Pusher(pusherConfig.key, {
            cluster: pusherConfig.cluster,
        });

        const channel = pusher.subscribe("livestock-lineup");

        // Bind to the "breed-notification" event
        channel.bind("breed-notification", (data) => {
            const { breed, category, show } = data; // Extract all relevant fields
            console.log(`Notification received for Category: ${category}, Show: ${show}, Breed: ${breed}`);
            handleNotification(breed, category, show);
        });

        return { pusher, channel };
    } catch (error) {
        console.error("Error initializing Pusher:", error);
        return null;
    }
}

// Handle incoming notifications with sound and polished notifications
function handleNotification(breed, category, show) {
    try {
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
                    updateNotificationArea(breed, category, show);
                }
            });
        } else {
            // Fall back to updating the UI if browser notifications are unsupported
            updateNotificationArea(breed, category, show);
        }
    } catch (error) {
        console.error("Error handling notification:", error);
    }
}

// Update the notification area in the UI
function updateNotificationArea(breed, category, show) {
    const notificationArea = document.getElementById("notification-area");

    if (!notificationArea) {
        console.error("Notification area element not found in the DOM.");
        return;
    }

    notificationArea.textContent = `Category: ${category}, Show: ${show}\nYour breed (${breed}) is up next!`;
    notificationArea.style.display = "block";

    // Auto-hide the notification after 10 seconds
    setTimeout(() => {
        notificationArea.style.display = "none";
    }, 10000);
}

// Export the initialization function
module.exports = { initializePusher };



// // Fetch Pusher configuration from the server and initialize Pusher
// async function initializePusher() {
//     try {
//         // Fetch Pusher configuration from the server
//         const response = await fetch("https://livestock-lineup.onrender.com/pusher-config");
//         if (!response.ok) {
//             throw new Error("Failed to fetch Pusher configuration.");
//         }

//         const pusherConfig = await response.json();

//         // Initialize Pusher using the fetched configuration
//         const pusher = new Pusher(pusherConfig.key, {
//             cluster: pusherConfig.cluster,
//         });

//         const channel = pusher.subscribe("table-time");

//         // Bind to the "breed-notification" event
//         channel.bind("breed-notification", (data) => {
//             const { breed, category, show } = data; // Extract all relevant fields
//             console.log(`Notification received for Category: ${category}, Show: ${show}, Breed: ${breed}`);
//             handleNotification(breed, category, show);
//         });

//         return { pusher, channel };
//     } catch (error) {
//         console.error("Error initializing Pusher:", error);
//         return null;
//     }
// }

// // Handle incoming notifications with sound and polished notifications
// function handleNotification(breed, category, show) {
//     // Play notification sound
//     const notificationSound = new Audio("/sounds/alert.mp3");
//     notificationSound.play();

//     // Use Browser Notification API if supported
//     if ("Notification" in window) {
//         Notification.requestPermission().then((permission) => {
//             if (permission === "granted") {
//                 new Notification("Table-Time Alert", {
//                     body: `Your breed (${breed}) is up next!`,
//                     icon: "/images/notification-icon.png", // Optional: add an icon for a polished look
//                 });
//             } else {
//                 console.warn("Notifications permission denied. Falling back to UI alert.");
//                 updateNotificationArea(breed, category, show);
//             }
//         });
//     } else {
//         // Fall back to updating the UI if browser notifications are unsupported
//         updateNotificationArea(breed, category, show);
//     }
// }

// // Update the notification area in the UI
// function updateNotificationArea(breed, category, show) {
//     const notificationArea = document.getElementById("notification-area");

//     if (!notificationArea) {
//         console.error("Notification area element not found in the DOM.");
//         return;
//     }

//     notificationArea.textContent = `Category: ${category}, Show: ${show}\nYour breed (${breed}) is up next!`;
//     notificationArea.style.display = "block";

//     // Auto-hide the notification after 10 seconds
//     setTimeout(() => {
//         notificationArea.style.display = "none";
//     }, 10000);
// }

// // Export the initialization function
// module.exports = { initializePusher };