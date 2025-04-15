// lineupSubmission.js
export async function submitExhibitorLineup(exhibitorId, showId, categoryId, breedIds) {
    try {
      const payload = { exhibitor_id: exhibitorId, showId, categoryId, breedIds };
      const response = await fetch("https://livestock-lineup.onrender.com/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error("Failed to save submission: " + response.statusText);
      }
    } catch (error) {
      console.error("Error in submitExhibitorLineup:", error);
      throw error;
    }
  }
  