import { fetchAndRenderBreeds } from "./fetchBreeds.js";
import { saveLineup } from "./saveLineups.js";
import { initClearLineupButton } from "./clearLineups.js";
import { initFinishedButton } from "./finishLineups.js";
import { initPrintLineupButton } from "./printLineups.js";

document.addEventListener("DOMContentLoaded", async function () {
  const apiBaseUrl = "https://livestock-lineup.onrender.com/api";

  // Select required DOM elements
  const saveLineupButton = document.getElementById("save-lineup");
  const printLineupButton = document.getElementById("print-lineup");
  const clearLineupButton = document.getElementById("clear-lineup");
  const finishedButton = document.getElementById("finished");
  const rabbitList = document.getElementById("rabbit-list");

  // Check if required elements exist
  if (!rabbitList) {
    console.error("Rabbit list element not found");
    return;
  }
  if (!saveLineupButton) {
    console.error("Save Lineup button not found");
    return;
  }
  if (!printLineupButton) console.error("Print Preview button not found");
  if (!clearLineupButton) console.error("Clear Lineup button not found");
  if (!finishedButton) console.error("Finished button not found");

  // Fetch and display breeds.
  // Ensure that `${apiBaseUrl}/breeds` is a valid endpoint that returns an array of breed objects.
  fetchAndRenderBreeds(`${apiBaseUrl}/breeds`, rabbitList);

  // Initialize Save Lineup button
  saveLineupButton.addEventListener("click", async () => {
    // Get selected category and show values from the dropdowns.
    const categoryEl = document.getElementById("category");
    const showEl = document.getElementById("show");
    const categoryId = categoryEl ? categoryEl.value : "";
    const showId = showEl ? showEl.value : "";

    // IMPORTANT: Get only the breed buttons that have been marked active.
    // (Make sure your breed buttons—created by fetchAndRenderBreeds—toggle the "active" class on click.)
    const breedButtons = document.querySelectorAll(".breed-button.active");
    const selectedBreeds = Array.from(breedButtons).map((btn) => btn.dataset.breed);

    // Debug: log the payload so you can verify it
    console.log("Payload being prepared:", {
      categoryId,
      showId,
      breedIds: selectedBreeds,
    });

    // Validate the payload before sending to the backend.
    if (!categoryId || !showId || selectedBreeds.length === 0) {
      alert("Please select a category, show, and at least one breed.");
      console.error("Invalid payload:", { categoryId, showId, breedIds: selectedBreeds });
      return;
    }

    try {
      // Call saveLineup – it sends the payload to your server.
      await saveLineup(categoryId, showId, selectedBreeds, `${apiBaseUrl}/lineups`);
      alert("Lineup saved successfully!");

      // Reset the selection for next lineup.
      // (This only resets the visual "active" state on the breed buttons; it does not clear saved data.)
      document.querySelectorAll(".breed-button.active").forEach((btn) => {
        btn.classList.remove("active");
      });
    } catch (error) {
      console.error("Error saving lineup:", error);
      alert("Failed to save lineup. Please try again.");
    }
  });

  // Initialize Print Preview button.
  // When clicked, it fetches saved lineups and opens a simple print preview.
  if (printLineupButton) {
    initPrintLineupButton(printLineupButton);
  }

  // Initialize Clear Lineup button.
  // This button sends a DELETE request to clear saved lineups ONLY when clicked.
  if (clearLineupButton) {
    initClearLineupButton(clearLineupButton);
  }

  // Initialize Finished button.
  // When clicked, it routes the user to the lineup viewing page.
  if (finishedButton) {
    initFinishedButton(finishedButton);
  }
});


// import { fetchAndRenderBreeds } from './fetchBreeds.js';
// import { saveLineup } from './saveLineups.js';
// import { initClearLineupButton } from './clearLineups.js';
// import { initFinishedButton } from './finishLineups.js';
// import { initPrintLineupButton } from './printLineups.js';

// document.addEventListener("DOMContentLoaded", async function () {
//   const apiBaseUrl = "https://livestock-lineup.onrender.com/api";

//   // Select required DOM elements
//   const saveLineupButton = document.getElementById("save-lineup");
//   const printLineupButton = document.getElementById("print-lineup");
//   const clearLineupButton = document.getElementById("clear-lineup");
//   const finishedButton = document.getElementById("finished");
//   const rabbitList = document.getElementById("rabbit-list");

//   // Check if required elements exist
//   if (!rabbitList) {
//     console.error("Rabbit list element not found");
//     return;
//   }
//   if (!saveLineupButton) {
//     console.error("Save Lineup button not found");
//     return;
//   }
//   if (!printLineupButton) console.error("Print Preview button not found");
//   if (!clearLineupButton) console.error("Clear Lineup button not found");
//   if (!finishedButton) console.error("Finished button not found");

//   // Fetch and display breeds using the imported fetchAndRenderBreeds function
//   // (Ensure this endpoint is valid and returns a proper breeds array)
//   fetchAndRenderBreeds(`${apiBaseUrl}/breeds`, rabbitList);

//   // Initialize Save Lineup button
//   saveLineupButton.addEventListener("click", async () => {
//     // Get selected category and show values from dropdowns
//     const categoryEl = document.getElementById("category");
//     const showEl = document.getElementById("show");
//     const categoryId = categoryEl ? categoryEl.value : "";
//     const showId = showEl ? showEl.value : "";

//     // IMPORTANT:
//     // Select breed buttons that have the "active" class.
//     const breedButtons = document.querySelectorAll(".breed-button.active");
//     const selectedBreeds = Array.from(breedButtons).map((btn) => btn.dataset.breed);

//     // Debugging: Log the prepared payload
//     console.log("Payload being prepared:", {
//       categoryId,
//       showId,
//       breedIds: selectedBreeds,
//     });

//     // Validate the payload before sending to the backend
//     if (!categoryId || !showId || selectedBreeds.length === 0) {
//       alert("Please select a category, show, and at least one breed.");
//       console.error("Invalid payload:", { categoryId, showId, breedIds: selectedBreeds });
//       return;
//     }

//     // Call the saveLineup function with validated data
//     try {
//       await saveLineup(categoryId, showId, selectedBreeds, `${apiBaseUrl}/lineups`);
//       alert("Lineup saved successfully!");
//       // Reset active state on breed buttons for next lineup
//       document.querySelectorAll(".breed-button.active").forEach((btn) => {
//         btn.classList.remove("active");
//       });
//     } catch (error) {
//       console.error("Error saving lineup:", error);
//       alert("Failed to save lineup. Please try again.");
//     }
//   });

//   // Initialize other buttons
//   if (printLineupButton) initPrintLineupButton(printLineupButton);
//   if (clearLineupButton) initClearLineupButton(clearLineupButton);
//   if (finishedButton) initFinishedButton(finishedButton);
// });
