import { sendNotification } from "./sendNotification.js";

/**
 * Validates the clicked breed against exhibitor submissions.
 */
export async function validateAndSendNotification(breed, category, show) {
    try {
        // Hard-coded exhibitor submissions for testing purposes.
        const hardCodedExhibitorSubmissions = [
            {
                exhibitor_id: 1,
                submissions: [
                    { breeds: ["AMERICAN", "ANGORA", "CHINCHILLA"] },
                ],
            },
            {
                exhibitor_id: 2,
                submissions: [
                    { breeds: ["BRITISH GIANT", "CASTOR REX"] },
                ],
            },
        ];

        console.log("Hard-coded exhibitor submissions:", hardCodedExhibitorSubmissions);

        // Check if at least one exhibitor's submissions include the clicked breed.
        const isBreedSelectedByExhibitor = hardCodedExhibitorSubmissions.some((exhibitor) =>
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