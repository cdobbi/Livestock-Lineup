import { notifyUser } from "./uiHelpers.js";

export async function checkForNotifications() {
    try {
        const response = await fetch("https://livestock-lineup.onrender.com/api/notifications");
        if (!response.ok) {
            throw new Error("Failed to fetch notifications.");
        }
        const notifications = await response.json();

        notifications.forEach((notification) => {
            const hardCodedExhibitorSubmissions = [
                {
                    exhibitor_id: 1,
                    submissions: [
                        { breeds: ["RHINELANDER", "HARLEQUIN", "MINI LOP"] },
                    ],
                },
                {
                    exhibitor_id: 2,
                    submissions: [
                        { breeds: ["SATIN", "CASTOR REX"] },
                    ],
                },
            ];

            const isBreedSelectedByExhibitor = hardCodedExhibitorSubmissions.some((exhibitor) =>
                (exhibitor.submissions || []).some((submission) =>
                    submission.breeds.includes(notification.breeds)
                )
            );

            if (isBreedSelectedByExhibitor) {
                notifyUser(notification.breeds);
            }
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
}