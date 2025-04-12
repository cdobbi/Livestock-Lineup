// ========================
// Fetch and Render Functions
// ========================

/**
 * Fetches lineup data from the backend and renders it
 * using the renderLineups function.
 */
export async function fetchAndRenderLineups(lineupContainer, selectedShowId) {
    try {
        const url = `/api/lineups`; // Adjust URL / query parameters as needed
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching lineups: ${response.statusText}`);
        }
        // Parse the JSON data
        const showLineups = await response.json();
        console.log("Retrieved lineups:", showLineups);
    
        // Render the lineups using the exported renderLineups function.
        renderLineups(lineupContainer, showLineups);
    } catch (error) {
        console.error("Error fetching or rendering lineups:", error);
        lineupContainer.innerHTML = "<p>Failed to load lineups. Please try again later.</p>";
    }
}

/**
 * Renders the lineup data into the given container.
 * Assumes showLineups is structured as an object where the keys are categories.
 */
export function renderLineups(lineupContainer, showLineups) {
    console.log("Clearing lineup container...");
    lineupContainer.innerHTML = "";
    
    Object.keys(showLineups).forEach((category) => {
        Object.keys(showLineups[category]).forEach((show) => {
            const lineup = showLineups[category][show];
            const showDiv = document.createElement("div");
            showDiv.classList.add("lineup", "mb-4", "p-3", "border", "rounded");

            const showTitle = document.createElement("h3");
            showTitle.textContent = `Category: ${category} - Show: ${show}`;
            showTitle.classList.add("text-primary");
            showDiv.appendChild(showTitle);

            const breedList = document.createElement("ul");
            breedList.classList.add("list-group");

            // Safely iterate over the array of breeds
            (lineup.breeds || []).forEach((breed) => {
                const breedItem = document.createElement("li");
                breedItem.classList.add("list-group-item");

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = `checkbox-${breed}`;
                checkbox.classList.add("breed-checkbox");

                const label = document.createElement("label");
                label.htmlFor = `checkbox-${breed}`;
                label.textContent = breed;
                label.style.cursor = "pointer"; // Indicates the label is clickable

                // When the label is clicked, trigger the notification.
                label.addEventListener("click", (event) => {
                    event.stopPropagation();
                    console.log(`Breed ${breed} clicked in lineup: Category ${category}, Show ${show}`);
                    // Assuming validateAndSendNotification is defined elsewhere or imported:
                    validateAndSendNotification(breed, category, show);
                });

                breedItem.appendChild(checkbox);
                breedItem.appendChild(label);
                breedList.appendChild(breedItem);
            });

            showDiv.appendChild(breedList);
            lineupContainer.appendChild(showDiv);
        });
    });
}

// ========================
// Notification and Other Functions (Intact)
// ========================

// Create an audio object and a Set to track displayed notifications.
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
        // Note: In the following message, “show” is not defined.
        // If you need to reference the show name, you might pass it as a parameter.
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
            // Use .some() to check if any exhibitor's submissions contain the notification breed.
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

// Expose notifyUser globally so other files (like exhibitor.js and displayLineup.js) can use it.
window.notifyUser = notifyUser;

// ========================
// Auto-Initialize on DOMContentLoaded
// ========================
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("lineup-container");
    if (!container) {
        console.error("lineup-container not found on lineup.html");
        return;
    }
    // Call our exported fetchAndRenderLineups function.
    fetchAndRenderLineups(container, null);
});
