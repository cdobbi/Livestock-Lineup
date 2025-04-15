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
  
    // Group the lineups by a composite key (show_id and category_id)
    const groupedLineups = {};
    data.forEach((row) => {
      const key = `${row.show_id}|${row.category_id}`;
      if (!groupedLineups[key]) {
        groupedLineups[key] = {
          show_name: row.show_name,
          category_name: row.category_name,
          breeds: [],
        };
      }
      groupedLineups[key].breeds.push(row.breed_name);
    });
  
    // Render each lineup group
    Object.keys(groupedLineups).forEach((key) => {
      const group = groupedLineups[key];
  
      // Create a container for each lineup
      const lineupDiv = document.createElement("div");
      lineupDiv.classList.add("lineup", "mb-4");
  
      // Show title
      const showTitle = document.createElement("h2");
      showTitle.textContent = `Show: ${group.show_name}`;
      showTitle.classList.add("mb-2");
      lineupDiv.appendChild(showTitle);
  
      // Category title
      const categoryTitle = document.createElement("h3");
      categoryTitle.textContent = `Category: ${group.category_name}`;
      categoryTitle.classList.add("mb-2");
      lineupDiv.appendChild(categoryTitle);
  
      // Breeds list
      const breedsList = document.createElement("ul");
      breedsList.classList.add("list-group");
      group.breeds.forEach((breed) => {
        const breedItem = document.createElement("li");
        breedItem.classList.add("list-group-item");
        breedItem.textContent = breed;
        breedsList.appendChild(breedItem);
      });
      lineupDiv.appendChild(breedsList);
  
      // Append the lineup to the container
      container.appendChild(lineupDiv);
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
