// Does this file need to go into the uiHandlers.bundle.js file? Also which html file does it belong in if any? If it doesn't belong in an HTML or any of the other files, how is it initialized, called or used? What is it's purpose? Please, verify, ensure that this file is updated to use ES Modals and dont use the weird notations. ensure that all variables, functions, and wording are consistent across files and that everything links properly.

export async function saveLineup(category, show, selectedBreeds, apiEndpoint, organizerId) {
    if (!category || !show || selectedBreeds.length === 0) {
        alert("Please select a category, show, and at least one breed.");
        return;
    }

    try {
        const lineup = { category, show, breeds: selectedBreeds };
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ organizerId, lineups: [lineup] }),
        });

        if (response.ok) {
            alert("Lineup saved successfully!");
        } else {
            console.error("Failed to save lineup:", response.statusText);
            alert("Failed to save lineup. Please try again.");
        }
    } catch (error) {
        console.error("Error saving lineup:", error);
        alert("An error occurred while saving the lineup.");
    }
}
