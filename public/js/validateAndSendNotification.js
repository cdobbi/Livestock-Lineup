import { sendNotification } from "./sendNotification.js";

export async function validateAndSendNotification(breed_name, category_name, show_name) {
    try {
        // Fetch the exhibitor submissions dynamically from your backend.
        const response = await fetch("/api/submissions");
        if (!response.ok) {
            console.error("Failed to fetch submissions:", response.statusText);
            return;
        }
        const submissionsData = await response.json();

        // Validate by checking if any submission has the clicked breed.
        // We assume each submission object contains a field 'breed_name'.
        const breedFound = submissionsData.some(submission => submission.breed_name === breed_name);

        if (!breedFound) {
            console.warn(`Breed ${breed_name} is not present in any exhibitor submissions. No notification will be sent.`);
            return;
        }

        // If validation passes, send the notification.
        await sendNotification(breed_name, category_name, show_name);
        console.log(`Notification sent for breed: ${breed_name}`);
    } catch (error) {
        console.error(`Error in validateAndSendNotification for breed "${breed_name}":`, error);
    }
}