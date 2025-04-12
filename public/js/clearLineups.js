import { clearLineups } from './localStorage.js';

// Initialize Clear Lineup button functionality
export function initClearLineupButton(clearLineupButton) {
    if (clearLineupButton) {
        clearLineupButton.addEventListener("click", () => {
            // Clear lineups from localStorage using the imported function
            clearLineups();

            // Remove the "active" class from all breed buttons
            document.querySelectorAll(".breed-button.active").forEach((btn) => {
                btn.classList.remove("active");
            });

            // Reset dropdowns for category and show
            const categoryEl = document.getElementById("category");
            const showEl = document.getElementById("show");
            if (categoryEl) categoryEl.selectedIndex = 0;
            if (showEl) showEl.selectedIndex = 0;

            // Notify the user
            alert("All lineups have been cleared.");
        });
    } else {
        console.error("Clear Lineup button not found.");
    }
}
