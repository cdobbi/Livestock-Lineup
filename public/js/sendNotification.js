/**
 * Sends a notification to the relevant endpoint.
 */
export async function sendNotification(breed_name, category_name, show_name) {
    try {
        const payload = {
            breed_id: b.breed_name,
            category_id: c.category_name,
            show_id: s.show_name
        };

        const response = await fetch("https://livestock-lineup.onrender.com/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log(`Notification sent for breed: ${b.breed_name}`);
        } else {
            console.error(`Failed to send notification: ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error sending notification for breed: ${b.breed_name}`, error);
    }
}