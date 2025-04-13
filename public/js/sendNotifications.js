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