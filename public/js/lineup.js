document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("lineup-container");

    if (!container) {
        console.error("lineup-container not found");
        return;
    }

    try {
        const api_endpoint = "/api/lineups";
        const response = await fetch(api_endpoint); // Using GET since the data is saved in the DB

        if (!response.ok) {
            throw new Error(`Failed to fetch lineups: ${response.statusText}`);
        }

        const lineups = await response.json();

        // Render the fetched lineups
        render_lineups(container, lineups);
    } catch (error) {
        console.error("Error fetching or rendering lineups:", error);
        container.innerHTML = `<p class="text-danger">Failed to load lineups. Please try again later.</p>`;
    }
});

function render_lineups(container, data) {
    container.innerHTML = "";

    // Group the lineups by a composite key (show_id and category_id)
    const grouped_lineups = {};
    data.forEach((row) => {
        const key = `${row.show_id}|${row.category_id}`;
        if (!grouped_lineups[key]) {
            grouped_lineups[key] = {
                show_name: row.show_name,
                category_name: row.category_name,
                breeds: [],
            };
        }
        grouped_lineups[key].breeds.push(row.breed_name);
    });

    // Render each lineup group
    Object.keys(grouped_lineups).forEach((key) => {
        const group = grouped_lineups[key];

        // Create a container for each lineup
        const lineup_div = document.createElement("div");
        lineup_div.classList.add("lineup", "mb-4");

        // Show title
        const show_title = document.createElement("h2");
        show_title.textContent = `Show: ${group.show_name}`;
        show_title.classList.add("mb-2");
        lineup_div.appendChild(show_title);

        // Category title
        const category_title = document.createElement("h3");
        category_title.textContent = `Category: ${group.category_name}`;
        category_title.classList.add("mb-2");
        lineup_div.appendChild(category_title);

        // Breeds list
        const breeds_list = document.createElement("ul");
        breeds_list.classList.add("list-group");
        group.breeds.forEach((breed) => {
            const breed_item = document.createElement("li");
            breed_item.classList.add("list-group-item");
            breed_item.textContent = breed;
            breeds_list.appendChild(breed_item);
        });
        lineup_div.appendChild(breeds_list);

        // Append the complete lineup container to the main container
        container.appendChild(lineup_div);
    });
}
