// ---------- BEGIN FRONT-END CODE (lineup.js) ----------

// When the DOM is ready, fetch and render the lineup from the backend API.
document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("lineup-container");

    if (!container) {
        console.error("lineup-container not found");
        return;
    }

    try {
        // Fetch saved lineups from the backend
        const response = await fetch("/api/submissions");
        if (!response.ok) {
            throw new Error("Failed to fetch lineups");
        }

        const lineups = await response.json();

        // Render the fetched lineups
        renderLineups(container, lineups);
    } catch (error) {
        console.error("Error fetching or rendering lineups:", error);
        container.innerHTML = `<p class="text-danger">Failed to load lineups. Please try again later.</p>`;
    }
});

function renderLineups(container, data) {
    container.innerHTML = "";

    // Group the data by show and category
    const grouped = {};
    data.forEach((entry) => {
        const show = entry.show_name || `Show ${entry.show_id}`;
        const category = entry.category_name || `Category ${entry.category_id || "Unknown"}`;
        if (!grouped[show]) {
            grouped[show] = {};
        }
        if (!grouped[show][category]) {
            grouped[show][category] = [];
        }
        grouped[show][category].push(entry.breed_name);
    });

    // Create HTML for each group
    Object.keys(grouped).forEach((show) => {
        const showDiv = document.createElement("div");
        showDiv.classList.add("mb-4");

        // Show title
        const showTitle = document.createElement("h2");
        showTitle.textContent = `Lineup: ${show}`;
        showTitle.classList.add("mb-3");
        showDiv.appendChild(showTitle);

        Object.keys(grouped[show]).forEach((category) => {
            // Category title
            const categoryTitle = document.createElement("h3");
            categoryTitle.textContent = `Category: ${category}`;
            categoryTitle.classList.add("mb-3");
            showDiv.appendChild(categoryTitle);

            // Breed list
            const breedList = document.createElement("ul");
            breedList.classList.add("list-group", "ps-4"); // Add padding for indentation

            grouped[show][category].forEach((breed) => {
                const breedItem = document.createElement("li");
                breedItem.classList.add("list-group-item");

                // Breed name
                const breedName = document.createElement("span");
                breedName.textContent = breed;

                breedItem.appendChild(breedName);
                breedList.appendChild(breedItem);
            });

            showDiv.appendChild(breedList);
        });

        container.appendChild(showDiv);
    });
}

async function sendNotification(breed, category, show) {
    try {
        const response = await fetch("/pusher-config/trigger", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                channel: "livestock-lineup",
                event: "breed-notification",
                data: { breed, category, show },
            }),
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Failed to trigger notification:", text);
        } else {
            console.log(`Notification triggered for ${breed}`);
        }
    } catch (error) {
        console.error("Error sending notification:", error);
    }
}