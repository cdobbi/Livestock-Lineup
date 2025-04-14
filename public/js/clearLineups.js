// clearLineups.js
export function initClearLineupButton(clearLineupButton) {
    clearLineupButton.addEventListener("click", async () => {
      if (confirm("Are you sure you want to clear ALL saved lineups?")) {
        try {
          const response = await fetch("/api/lineups", { method: "DELETE" });
          if (response.ok) {
            alert("All lineups cleared successfully.");
          } else {
            alert("Failed to clear lineups.");
          }
        } catch (err) {
          console.error("Error clearing lineups:", err);
          alert("Error clearing lineups.");
        }
      }
    });
  }
