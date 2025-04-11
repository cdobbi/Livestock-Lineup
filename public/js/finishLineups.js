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
                
                // Use regular /api/lineups endpoint instead of /bulk since it doesn't exist
                // Submit lineups one by one
                let allSuccessful = true;
                
                for (const lineup of lineups) {
                    const response = await fetch("https://livestock-lineup.onrender.com/api/lineups", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            showId: lineup.show_id,
                            categoryId: lineup.category_id,
                            breedIds: lineup.breedIds
                        })
                    });
                    
                    if (!response.ok) {
                        allSuccessful = false;
                        console.error(`Failed to submit lineup: ${JSON.stringify(lineup)}`);
                    }
                }
                
                if (allSuccessful) {
                    // Clear localStorage after successful submission
                    clearLineups();
                    
                    // Redirect to lineup.html
                    console.log("Finished button clicked. Redirecting to lineup.html");
                    window.location.href = "lineup.html";
                } else {
                    throw new Error("Some lineups failed to submit");
                }
            } catch (error) {
                console.error("Error submitting lineups:", error);
                alert("There was a problem submitting some lineups. Please try again.");
            }
        });
    } else {
        console.error("Finished button not found.");
    }
}