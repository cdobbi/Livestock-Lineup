import { notifyUser } from "./uiHelpers.js";

export async function checkForNotifications() {
    try {
        // Step 1: Get the exhibitor ID (you may need to modify this based on how you store it)
        const exhibitor_id = localStorage.getItem("exhibitor_id") || sessionStorage.getItem("exhibitor_id");

        if (!exhibitor_id) {
            console.log("No exhibitor ID found, skipping notification check");
            return;
        }

        // Step 2: Fetch the exhibitor's submissions
        const submissionsResponse = await fetch(`https://livestock-lineup.onrender.com/api/submissions}`);
        if (!submissionsResponse.ok) {
            throw new Error("Failed to fetch exhibitor submissions.");
        }
        const submissions = await submissionsResponse.json();

        if (!submissions || submissions.length === 0) {
            console.log("No submissions found for this exhibitor");
            return;
        }

        // Step 3: Fetch active notifications
        const notificationsResponse = await fetch("https://livestock-lineup.onrender.com/api/lineups");
        if (!notificationsResponse.ok) {
            throw new Error("Failed to fetch notifications.");
        }
        const notifications = await notificationsResponse.json();

        // Step 4: Check each notification against the exhibitor's submissions
        notifications.forEach((notification) => {
            // Extract breed IDs from submissions
            const exhibitorBreedIds = exhibitorSubmissions.map(submission => submission.breed_id);

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
            }
        });
    } catch (error) {
        console.error("Error checking for notifications:", error);
    }
}