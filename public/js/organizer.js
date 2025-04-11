// Import modules
import { saveLineup, getLineups, hasLineups } from './localStorage.js';
import { initClearLineupButton, initFinishedButton } from './clear-finish.js';

// Define category and show mappings
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

document.addEventListener("DOMContentLoaded", function () {
    // --- Get all button references ---
    const rabbitList = document.getElementById("rabbit-list");
    const saveLineupButton = document.getElementById("save-lineup");
    const printLineupButton = document.getElementById("print-lineup");
    const clearLineupButton = document.getElementById("clear-lineup");
    const finishedButton = document.getElementById("finished");

    if (!rabbitList) console.error("Rabbit list container not found");
    if (!saveLineupButton) console.error("Save Lineup button not found");
    if (!printLineupButton) console.error("Print Preview button not found");
    
    // --- Fetch and display breeds ---
    fetch("https://livestock-lineup.onrender.com/api/breeds")
        .then((response) => {
            console.log("Fetch breeds response:", response);
            if (!response.ok) {
                throw new Error("Failed to fetch rabbit breeds.");
            }
            return response.json();
        })
        .then((breeds) => {
            console.log("Fetched breeds array:", breeds);
            
            rabbitList.innerHTML = ""; // Clear existing content
            breeds.forEach((breed) => {
                const button = document.createElement("button");
                button.className = "breed-button btn btn-outline-secondary m-2";
                button.dataset.breedId = breed.id;
                button.textContent = breed.breed_name;
                
                button.addEventListener("click", function () {
                    this.classList.toggle("active");
                    console.log(`Breed ${this.textContent} is now ${this.classList.contains("active") ? "selected" : "deselected"}.`);
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
        saveLineupButton.addEventListener("click", () => {
            const categoryEl = document.getElementById("category");
            const showEl = document.getElementById("show");
            const categoryId = parseInt(categoryEl ? categoryEl.value : "", 10);
            const showId = parseInt(showEl ? showEl.value : "", 10);
            
            const selectedBreeds = Array.from(document.querySelectorAll(".breed-button.active"));
            const breedIds = selectedBreeds.map(btn => parseInt(btn.dataset.breedId, 10));
            const breedNames = selectedBreeds.map(btn => btn.textContent);
            
            if (!categoryId || !showId || breedIds.length === 0) {
                alert("Please select a category, show, and at least one breed.");
                return;
            }
            
            // Create the lineup object
            const lineup = {
                category_id: categoryId,
                show_id: showId,
                breedIds: breedIds,
                breeds: breedNames
            };
            
            // Save to localStorage
            saveLineup(lineup);
            
            // Show success message with flipping card
            const flippingCard = document.getElementById("flipping-card");
            if (flippingCard) {
                flippingCard.style.display = "block";
                
                setTimeout(() => {
                    flippingCard.querySelector(".flipping-card-inner").style.animation = "none";
                }, 2000);
                
                setTimeout(() => {
                    flippingCard.style.display = "none";
                }, 4000);
            }
            
            // Reset selections for next lineup
            selectedBreeds.forEach(btn => {
                btn.classList.remove("active");
            });
        });
    }
    
    // --- Print Lineup Button Functionality ---
    if (printLineupButton) {
        printLineupButton.addEventListener("click", () => {
            let printContent = "";
            
            // Get lineups from localStorage
            const savedLineups = getLineups();
            
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
                            // Add comma after each breed except the last one
                            printContent += (i < lineup.breeds.length - 1) ? `${breed},\n` : `${breed}.\n`;
                        });
                    } else {
                        printContent += `Breed:\nUnknown.\n`;
                    }
                    printContent += "\n"; // Add blank line between lineups
                });
            }
            
            // Open printable window
            const printWindow = window.open("", "_blank", "width=600,height=600");
            printWindow.document.write(`
                <html>
                <head>
                    <title>Lineup Print Preview</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        pre { white-space: pre-wrap; }
                        button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
                    </style>
                </head>
                <body>
                    <h2>Lineup Print Preview</h2>
                    <pre>${printContent}</pre>
                    <button onclick="window.print(); window.close();">Print</button>
                </body>
                </html>
            `);
            printWindow.document.close();
        });
    }
    
    // Initialize Clear and Finished buttons
    initClearLineupButton(clearLineupButton);
    initFinishedButton(finishedButton);
});


// // At the top of organizer.js, add this import
// import { saveLineup, getLineups, hasLineups, clearLineups, getLineupCount } from './localStorage.js';

// document.addEventListener("DOMContentLoaded", function () {
//     // Your existing code...
    
