/**
 * This script handles the organizer functionality for the Livestock Lineup application.
 * It integrates with a PostgreSQL backend to fetch rabbit breeds, validate exhibitor entries,
 * save and manage lineups, and navigate to other pages.
 */

document.addEventListener("DOMContentLoaded", function () {
    // --- Top-level elements ---
    const rabbitList = document.getElementById("rabbit-list");
    const saveLineupButton = document.getElementById("save-lineup"); // Add this line to define the button

    fetch("https://livestock-lineup.onrender.com/api/breeds")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch rabbit breeds.");
        }
        return response.json();
    })
    .then((breeds) => {
        rabbitList.innerHTML = ""; // Clear existing content

        breeds.forEach((breed) => {
            const button = document.createElement("button");
            button.className = "btn btn-outline-secondary btn-sm mx-1 my-1 breed-button";
            button.dataset.breedId = breed.id; // Use the ID for unique tracking
            button.textContent = breed.breed_name; // Display the breed name

            button.addEventListener("click", function () {
                this.classList.toggle("active");
                console.log(
                    `Breed ${this.textContent} is now ${this.classList.contains("active") ? "selected" : "deselected"}.`
                );
            });
            rabbitList.appendChild(button);
        });
    })
    .catch((error) => {
        console.error("Error fetching rabbit breeds:", error);
        rabbitList.innerHTML = "<div class='text-danger'>Failed to load rabbit breeds.</div>";
    });

    // --- Save Lineup Button Functionality ---
    if (saveLineupButton) { // Ensure the button exists
        saveLineupButton.addEventListener("click", async () => {
            const categoryEl = document.getElementById("category");
            const showEl = document.getElementById("show");
            const categoryId = parseInt(categoryEl ? categoryEl.value : "", 10); // Convert to integer
            const showId = parseInt(showEl ? showEl.value : "", 10); // Convert to integer

            const breedIds = Array.from(document.querySelectorAll(".breed-button.active")).map(
                (btn) => parseInt(btn.dataset.breedId, 10) // Convert to integer
            );

            if (!categoryId || !showId || breedIds.length === 0) {
                alert("Please select a category, show, and at least one breed.");
                return;
            }

            try {
                const response = await fetch("https://livestock-lineup.onrender.com/api/lineups", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ showId, categoryId, breedIds }),
                });

                if (response.ok) {
                    alert("Lineup saved successfully!");
                } else {
                    console.error("Failed to save lineup:", response.statusText);
                    alert("Failed to save lineup. Please try again.");
                }
            } catch (error) {
                console.error("Error saving lineup:", error);
                alert("An error occurred while saving the lineup.");
            }
        });
    } else {
        console.error("Save Lineup button not found.");
    }

    // --- Print Lineup Button Functionality ---
    const printLineupButton = document.getElementById("print-lineup");
    if (printLineupButton) {
        printLineupButton.addEventListener("click", async () => {
            let printContent = "";

            try {
                // Fetch saved lineups from the backend
                const response = await fetch("https://livestock-lineup.onrender.com/api/lineups");
                if (!response.ok) {
                    throw new Error("Failed to fetch saved lineups.");
                }

                const savedLineups = await response.json();

                if (savedLineups.length === 0) {
                    printContent = "No lineups saved.";
                } else {
                    savedLineups.forEach((lineup, index) => {
                        printContent += `Lineup ${index + 1}\n`;
                        printContent += `Category: ${lineup.category}\n`;
                        printContent += `Show: ${lineup.show}\n`;
                        printContent += `Breeds: ${lineup.breeds.join(", ")}\n\n`;
                    });
                }

                let previewWindow = window.open("", "_blank", "width=800,height=600");
                previewWindow.document.write("<html><head><title>Print Preview</title>");
                previewWindow.document.write("<style>body { font-family: Arial, sans-serif; white-space: pre-wrap; margin: 20px; }</style>");
                previewWindow.document.write("</head><body>");
                previewWindow.document.write("<h2>Print Preview</h2>");
                previewWindow.document.write("<pre>" + printContent + "</pre>");
                previewWindow.document.write("<button class='btn btn-primary' onclick='window.print();'>Print Now</button>");
                previewWindow.document.write("<script>window.onafterprint = function(){ window.close(); }<\/script>");
                previewWindow.document.write("</body></html>");
                previewWindow.document.close();
                previewWindow.focus();
            } catch (error) {
                console.error("Error fetching saved lineups:", error);
                alert("Failed to load saved lineups. Please try again later.");
            }
        });
    }
});
