const { hasLineups, getLineups, clearLineups } = require('./localStorage.js');

// Initialize Finished button functionality
function initFinishedButton(finishedButton) {
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

// Export the function for use in other files
module.exports = {
    initFinishedButton
};