//     // --- Save Lineup Button Functionality ---
//     if (saveLineupButton) {
//         saveLineupButton.addEventListener("click", async () => {
//             const categoryEl = document.getElementById("category");
//             const showEl = document.getElementById("show");
//             const categoryId = parseInt(categoryEl ? categoryEl.value : "", 10);
//             const showId = parseInt(showEl ? showEl.value : "", 10);
    
//             const selectedBreeds = Array.from(document.querySelectorAll(".breed-button.active"));
//             const breedIds = selectedBreeds.map(btn => parseInt(btn.dataset.breedId, 10));
//             const breedNames = selectedBreeds.map(btn => btn.textContent);
    
//             if (!categoryId || !showId || breedIds.length === 0) {
//                 alert("Please select a category, show, and at least one breed.");
//                 return;
//             }
    
//             // Create the lineup object
//             const lineup = {
//                 category_id: categoryId,
//                 show_id: showId,
//                 breedIds: breedIds,
//                 breeds: breedNames
//             };
            
//             // Save to localStorage instead of API
//             saveLineup(lineup);
            
//             // Show success message with flipping card
//             const flippingCard = document.getElementById("flipping-card");
//             if (flippingCard) {
//                 flippingCard.style.display = "block";
                
//                 setTimeout(() => {
//                     flippingCard.querySelector(".flipping-card-inner").style.animation = "none";
//                 }, 2000);
                
//                 setTimeout(() => {
//                     flippingCard.style.display = "none";
//                 }, 4000);
//             }
            
//             // Reset selections for next lineup
//             document.querySelectorAll(".breed-button.active").forEach(btn => {
//                 btn.classList.remove("active");
//             });
//         });
//     }
    
//     // --- Print Lineup Button Functionality ---
//     if (printLineupButton) {
//         printLineupButton.addEventListener("click", async () => {
//             let printContent = "";
            
//             // Get lineups from localStorage instead of API
//             const savedLineups = getLineups();
            
//             if (savedLineups.length === 0) {
//                 printContent = "No lineups saved.";
//             } else {
//                 savedLineups.forEach((lineup, index) => {
//                     printContent += `Lineup: ${index + 1}\n`;
//                     printContent += `Category: ${categoryMap[lineup.category_id] || "Unknown"}\n`;
//                     printContent += `Show: ${showMap[lineup.show_id] || "Unknown"}\n`;
    
//                     if (Array.isArray(lineup.breeds) && lineup.breeds.length > 0) {
//                         printContent += `Breed:\n`;
//                         lineup.breeds.forEach((breed, i) => {
//                             printContent += (i < lineup.breeds.length - 1) ? `${breed},\n` : `${breed}.\n`;
//                         });
//                     } else {
//                         printContent += `Breed:\n${lineup.breed_name || ""}\n`;
//                     }                    
//                     printContent += "\n";
//                 });
//             }
            
//             // Your existing code to display/download the print preview...
//         });
//     }
    
//     // --- Clear Lineup Button Functionality ---
//     if (clearLineupButton) {
//         clearLineupButton.addEventListener("click", () => {
//             // Clear from localStorage
//             clearLineups();
            
//             // Also clear UI selections
//             document.querySelectorAll(".breed-button.active").forEach((btn) => {
//                 btn.classList.remove("active");
//             });
            
//             // Reset dropdowns
//             const categoryEl = document.getElementById("category");
//             const showEl = document.getElementById("show");
//             if (categoryEl) categoryEl.selectedIndex = 0;
//             if (showEl) showEl.selectedIndex = 0;
            
//             alert("All lineups have been cleared.");
//         });
//     }
    
//     // --- Finished Button Functionality ---
//     if (finishedButton) {
//         finishedButton.addEventListener("click", async () => {
//             // Check if there are any lineups to submit
//             if (!hasLineups()) {
//                 alert("Please save at least one lineup before finishing.");
//                 return;
//             }
            
//             try {
//                 // Get all lineups from localStorage
//                 const lineups = getLineups();
                
//                 // Send them to the server
//                 const response = await fetch("https://livestock-lineup.onrender.com/api/lineups/bulk", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ lineups: lineups })
//                 });
                
//                 if (response.ok) {
//                     // Clear localStorage after successful submission
//                     clearLineups();
                    
//                     // Redirect to lineup.html
//                     window.location.href = "lineup.html";
//                 } else {
//                     throw new Error("Failed to submit lineups");
//                 }
//             } catch (error) {
//                 console.error("Error:", error);
//                 alert("There was a problem submitting your lineups. Please try again.");
//             }
//         });
//     }
// });
