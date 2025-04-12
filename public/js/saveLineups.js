export const saveLineup = async (category, show, selectedBreeds, apiEndpoint, organizerId) => {
    try {
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                category,
                show,
                breeds: selectedBreeds,
                organizerId,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to save lineup: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Lineup saved successfully:", result);
        alert("Lineup saved successfully!");
    } catch (error) {
        console.error("Error saving lineup:", error);
        alert("Failed to save lineup. Please try again.");
    }
};