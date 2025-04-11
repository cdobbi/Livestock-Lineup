/**
 * Module for handling Clear Lineup button functionality
 */

import { clearLineups } from './localStorage.js';

/**
 * Initialize Clear Lineup button functionality
 * @param {HTMLElement} clearLineupButton - The Clear Lineup button element
 */
export function initClearLineupButton(clearLineupButton) {
    if (clearLineupButton) {
        clearLineupButton.addEventListener("click", () => {
            // Clear from localStorage
            clearLineups();
            
            // Clear UI selections
            document.querySelectorAll(".breed-button.active").forEach((btn) => {
                btn.classList.remove("active");
            });
            
            // Reset dropdowns
            const categoryEl = document.getElementById("category");
            const showEl = document.getElementById("show");
            if (categoryEl) categoryEl.selectedIndex = 0;
            if (showEl) showEl.selectedIndex = 0;
            
            alert("All lineups have been cleared.");
            console.log("Clear lineup: Active breed selections and localStorage cleared.");
        });
    } else {
        console.error("Clear Lineup button not found.");
    }
}