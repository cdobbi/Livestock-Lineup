import { validateAndSendNotification } from "./validateAndSendNotification.js";

// ========================
// FETCH & RENDER LINEUPS
// ========================

/**
 * Fetches lineup data from the backend and renders it.
 */
export async function fetchAndRenderLineups(lineupContainer, selectedShowId) {
  try {
    const url = `/api/lineups`; // Adjust URL or append query parameters as needed.
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching lineups: ${response.statusText}`);
    }
    // Parse the JSON data.
    const showLineups = await response.json();
    console.log("Retrieved lineups:", showLineups);
    
    // Render the lineups.
    renderLineups(lineupContainer, showLineups);
  } catch (error) {
    console.error("Error fetching or rendering lineups:", error);
    lineupContainer.innerHTML = "<p>Failed to load lineups. Please try again later.</p>";
  }
}
  
/**
 * Renders the lineup data into the provided container.
 * Assumes that showLineups is an array of objects with properties:
 *   - category_name
 *   - show_id       (you can replace this with show_name if your API returns that)
 *   - breed_name
 */
export function renderLineups(lineupContainer, showLineups) {
  console.log("Clearing lineup container...");
  lineupContainer.innerHTML = "";
  
  // Check if we received an array of lineup entries.
  if (Array.isArray(showLineups)) {
    // Group entries by category and then by show.
    const grouped = {};
    showLineups.forEach(entry => {
      const category = entry.category_name;
      // For the show, if you have a show_name field instead of show_id, use that.
      const show = "Show " + entry.show_id;
      if (!grouped[category]) {
        grouped[category] = {};
      }
      if (!grouped[category][show]) {
        grouped[category][show] = [];
      }
      grouped[category][show].push(entry.breed_name);
    });
    
    // Iterate over the grouped data to build the HTML.
    Object.keys(grouped).forEach(category => {
      Object.keys(grouped[category]).forEach(show => {
        const showDiv = document.createElement("div");
        showDiv.classList.add("lineup", "mb-4", "p-3", "border", "rounded");

        const showTitle = document.createElement("h3");
        showTitle.textContent = `Category: ${category} - ${show}`;
        showTitle.classList.add("text-primary");
        showDiv.appendChild(showTitle);

        const breedList = document.createElement("ul");
        breedList.classList.add("list-group");

        grouped[category][show].forEach(breed => {
          const breedItem = document.createElement("li");
          breedItem.classList.add("list-group-item");

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.id = `checkbox-${breed}`;
          checkbox.classList.add("breed-checkbox");

          const label = document.createElement("label");
          label.htmlFor = `checkbox-${breed}`;
          label.textContent = breed;
          label.style.cursor = "pointer";

          // On label click, log the event and trigger the notification.
          label.addEventListener("click", (event) => {
            event.stopPropagation();
            console.log(`Breed ${breed} clicked in lineup: Category ${category}, ${show}`);
            // Call the imported validateAndSendNotification function.
            validateAndSendNotification(breed, category, show);
          });

          breedItem.appendChild(checkbox);
          breedItem.appendChild(label);
          breedList.appendChild(breedItem);
        });

        showDiv.appendChild(breedList);
        lineupContainer.appendChild(showDiv);
      });
    });
  } else {
    console.warn("showLineups is not an array. Cannot render lineups.");
  }
}
  
// ========================
// NOTIFICATION & AUXILIARY FUNCTIONS (INTACT)
// ========================

// Create the notification sound and a Set to track notified breeds.
const notificationSound = new Audio("../sounds/alert.mp3");
const displayedNotifications = new Set();

function showModal(message) {
  const modal = document.getElementById("notificationModal");
  if (!modal) {
    alert(message);
    return;
  }
  document.getElementById("modalMessage").innerText = message;
  modal.style.display = "block";

  // Auto-dismiss after 5 seconds.
  setTimeout(() => {
    modal.style.display = "none";
  }, 5000);
}

function notifyUser(breed) {
  notificationSound.play();
  setTimeout(() => {
    // Note: "show" is referenced here but is not defined. Adjust as needed.
    showModal(`${breed} is up next!\nTake ${breed} to [show].\nGood luck!`);
  }, 500);
}
  
async function checkForNotifications() {
  try {
    const exhibitorResponse = await fetch("https://livestock-lineup.onrender.com/api/shows");
    if (!exhibitorResponse.ok) {
      throw new Error("Failed to fetch exhibitor entries.");
    }
    const exhibitorEntries = await exhibitorResponse.json();
    console.log("Exhibitor entries fetched:", exhibitorEntries);

    if (!exhibitorEntries || exhibitorEntries.length === 0) {
      console.warn("No exhibitor entries found.");
      return;
    }

    // Fetch notifications from the backend.
    const response = await fetch("https://livestock-lineup.onrender.com/api/notifications");
    if (!response.ok) {
      throw new Error("Failed to fetch notifications.");
    }
    const notifications = await response.json();

    // Check each notification by seeing if any exhibitor's submission includes the breed.
    notifications.forEach((notification) => {
      const isBreedSelectedByExhibitor = exhibitorEntries.some((exhibitor) => {
        // Ensure exhibitor.submissions is an array; otherwise use an empty array.
        const submissions = Array.isArray(exhibitor.submissions) ? exhibitor.submissions : [];
        return submissions.some((submission) => {
          // Ensure submission.breeds is an array; otherwise use an empty array.
          const breeds = Array.isArray(submission.breeds) ? submission.breeds : [];
          return breeds.includes(notification.breed);
        });
      });

      if (isBreedSelectedByExhibitor && !displayedNotifications.has(notification.breed)) {
        displayedNotifications.add(notification.breed);
        notifyUser(notification.breed);
      }
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}
  
setInterval(checkForNotifications, 30000);
  
// Expose notifyUser globally for use in other files.
window.notifyUser = notifyUser;
  
// ========================
// AUTO-INITIALIZE ON DOMContentLoaded
// ========================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("lineup-container");
  if (!container) {
    console.error("lineup-container not found on lineup.html");
    return;
  }
  // Fetch and render the saved lineups.
  fetchAndRenderLineups(container, null);
});
