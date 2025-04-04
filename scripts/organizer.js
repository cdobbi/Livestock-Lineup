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
            const entries = data.entries;
            rabbitList.innerHTML = "";

            
            entries.forEach((entry) => {
                const button = document.createElement("button");
                button.className = "btn btn-outline-secondary btn-sm mx-1 my-1 breed-button";
                button.dataset.breed = entry.breed;
                button.textContent = entry.breed;

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

    const saveLineupButton = document.getElementById("save-lineup");
    const printLineupButton = document.getElementById("print-lineup");
    const clearLineupButton = document.getElementById("clear-lineup");
    const finishedButton = document.getElementById("finished");

    if (saveLineupButton) {
        saveLineupButton.addEventListener("click", async () => {
            const categoryEl = document.getElementById("category");
            const showEl = document.getElementById("show");
            const category = categoryEl ? categoryEl.value : "";
            const show = showEl ? showEl.value : "";
    
            const selectedBreeds = Array.from(document.querySelectorAll(".breed-button.active")).map(
                (btn) => btn.dataset.breed
            );
    
            if (!category || !show || selectedBreeds.length === 0) {
                alert("Please select a category, show, and at least one breed.");
                return;
            }
    
            try {
                // Fetch exhibitor data for validation
                const response = await fetch("https://livestock-lineup.onrender.com/api/all-exhibitors");
                if (!response.ok) {
                    throw new Error("Failed to fetch exhibitor data.");
                }
    
                const exhibitorEntries = await response.json();
    
                console.log("Fetched exhibitor data:", exhibitorEntries);
    
                // Validate if any exhibitor matches the lineup
                const isMatchFound = exhibitorEntries.some((exhibitor) =>
                    exhibitor.submissions.some((submission) =>
                        submission.category === category &&
                        submission.show === show &&
                        submission.breeds.some((breed) => selectedBreeds.includes(breed))
                    )
                );
    
                if (!isMatchFound) {
                    alert("No exhibitor matches this lineup. Please check your selections.");
                    return; // Stop saving the lineup
                }
    
                // Save the lineup to the backend
                const organizerId = "Organizer123"; // Replace with dynamic ID
                const lineup = { category, show, breeds: selectedBreeds };
                const saveResponse = await fetch("https://livestock-lineup.onrender.com/api/save-organizer-lineups", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ organizerId, lineups: [lineup] }),
                });
    
                if (saveResponse.ok) {
                    alert("Lineup saved successfully!");
                } else {
                    console.error("Failed to save lineup:", saveResponse.statusText);
                    alert("Failed to save lineup. Please try again.");
                }
            } catch (error) {
                console.error("Error saving lineup:", error);
                alert("An error occurred while saving the lineup.");
            }
        });
    }
     
    // Print Lineup: Instead of printing the full HTML page with buttons,
    if (printLineupButton) {
        printLineupButton.addEventListener("click", () => {
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

    if (clearLineupButton) {
        clearLineupButton.addEventListener("click", () => {
            document.querySelectorAll(".breed-button.active").forEach((btn) => btn.classList.remove("active"));

            const categoryEl = document.getElementById("category");
            const showEl = document.getElementById("show");
            if (categoryEl) categoryEl.selectedIndex = 0;
            if (showEl) showEl.selectedIndex = 0;

            localStorage.setItem("showLineups", JSON.stringify([]));

            alert("All saved lineups and current selections have been cleared. You can start over.");
        });
    }

    if (finishedButton) {
        finishedButton.addEventListener("click", () => {
            window.location.href = "lineup.html";
        });
    }
});