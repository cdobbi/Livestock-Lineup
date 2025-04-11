// Does this file need to go into the uiHandlers.bundle.js file? Also which html file does it belong in if any? If it doesn't belong in an HTML or any of the other files, how is it initialized, called or used? What is it's purpose? Please, verify, ensure that this file is updated to use ES Modals and dont use the weird notations. ensure that all variables, functions, and wording are consistent across files and that everything links properly.

import { hasLineups, getLineups, clearLineups } from './localStorage.js';

// Initialize Finished button functionality
export function initFinishedButton(finishedButton) {
    if (finishedButton) {
        finishedButton.addEventListener("click", () => {
            // Check if there are any saved lineups
            if (!hasLineups()) {
                alert("Please save at least one lineup before finishing.");
                return;
            }

            // Clear all lineups from localStorage
            clearLineups();

            // Redirect to lineup.html
            window.location.href = "lineup.html";
        });
    } else {
        console.error("Finished button not found.");
    }
}