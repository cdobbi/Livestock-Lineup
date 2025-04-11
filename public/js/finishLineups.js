import { hasLineups, getLineups, clearLineups } from './localStorage.js';

/**
 * Initialize Finished button functionality
 * @param {HTMLElement} finishedButton - The Finished button element
 */
export function initFinishedButton(finishedButton) {
    if (finishedButton) {
        finishedButton.addEventListener("click", () => {
            if (!hasLineups()) {
                alert("Please save at least one lineup before finishing.");
                return;
            }

            clearLineups();
            window.location.href = "lineup.html";
        });
    } else {
        console.error("Finished button not found.");
    }
}