import { notifyUser } from "./uiHelpers.js";

export async function checkForNotifications() {
    try {
        // Step 1: Get the exhibitor ID (you may need to modify this based on how you store it)
        const exhibitorId = localStorage.getItem("exhibitor_id") || sessionStorage.getItem("exhibitor_id");

        if (!exhibitorId) {
            console.log("No exhibitor ID found, skipping notification check");
            return;
        }

        // Step 2: Fetch the exhibitor's submissions
        const submissionsResponse = await fetch(`https://livestock-lineup.onrender.com/api/submissions?exhibitor_id=${exhibitorId}`);
        if (!submissionsResponse.ok) {
            throw new Error("Failed to fetch exhibitor submissions.");
        }
        const exhibitorSubmissions = await submissionsResponse.json();

        if (!exhibitorSubmissions || exhibitorSubmissions.length === 0) {
            console.log("No submissions found for this exhibitor");
            return;
        }

        // Step 3: Fetch active notifications
        const notificationsResponse = await fetch("https://livestock-lineup.onrender.com/api/notifications");
        if (!notificationsResponse.ok) {
            throw new Error("Failed to fetch notifications.");
        }
        const notifications = await notificationsResponse.json();

        // Step 4: Check each notification against the exhibitor's submissions
        notifications.forEach((notification) => {
            // Extract breed names from submissions
            const exhibitorBreeds = exhibitorSubmissions.map(submission => submission.breed_name);

            // Check if any notification breed matches the exhibitor's breeds
            if (exhibitorBreeds.includes(notification.breed_name)) {
                // Create notification message with category and show information
                const notificationMessage = {
                    breed: notification.breed_name,
                    category: notification.category_name,
                    show: notification.show_name,
                    timestamp: notification.created_at || new Date().toISOString()
                };

                // Notify the user with the complete information
                notifyUser(notificationMessage);
            }
        });
    } catch (error) {
        console.error("Error checking for notifications:", error);
    }
}