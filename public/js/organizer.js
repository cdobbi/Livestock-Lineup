document.addEventListener("DOMContentLoaded", function () {
    // --- Top-level elements ---
    const rabbitList = document.getElementById("rabbit-list");
    const saveLineupButton = document.getElementById("save-lineup");
    const clearLineupButton = document.getElementById("clear-lineup");
    const printLineupButton = document.getElementById("print-lineup"); // Added this
    const finishedButton = document.getElementById("finished");
    
    // Create printContainer if it doesn't exist
    let printContainerElement = document.getElementById("printContainer");
    if (!printContainerElement) {
        printContainerElement = document.createElement("div");
        printContainerElement.id = "printContainer";
        document.body.appendChild(printContainerElement);
    }
    
    const categoryMap = {
        1: "Youth",
        2: "Open"
    };
    
    const showMap = {
        1: "Show A",
        2: "Show B",
        3: "Show C",
        4: "Show D",
        5: "Meat Pen",
        6: "Fur"
    };
    fetch("https://livestock-lineup.onrender.com/api/breeds")
    .then((response) => {
        console.log("Fetch breeds response:", response); // Debugging log
        if (!response.ok) {
            throw new Error("Failed to fetch rabbit breeds.");
        }
        return response.json();
    })
    .then((breeds) => {
        console.log("Fetched breeds array:", breeds); // Log the full array
        breeds.forEach((breed) => {
            console.log(`Breed ID: ${breed.id}, Breed Name: ${breed.breed_name}`); // Log each breed
        });
    
        rabbitList.innerHTML = ""; // Clear existing content
        breeds.forEach((breed) => {
            const button = document.createElement("button");
            button.className = "btn btn-outline-secondary btn-lg mx-1 my-1 breed-button";
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
    if (saveLineupButton) {
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
                    const flippingCard = document.getElementById("flipping-card");
                    flippingCard.style.display = "block";
    
                    // Stop the flipping animation after 2 seconds and show the success message
                    setTimeout(() => {
                        flippingCard.querySelector(".flipping-card-inner").style.animation = "none";
                    }, 2000);
    
                    setTimeout(() => {
                        flippingCard.style.display = "none";
                    }, 4000);
                }
                
            } catch (error) {
                console.error("Error saving lineup:", error);
            }
        });
    } else {
        console.error("Save Lineup button not found.");
    }    
    
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
                        printContent += `Lineup: ${index + 1}\n`;
                        printContent += `Category: ${categoryMap[lineup.category_id] || "Unknown"}\n`;
                        printContent += `Show: ${showMap[lineup.show_id] || "Unknown"}\n`;
        
                        if (Array.isArray(lineup.breeds) && lineup.breeds.length > 0) {
                            printContent += `Breed:\n`;
                            lineup.breeds.forEach((breed, i) => {
                                printContent += (i < lineup.breeds.length - 1) ? `${breed},\n` : `${breed}.\n`;
                            });
                        } else {
                            printContent += `Breed:\n${lineup.breed_name || ""}\n`;
                        }                    
                        printContent += "\n";
                    });
                }
                
                // --- Moved Text Only Print Preview Block ---
                const blob = new Blob([printContent], { type: "text/plain;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "lineup.txt";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                // --- End Moved Block ---
        
            } catch (error) {
                console.error(error);
            }
        });
    } else {
        console.error("Print Lineup button not found.");
    }
    
    if (clearLineupButton) {
        clearLineupButton.addEventListener("click", () => {
            // Remove the "active" class from all breed buttons.
            document.querySelectorAll(".breed-button.active").forEach((btn) => {
                btn.classList.remove("active");
            });
            // Optionally reset the category and show dropdowns if they exist.
            const categoryEl = document.getElementById("category");
            const showEl = document.getElementById("show");
            if (categoryEl) {
                categoryEl.selectedIndex = 0;
            }
            if (showEl) {
                showEl.selectedIndex = 0;
            }
            console.log("Clear lineup: Active breed selections cleared.");
        });
    } else {
        console.error("Clear Lineup button not found.");
    }
    
    if (finishedButton) {
        finishedButton.addEventListener("click", () => {
            console.log("Finished button clicked. Redirecting to lineup.html");
            window.location.href = "lineup.html";
        });
    } else {
        console.error("Finished button not found.");
    }    
});
