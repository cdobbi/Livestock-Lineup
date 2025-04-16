document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("lineup-container");

    if (!container) {
        console.error("lineup-container not found");
        return;
    }

    try {
        const api_endpoint = "/api/lineups";
        console.log("Fetching lineups from:", api_endpoint);

        const response = await fetch(api_endpoint);

        if (!response.ok) {
            throw new Error(`Failed to fetch lineups: ${response.statusText}`);
        }

        const lineups = await response.json();
        console.log("Received lineups:", lineups);

        render_lineups(container, lineups);
    } catch (error) {
        console.error("Error fetching or rendering lineups:", error);
        container.innerHTML = `<p class="text-danger">Failed to load lineups. Please try again later.</p>`;
    }
});

function render_lineups(container, data) {
    container.innerHTML = "";

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

    // Render each grouped lineup
    Object.keys(grouped_lineups).forEach((key) => {
        const group = grouped_lineups[key];

        // Container for each lineup group
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

        // Create a list for the breeds
        const breeds_list = document.createElement("ul");
        breeds_list.classList.add("breed_list");

        group.breeds.forEach((breed) => {
            const breed_item = document.createElement("li");
            breed_item.classList.add("lineup_item");
            breed_item.style.display = "flex";
            breed_item.style.alignItems = "center";
            breed_item.style.padding = "15px 0";

            // Create the checkbox element
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("breed_checkbox");
            checkbox.style.marginRight = "20px";

            checkbox.style.transform = "scale(1.5)";

            // When the checkbox is clicked, send a Pusher alert
            checkbox.addEventListener("change", function () {
                if (this.checked) {
                    send_pusher_alert(breed);
                }
            });

            // Create the label element for the breed name
            const label = document.createElement("span");
            label.textContent = breed;

            // Append the checkbox and label to the list item
            breed_item.appendChild(checkbox);
            breed_item.appendChild(label);

            // Add a simple hover effect on the list item
            breed_item.style.transition = "background-color 0.3s ease";
            breed_item.addEventListener("mouseover", function () {
                breed_item.style.backgroundColor = "#f0f0f0"; // light grey on hover
            });
            breed_item.addEventListener("mouseout", function () {
                breed_item.style.backgroundColor = "transparent";
            });

            breeds_list.appendChild(breed_item);
        });
        lineup_div.appendChild(breeds_list);
        container.appendChild(lineup_div);
    });
}

// Simulated function to send a pusher alert to the exhibitor.
// Replace the body of this function with your actual Pusher API integration.
function send_pusher_alert(breed) {
    console.log(`Sending pusher alert for breed: ${breed}`);
    // Example: You might send a fetch POST request to your backend that triggers Pusher:
    // fetch('/api/send_alert', {
    //   method: 'POST',
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ breed: breed })
    // })
    // .then(response => response.json())
    // .then(result => console.log("Alert sent:", result))
    // .catch(error => console.error("Alert error:", error));
}
