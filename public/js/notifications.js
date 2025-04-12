// notifications.js

/**
 * Sends a notification to the relevant endpoint.
 */
export async function sendNotification(breed, category, show) {
    try {
        const payload = {
            breed_name: breed,
            category: category,
            show: show,
        };

        const response = await fetch("https://livestock-lineup.onrender.com/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log(`Notification sent for breed: ${breed}`);
        } else {
            console.error(`Failed to send notification: ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error sending notification for breed: ${breed}`, error);
    }
}

/**
 * Validates the clicked breed against exhibitor submissions.
 * Temporarily uses a hard-coded submission array for testing.
 */
export async function validateAndSendNotification(breed, category, show) {
    try {
        // Hard-coded exhibitor submissions for testing purposes.
        // Adjust the data below to match the structure you expect.
        const hardCodedExhibitorSubmissions = [
            {
                exhibitor_id: 1,
                submissions: [
                    {
                        breeds: ["AMERICAN", "ANGORA", "CHINCHILLA"]
                    }
                ]
            },
            {
                exhibitor_id: 2,
                submissions: [
                    {
                        breeds: ["BRITISH GIANT", "CASTOR REX"]
                    }
                ]
            }
        ];

        // For testing, use the hard-coded object instead of fetching.
        const exhibitorsSubmissions = hardCodedExhibitorSubmissions;
        console.log("Hard-coded exhibitor submissions:", exhibitorsSubmissions);

        // Check if at least one exhibitor's submissions include the clicked breed.
        const isBreedSelectedByExhibitor = exhibitorsSubmissions.some((exhibitor) =>
            (exhibitor.submissions || []).some((submission) =>
                submission.breeds.includes(breed)
            )
        );

        if (!isBreedSelectedByExhibitor) {
            console.warn(`Breed ${breed} is not selected by any exhibitor.`);
            return; // Exit if the breed is not selected by any exhibitor.
        }

        // If the breed is present in a submission, send the notification.
        await sendNotification(breed, category, show);
    } catch (error) {
        console.error(`Error validating or sending notification for breed: ${breed}`, error);
    }
}

// (The code below is for checking notifications periodically in your alert flow.)
// If you plan to test that flow as well, you might similarly override the fetch call.

async function checkForNotifications() {
    try {
        // (Optional) If you want to test notifications automatically,
        // you can also use a hard-coded notifications array similar to the exhibitor submissions.
        const response = await fetch("https://livestock-lineup.onrender.com/api/notifications");
        if (!response.ok) {
            throw new Error("Failed to fetch notifications.");
        }
        const notifications = await response.json();

        notifications.forEach((notification) => {
            // For now, we'll assume that the same hard-coded submission logic applies here.
            const hardCodedExhibitorSubmissions = [
                {
                    exhibitor_id: 1,
                    submissions: [
                        { breeds: ["AMERICAN", "ANGORA", "CHINCHILLA"] }
                    ]
                },
                {
                    exhibitor_id: 2,
                    submissions: [
                        { breeds: ["BRITISH GIANT", "CASTOR REX"] }
                    ]
                }
            ];

            const isBreedSelectedByExhibitor = hardCodedExhibitorSubmissions.some((exhibitor) =>
                (exhibitor.submissions || []).some((submission) =>
                    submission.breeds.includes(notification.breed)
                )
            );

            if (isBreedSelectedByExhibitor) {
                notifyUser(notification.breed);
            }
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
}

// Helper function to show notifications to the user.
function notifyUser(breed) {
    // Play an audio sound for notification.
    const notificationSound = new Audio("../sounds/alert.mp3");
    notificationSound.play();

    // Display a modal with the notification.
    setTimeout(() => {
        showModal(`${breed} is up next!\nTake ${breed} to [show].\nGood luck!`);
    }, 500);
}

// Function to show a modal message.
function showModal(message) {
    const modal = document.getElementById("notificationModal");
    if (!modal) {
        alert(message);
        return;
    }
    document.getElementById("modalMessage").innerText = message;
    modal.style.display = "block";

    // Auto-dismiss after 5 seconds.
    setTimeout(() => {
        modal.style.display = "none";
    }, 5000);
}

// Periodically check for notifications (every 30 seconds).
setInterval(checkForNotifications, 30000);
