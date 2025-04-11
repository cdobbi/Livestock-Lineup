/**
 * Module for handling Clear Lineup and Finished button functionality
 */

import { clearLineups, hasLineups, getLineups } from './localStorage.js';

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

/**
 * Initialize Finished button functionality
 * @param {HTMLElement} finishedButton - The Finished button element
 */
export function initFinishedButton(finishedButton) {
    if (finishedButton) {
        finishedButton.addEventListener("click", async () => {
            // Check if there are any lineups to submit
            if (!hasLineups()) {
                alert("Please save at least one lineup before finishing.");
                return;
            }
            
            try {
                // Get all lineups from localStorage
                const lineups = getLineups();
                
                // Send them to the server
                const response = await fetch("https://livestock-lineup.onrender.com/api/lineups/bulk", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ lineups: lineups })
                });
                
                if (response.ok) {
                    // Clear localStorage after successful submission
                    clearLineups();
                    
                    // Redirect to lineup.html
                    window.location.href = "lineup.html";
                } else {
                    throw new Error("Failed to submit lineups");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("There was a problem submitting your lineups. Please try again.");
            }
        });
    } else {
        console.error("Finished button not found.");
    }
}