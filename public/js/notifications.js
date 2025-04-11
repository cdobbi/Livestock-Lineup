// Does this file need to go into the uiHandlers.bundle.js file? Also which html file does it belong in if any? If it doesn't belong in an HTML or any of the other files, how is it initialized, called or used? What is it's purpose? Please, verify, ensure that this file is updated to use ES Modals and dont use the weird notations. ensure that all variables, functions, and wording are consistent across files and that everything links properly.

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

export async function validateAndSendNotification(breed, category, show) {
    try {
        // Fetch exhibitor entries from the backend
        const exhibitorResponse = await fetch("https://livestock-lineup.onrender.com/api/submissions");
        const exhibitorsSubmissions = await exhibitorResponse.json();

        // Validate exhibitorEntries and check if the breed matches
        const isBreedSelectedByExhibitor = exhibitorsSubmissions.some((exhibitor) =>
            exhibitor.submissions.some((submission) =>
                submission.breeds.includes(breed)
            )
        );

        if (!isBreedSelectedByExhibitor) {
            console.warn(`Breed ${breed} is not selected by the exhibitor.`);
            return; // Exit if the breed is not selected by any exhibitor
        }

        // If the breed matches, send the notification
        await sendNotification(breed, category, show);
    } catch (error) {
        console.error(`Error validating or sending notification for breed: ${breed}`, error);
    }
}