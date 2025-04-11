// Does this file need to go into the uiHandlers.bundle.js file? Also which html file does it belong in if any? If it doesn't belong in an HTML or any of the other files, how is it initialized, called or used? What is it's purpose? Please, verify, ensure that this file is updated to use ES Modals and dont use the weird notations. ensure that all variables, functions, and wording are consistent across files and that everything links properly.


const { clearLineups } = require('./localStorage.js');

// Initialize Clear Lineup button functionality
function initClearLineupButton(clearLineupButton) {
    if (clearLineupButton) {
        clearLineupButton.addEventListener("click", () => {
            // Clear lineups from localStorage
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

// Export the function for use in other files
module.exports = {
    initClearLineupButton
};