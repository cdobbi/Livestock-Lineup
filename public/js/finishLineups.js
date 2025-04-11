// Verify, ensure that require and module.exports are used and dont use the weird notations. ensure that all variables, functions, and wording are consistent across files and that everything links properly.


const { hasLineups, getLineups, clearLineups } = require('./localStorage.js');

// Initialize Finished button functionality
function initFinishedButton(finishedButton) {
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

// Export the function for use in other files
module.exports = {
    initFinishedButton
};