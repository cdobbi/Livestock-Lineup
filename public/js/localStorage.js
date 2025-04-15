export function hasLineups() {
    // Check if "lineups" exists in localStorage.
    return localStorage.getItem("lineups") !== null;
}

export function getLineups() {
    // Retrieve and parse the "lineups" data
    const lineups = localStorage.getItem("lineups");
    return lineups ? JSON.parse(lineups) : [];
}

export function clearLineups() {
    // Remove the "lineups" data from localStorage.
    localStorage.removeItem("lineups");
}

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

