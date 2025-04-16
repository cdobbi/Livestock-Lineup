import { notifyUser } from "./uiHelpers.js";

export async function checkForNotifications() {
    try {
        // Step 1: Get the exhibitor ID
        const exhibitor_id = localStorage.getItem("exhibitor_id") || sessionStorage.getItem("exhibitor_id");

        if (!exhibitor_id) {
            console.log("No exhibitor ID found, skipping notification check");
            return;
        }

        // Step 2: Fetch the exhibitor's submissions
        const submissionsResponse = await fetch(`https://livestock-lineup.onrender.com/api/submissions`);
        if (!submissionsResponse.ok) {
            throw new Error(`Failed to fetch exhibitor submissions: ${submissionsResponse.statusText}`);
        }

        let submissions;
        try {
            submissions = await submissionsResponse.json();
        } catch (parseError) {
            throw new Error(`Error parsing submissions response: ${parseError.message}`);
        }

        if (!submissions || !Array.isArray(submissions) || submissions.length === 0) {
            console.log("No submissions found for this exhibitor");
            return;
        }

        // Step 3: Fetch active notifications
        const notificationsResponse = await fetch("https://livestock-lineup.onrender.com/api/lineups");
        if (!notificationsResponse.ok) {
            throw new Error(`Failed to fetch notifications: ${notificationsResponse.statusText}`);
        }

        let notifications;
        try {
            notifications = await notificationsResponse.json();
        } catch (parseError) {
            throw new Error(`Error parsing notifications response: ${parseError.message}`);
        }

        if (!notifications || !Array.isArray(notifications) || notifications.length === 0) {
            console.log("No active notifications found");
            return;
        }

        // Step 4: Check each notification against the exhibitor's submissions
        notifications.forEach((notification) => {
            // Extract breed IDs from submissions
            const exhibitorBreedIds = submissions.map(submission => submission.breed_id);

            // Check if this notification's breed matches any of the exhibitor's breeds
            if (exhibitorBreedIds.includes(notification.breed_id)) {
                // Create notification message with category and show information
                const notificationMessage = {
                    breed: notification.breed_name,
                    category: notification.category_name,
                    show: notification.show_name,
                    timestamp: notification.created_at || new Date().toISOString()
                };

                // Notify the user with the message
                notifyUser(notificationMessage);
                console.log(`Notification sent for breed: ${notification.breed_name}`);
            }
        });
    } catch (error) {
        console.error("Error checking for notifications:", error);
    }
}

// Optionally, you can set up an interval to check for notifications periodically
// Uncomment the following code if you want to check for notifications every 30 seconds

export function startNotificationChecks() {
    // Check immediately on startup
    checkForNotifications();
    
    // Then check every 30 seconds
    const checkInterval = setInterval(checkForNotifications, 30000);
    return checkInterval; // Return so it can be cleared if needed
}