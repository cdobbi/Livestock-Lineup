const LINEUP_STORAGE_KEY = 'livestock-lineups';

export function saveLineup(lineup) {
    const lineups = getLineups();
    lineups.push(lineup);
    localStorage.setItem(LINEUP_STORAGE_KEY, JSON.stringify(lineups));
}

export function getLineups() {
    const lineupsJson = localStorage.getItem(LINEUP_STORAGE_KEY);
    return lineupsJson ? JSON.parse(lineupsJson) : [];
}

export function clearLineups() {
    localStorage.removeItem(LINEUP_STORAGE_KEY);
}