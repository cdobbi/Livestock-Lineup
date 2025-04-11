import { clearLineups } from './localStorage.js';

/**
 * Initialize Clear Lineup button functionality
 * @param {HTMLElement} clearLineupButton - The Clear Lineup button element
 */
export function initClearLineupButton(clearLineupButton) {
    if (clearLineupButton) {
        clearLineupButton.addEventListener("click", () => {
            clearLineups();

            document.querySelectorAll(".breed-button.active").forEach((btn) => {
                btn.classList.remove("active");
            });

            const categoryEl = document.getElementById("category");
            const showEl = document.getElementById("show");
            if (categoryEl) categoryEl.selectedIndex = 0;
            if (showEl) showEl.selectedIndex = 0;

            alert("All lineups have been cleared.");
        });
    } else {
        console.error("Clear Lineup button not found.");
    }
}