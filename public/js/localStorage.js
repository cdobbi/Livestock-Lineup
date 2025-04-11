/**
 * LocalStorage handler for Lineup management
 */

// Key used to store lineups in localStorage
const LINEUP_STORAGE_KEY = 'livestock-lineups';

/**
 * Save a new lineup to localStorage
 * @param {Object} lineup - The lineup object to save
 */
export function saveLineup(lineup) {
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
export function getLineups() {
    const lineupsJson = localStorage.getItem(LINEUP_STORAGE_KEY);
    return lineupsJson ? JSON.parse(lineupsJson) : [];
}

/**
 * Check if there are any saved lineups
 * @returns {Boolean} True if lineups exist in storage
 */
export function hasLineups() {
    return getLineups().length > 0;
}

/**
 * Clear all lineups from localStorage
 */
export function clearLineups() {
    localStorage.removeItem(LINEUP_STORAGE_KEY);
    console.log('All lineups cleared from localStorage');
}

/**
 * Get the count of saved lineups
 * @returns {Number} Number of saved lineups
 */
export function getLineupCount() {
    return getLineups().length;
}