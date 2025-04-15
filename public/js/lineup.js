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
                lineup_id: row.lineup_id,
                show_name: row.show_name,
                category_name: row.category_name,
                breed_names: [],
            };
        }
        groupedLineups[key].breed_names.push(row.breed_name);
    });

    // Create a table to display the lineups
    const table = document.createElement("table");
    table.classList.add("table", "table-striped", "table-bordered", "mt-4");

    // Create the table header
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Lineup</th>
        <th>Show</th>
        <th>Category</th>
        <th>Breeds</th>
      </tr>
    `;
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement("tbody");

    // Populate the table body with grouped data
    Object.keys(groupedLineups).forEach((key) => {
        const group = groupedLineups[key];
        const row = document.createElement("tr");

        // Lineup ID
        const lineupCell = document.createElement("td");
        lineupCell.textContent = group.lineup_id;
        row.appendChild(lineupCell);

        // Show Name
        const showCell = document.createElement("td");
        showCell.textContent = group.show_name;
        row.appendChild(showCell);

        // Category Name
        const categoryCell = document.createElement("td");
        categoryCell.textContent = group.category_name;
        row.appendChild(categoryCell);

        // Breeds (joined with line breaks)
        const breedsCell = document.createElement("td");
        breedsCell.innerHTML = group.breed_names.join("<br>");
        row.appendChild(breedsCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
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
