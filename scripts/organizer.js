document.addEventListener("DOMContentLoaded", function () {
    // --- Top-level elements ---
    const saveShowButton = document.getElementById("save-show");
    const beginShowButton = document.getElementById("begin-show");
    const rabbitList = document.getElementById("rabbit-list");

    // --- Fetch and Render Rabbit Breed Buttons ---
    fetch("data/data.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch rabbit breeds.");
            }
            return response.json();
        })
        .then((data) => {
            const entries = data.entries; // Access the "entries" key
            rabbitList.innerHTML = ""; // Clear any placeholder text

            // Populate the rabbit list dynamically as buttons using Bootstrap styling
            entries.forEach((entry) => {
                const button = document.createElement("button");
                // Use Bootstrap's button classes
                button.className = "btn btn-outline-secondary btn-sm mx-1 my-1 breed-button";
                button.dataset.breed = entry.breed;
                button.textContent = entry.breed;

                // Toggle selection on click by toggling the "active" class
                button.addEventListener("click", function () {
                    this.classList.toggle("active");
                    console.log(
                        `Breed ${this.dataset.breed} is now ${this.classList.contains("active") ? "selected" : "deselected"}.`
                    );
                });
                rabbitList.appendChild(button);
            });
        })
        .catch((error) => {
            console.error("Error fetching rabbit breeds:", error);
            rabbitList.innerHTML = "<div class='text-danger'>Failed to load rabbit breeds.</div>";
        });

    // --- Bottom Action Buttons Functionality ---

    // Get the bottom action buttons
    const saveLineupButton = document.getElementById("save-lineup");
    const printLineupButton = document.getElementById("print-lineup");
    const clearLineupButton = document.getElementById("clear-lineup");
    const finishedButton = document.getElementById("finished");

    // Save Lineup: Capture current lineup selections (category, show, and selected breeds)
    // and store them into localStorage.
    if (saveLineupButton) {
        saveLineupButton.addEventListener("click", () => {
            // Get the selected values from the dropdowns (ensure your HTML has these elements)
            const categoryEl = document.getElementById("category");
            const showEl = document.getElementById("show");
            const category = categoryEl ? categoryEl.value : "";
            const show = showEl ? showEl.value : "";

            // Gather selected breeds from buttons by checking for the "active" class.
            const selectedBreeds = Array.from(document.querySelectorAll(".breed-button.active")).map(
                (btn) => btn.dataset.breed
            );

            // Verify that a category, show, and at least one breed have been selected.
            if (!category || !show || selectedBreeds.length === 0) {
                alert("Please select a category, show, and at least one breed.");
                return;
            }

            // Retrieve previously saved lineups from localStorage (stored as an array); default to an empty array if none.
            let savedLineups = JSON.parse(localStorage.getItem("showLineups")) || [];
            // Create a new lineup object.
            const newLineup = {
                category: category,
                show: show,
                breeds: selectedBreeds
            };
            // Append the new lineup and update localStorage.
            savedLineups.push(newLineup);
            localStorage.setItem("showLineups", JSON.stringify(savedLineups));

            alert(
                `Lineup saved!\nCategory: ${category}\nShow: ${show}\nBreeds: ${selectedBreeds.join(
                    ", "
                )}\n\nPress Finished when done or save another lineup.`
            );

            // Notice: We are NOT clearing the active selections here.
            // This allows the organizer to see the current configuration even after saving.
        });
    }

    // Print Lineup: Instead of printing the full HTML page with buttons,
    // we generate a plain-text preview and pass it off to a new window for printing.
    if (printLineupButton) {
        printLineupButton.addEventListener("click", () => {
            // Retrieve the saved lineups (assuming they are stored as an array).
            let savedLineups = JSON.parse(localStorage.getItem("showLineups")) || [];
            let printContent = "";

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

            // Open a new window displaying only the plain-text preview.
            let previewWindow = window.open("", "_blank", "width=800,height=600");
            previewWindow.document.write("<html><head><title>Print Preview</title>");
            previewWindow.document.write("<style>body { font-family: Arial, sans-serif; white-space: pre-wrap; margin: 20px; }</style>");
            previewWindow.document.write("</head><body>");
            previewWindow.document.write("<h2>Print Preview</h2>");
            previewWindow.document.write("<pre>" + printContent + "</pre>");
            // Display a button to trigger printing.
            previewWindow.document.write("<button class='btn btn-primary' onclick='window.print();'>Print Now</button>");
            previewWindow.document.write("<script>window.onafterprint = function(){ window.close(); }<\/script>");
            previewWindow.document.write("</body></html>");
            previewWindow.document.close();
            previewWindow.focus();
        });
    }

    // Clear Lineup: Clear current selections and remove all saved lineups.
    if (clearLineupButton) {
        clearLineupButton.addEventListener("click", () => {
            // Remove the "active" class from all breed buttons.
            document.querySelectorAll(".breed-button.active").forEach((btn) => btn.classList.remove("active"));

            // Reset the dropdowns for category and show, if they exist.
            const categoryEl = document.getElementById("category");
            const showEl = document.getElementById("show");
            if (categoryEl) categoryEl.selectedIndex = 0;
            if (showEl) showEl.selectedIndex = 0;

            // Clear the saved lineups from localStorage by setting it to an empty array.
            localStorage.setItem("showLineups", JSON.stringify([]));

            alert("All saved lineups and current selections have been cleared. You can start over.");
        });
    }

    // Finished: Redirect to the lineup.html page to display all saved lineups.
    if (finishedButton) {
        finishedButton.addEventListener("click", () => {
            window.location.href = "lineup.html";
        });
    }
});