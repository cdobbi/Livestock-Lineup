// saveLineups.js
export const saveLineup = async (categoryId, showId, selectedBreeds, apiEndpoint) => {
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          showId,
          breedIds: selectedBreeds,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save lineup: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log("Lineup saved successfully:", result);
      return result; // Return saved results so organizer.js can present a message.
    } catch (error) {
      console.error("Error saving lineup:", error);
      throw error;
    }
  };
  