// clearLineups.js
export function initClearLineupButton(clearLineupButton) {
    clearLineupButton.addEventListener("click", async () => {
      if (confirm("Are you sure you want to clear ALL saved lineups?")) {
        try {
          const response = await fetch("/api/lineups", { method: "DELETE" });
          if (response.ok) {
            alert("All lineups cleared successfully.");
          } else {
            alert("Failed to clear lineups.");
          }
        } catch (err) {
          console.error("Error clearing lineups:", err);
          alert("Error clearing lineups.");
        }
      }
    });
  }
  

// import { clearLineups } from './localStorage.js';

// // Initialize Clear Lineup button functionality
// export function initClearLineupButton(clearLineupButton) {
//     if (clearLineupButton) {
//         clearLineupButton.addEventListener("click", () => {
//             // Clear lineups from localStorage using the imported function
//             clearLineups();

//             // Remove the "active" class from all breed buttons
//             document.querySelectorAll(".breed-button.active").forEach((btn) => {
//                 btn.classList.remove("active");
//             });

//             // Reset dropdowns for category and show
//             const categoryEl = document.getElementById("category");
//             const showEl = document.getElementById("show");
//             if (categoryEl) categoryEl.selectedIndex = 0;
//             if (showEl) showEl.selectedIndex = 0;

//             // Notify the user
//             alert("All lineups have been cleared.");
//         });
//     } else {
//         console.error("Clear Lineup button not found.");
//     }
// }
