export async function submitExhibitorLineup(exhibitorId, showId, categoryId, breedIds) {
    try {
      const payload = { exhibitor_id: exhibitorId, showId, categoryId, breedIds };
      console.log("Submitting payload:", payload); // Log the payload to debug what's being sent
  
      const response = await fetch("https://livestock-lineup.onrender.com/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      // Log the raw response status for further debugging
      console.log("Response status:", response.status, response.statusText);
  
      if (response.ok) {
        const result = await response.json();
        console.log("Received submission response:", result); // Log result from API
        return result;
      } else {
        // Read the error message from the body only once
        const errorResult = await response.json();
        console.error("Failed to save submission:", errorResult.message);
        throw new Error("Failed to save submission: " + response.statusText);
      }
    } catch (error) {
      console.error("Error in submitExhibitorLineup:", error);
      throw error;
    }
  }
  