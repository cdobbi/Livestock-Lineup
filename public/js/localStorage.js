const LINEUP_STORAGE_KEY = 'livestock-lineups';

// Save a new lineup to localStorage
function saveLineup(lineup) {
    const lineups = getLineups();
    lineups.push(lineup);
    localStorage.setItem(LINEUP_STORAGE_KEY, JSON.stringify(lineups));
}

// Get all saved lineups from localStorage
function getLineups() {
    const lineupsJson = localStorage.getItem(LINEUP_STORAGE_KEY);
    return lineupsJson ? JSON.parse(lineupsJson) : [];
}

// Check if there are any saved lineups
function hasLineups() {
    return getLineups().length > 0;
}

// Clear all lineups from localStorage
function clearLineups() {
    localStorage.removeItem(LINEUP_STORAGE_KEY);
}

// Export the functions for use in other files
module.exports = {
    saveLineup,
    getLineups,
    hasLineups,
    clearLineups
};