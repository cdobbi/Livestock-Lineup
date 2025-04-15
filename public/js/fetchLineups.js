// fetchLineups.js

/**
 * fetchAndRenderLineups:
 *  - Fetches lineup data from the backend at "/api/lineups".
 *  - Logs and attaches the fetched data to window.showLineups (for debugging purposes).
 *  - Calls renderLineups() to render the data.
 */
export async function fetchAndRenderLineups(lineupContainer, selectedShowId) {
    try {
      const url = `/api/lineups`; // Adjust URL if needed.
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching lineups: ${response.statusText}`);
      }
      const showLineups = await response.json();
      console.log("Retrieved lineups:", showLineups);
      // Attach the data to a global variable for easy debugging:
      window.showLineups = showLineups;
      renderLineups(lineupContainer, showLineups);
    } catch (error) {
      console.error("Error fetching or rendering lineups:", error);
      lineupContainer.innerHTML =
        "<p>Failed to load lineups. Please try again later.</p>";
    }
  }
  /**
   * renderLineups:
   *  - Expects showLineups to be an array of objects.
   *  - Groups the entries by category (using entry.category_name)
   *    and by show (using "Show " + entry.show_id).
   *  - For each breed, creates a clickable list item. When clicked,
   *    it logs the event and calls testNotificationSound (which should
   *    already be attached to window by your pusherNotifications.js file).
   */
  export function renderLineups(lineupContainer, showLineups) {
    console.log("Rendering lineups...");
    lineupContainer.innerHTML = "";
  
    // Check if showLineups is a nonempty array.
    if (Array.isArray(showLineups) && showLineups.length > 0) {
      // Group entries by category and then by show.
      const grouped = {};
      showLineups.forEach((entry) => {
        const category = entry.category_name || "Unknown Category";
        const show = "Show " + (entry.show_id || "Unknown");
        if (!grouped[category]) {
          grouped[category] = {};
        }
        if (!grouped[category][show]) {
          grouped[category][show] = [];
        }
        grouped[category][show].push(entry.breed_name);
      });
      console.log("Grouped lineups:", grouped);
  
      // Render the grouped data.
      Object.keys(grouped).forEach((category) => {
        Object.keys(grouped[category]).forEach((show) => {
          // Create a container for this category and show.
          const showDiv = document.createElement("div");
          showDiv.classList.add("lineup", "mb-4", "p-3", "border", "rounded");
  
          // Display a title.
          const showTitle = document.createElement("h3");
          showTitle.textContent = `Category: ${category} - ${show}`;
          showTitle.classList.add("text-primary");
          showDiv.appendChild(showTitle);
  
          // Create a list for the breeds.
          const breedList = document.createElement("ul");
          breedList.classList.add("list-group");
  
          // Create a list item for each breed.
          grouped[category][show].forEach((breed) => {
            const breedItem = document.createElement("li");
            breedItem.classList.add("list-group-item");
  
            // Create a label that is clickable.
            const label = document.createElement("label");
            label.textContent = breed;
            label.style.cursor = "pointer";
            label.addEventListener("click", (event) => {
              event.stopPropagation();
              console.log(`Breed ${breed} clicked in lineup: Category ${category}, ${show}`);
              if (typeof window.testNotificationSound === "function") {
                window.testNotificationSound();
              } else {
                console.warn("testNotificationSound is not available.");
              }
            });
  
            breedItem.appendChild(label);
            breedList.appendChild(breedItem);
          });
  
          showDiv.appendChild(breedList);
          lineupContainer.appendChild(showDiv);
        });
      });
    } else {
      console.warn("showLineups is not a nonempty array. Rendering raw data for debugging:");
      lineupContainer.innerHTML = "<pre>" + JSON.stringify(showLineups, null, 2) + "</pre>";
    }
  }
  
  /* 
  // Uncomment the block below to test with hardcoded sample data instead of the API:
  
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("lineup-container");
    if (!container) {
      console.error("lineup-container not found");
      return;
    }
    const sampleData = [
      { category_name: "Lop", show_id: 1, breed_name: "American Lop" },
      { category_name: "Lop", show_id: 1, breed_name: "Dutch Lop" },
      { category_name: "Lop", show_id: 2, breed_name: "English Lop" }
    ];
    console.log("Using sampleData:", sampleData);
    renderLineups(container, sampleData);
  });
  */
  
  // Auto-initialize: fetch and render lineups when the DOM is ready.
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("lineup-container");
    if (!container) {
      console.error("lineup-container not found in the DOM.");
      return;
    }
    // Uncomment the next line if you want to fetch data from your backend.
    fetchAndRenderLineups(container, null);
  });
  