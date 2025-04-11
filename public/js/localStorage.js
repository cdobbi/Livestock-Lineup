/**
 * LocalStorage handler for Lineup management
 * Provides functions to save, retrieve, and clear lineups in browser storage
 */

// Key used to store lineups in localStorage
const LINEUP_STORAGE_KEY = 'livestock-lineups';

/**
 * Save a new lineup to localStorage
 * @param {Object} lineup - The lineup object to save
 */
function saveLineup(lineup) {
    // Get existing lineups
    const lineups = getLineups();
    
    // Add the new lineup
    lineups.push(lineup);
    
    // Save back to localStorage
    localStorage.setItem(LINEUP_STORAGE_KEY, JSON.stringify(lineups));
    console.log('Lineup saved to localStorage:', lineup);
}

/**
 * Get all saved lineups from localStorage
 * @returns {Array} Array of lineup objects
 */
function getLineups() {
    const lineupsJson = localStorage.getItem(LINEUP_STORAGE_KEY);
    return lineupsJson ? JSON.parse(lineupsJson) : [];
}

/**
 * Check if there are any saved lineups
 * @returns {Boolean} True if lineups exist in storage
 */
function hasLineups() {
    return getLineups().length > 0;
}

/**
 * Clear all lineups from localStorage
 */
function clearLineups() {
    localStorage.removeItem(LINEUP_STORAGE_KEY);
    console.log('All lineups cleared from localStorage');
}

/**
 * Get the count of saved lineups
 * @returns {Number} Number of saved lineups
 */
function getLineupCount() {
    return getLineups().length;
}

// Export all functions
export {
    saveLineup,
    getLineups,
    hasLineups,
    clearLineups,
    getLineupCount
};