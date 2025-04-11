/**
 * Module for handling Finished button functionality
 */

import { hasLineups, getLineups, clearLineups } from './localStorage.js';

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
                
                // Simply redirect to lineup.html without trying to send to server
                // The data is already saved in localStorage
                console.log("Finished button clicked. Redirecting to lineup.html");
                window.location.href = "lineup.html";
                
            } catch (error) {
                console.error("Error:", error);
                alert("There was a problem. Please try again.");
            }
        });
    } else {
        console.error("Finished button not found.");
    }
}