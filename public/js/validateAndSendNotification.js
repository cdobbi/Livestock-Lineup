/**
 * Sends a notification to the relevant endpoint.
 *
 * @param {string} breed_name - The name or identifier for the breed.
 * @param {string} category_name - The name or identifier for the category.
 * @param {string} show_name - The name or identifier for the show.
 */
export async function sendNotification(breed_name, category_name, show_name) {
    try {
        const payload = {
            // Use the parameters directly. If your backend expects different keys (like IDs), update accordingly.
            breed_name: breed_name,
            category_name: category_name,
            show_name: show_name
        };

        const response = await fetch("https://livestock-lineup.onrender.com/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log(`Notification sent for breed: ${breed_name}`);
        } else {
            console.error(`Failed to send notification: ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error sending notification for breed: ${breed_name}`, error);
    }
}
