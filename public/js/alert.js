document.addEventListener("DOMContentLoaded", function () {
    const notificationSound = new Audio("../sounds/alert.mp3");
    const displayedNotifications = new Set();

    function showModal(message) {
        const modal = document.getElementById("notificationModal");
        if (!modal) {
            alert(message);
            return;
        }
        document.getElementById("modalMessage").innerText = message;
        modal.style.display = "block";

        // Auto-dismiss after 5 seconds (5000ms)
        setTimeout(() => {
            modal.style.display = "none";
        }, 5000);
    }

    function notifyUser(breed) {
        notificationSound.play();
        setTimeout(() => {
            showModal(`${breed} is up next!\n Take  ${breed} to ${show}.\nGood luck!`);
        }, 500);
    }

    async function checkForNotifications() {
        try {
            const exhibitorResponse = await fetch("https://livestock-lineup.onrender.com/api/shows");
            if (!exhibitorResponse.ok) {
                throw new Error("Failed to fetch exhibitor entries.");
            }
            const exhibitorEntries = await exhibitorResponse.json();
            console.log("Exhibitor entries fetched:", exhibitorEntries);

            if (!exhibitorEntries || exhibitorEntries.length === 0) {
                console.warn("No exhibitor entries found.");
                return;
            }

            // Fetch notifications from the backend
            const response = await fetch("https://livestock-lineup.onrender.com/api/notifications");
            if (!response.ok) {
                throw new Error("Failed to fetch notifications.");
            }
            const notifications = await response.json();

            // Check for matching notifications
            notifications.forEach((notification) => {
                const isBreedSelectedByExhibitor = exhibitorEntries.some((exhibitor) =>
                    exhibitor.submissions.some((submission) =>
                        submission.breeds.includes(notification.breed)
                    )
                );

                if (isBreedSelectedByExhibitor && !displayedNotifications.has(notification.breed)) {
                    displayedNotifications.add(notification.breed);
                    notifyUser(notification.breed);
                }
            });
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }

    setInterval(checkForNotifications, 30000);

    // Expose notifyUser globally so other files (like exhibitor.js and displayLineup.js) can use it
    window.notifyUser = notifyUser;
});