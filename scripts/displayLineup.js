console.log("Starting displayLineup.js...");

document.addEventListener("DOMContentLoaded", async function () {
  // Verify lineup-container exists
  const lineupContainer = document.getElementById("lineup-container");

  if (!lineupContainer) {
    console.error("lineup-container element not found in the DOM.");
    return; // Stop execution if lineup-container is missing
  }

  try {
    // Fetch lineup data from the backend
    const response = await fetch("https://livestock-lineup.onrender.com/api/lineups");
    if (!response.ok) {
        throw new Error(`Failed to fetch lineups: ${response.statusText}`);
    }

    const showLineups = await response.json();
    console.log("Retrieved lineups from backend:", showLineups);

    if (showLineups.length === 0) {
        lineupContainer.innerHTML = "<p>No lineups saved.</p>";
        console.warn("No lineups found in the backend.");
        return;
    }

  // Render the lineups
  showLineups.forEach((lineup, index) => {
    const showDiv = document.createElement("div");

    const showTitle = document.createElement("h3");
    showTitle.textContent = `Lineup ${index + 1}: Category: ${lineup.category} - Show: ${lineup.show}`;
    showDiv.appendChild(showTitle);

    // Create a breed list
    const breedList = document.createElement("ul");

    lineup.breeds.forEach((breed) => {
      const breedItem = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      checkbox.addEventListener("click", async () => {
        if (checkbox.checked) {
          try {
            // Fetch exhibitor entries from the backend
            const exhibitorResponse = await fetch("https://livestock-lineup.onreder.com/api/all-exhibitors");
            const exhibitorEntries = await exhibitorResponse.json();

            // Validate exhibitorEntries and check if the breed matches
            const isBreedSelectedByExhibitor = exhibitorEntries.some((exhibitor) =>
              exhibitor.submissions.some((submission) =>
                submission.breeds.includes(breed)
              )
            );

            if (!isBreedSelectedByExhibitor) {
              console.warn(`Breed ${breed} is not selected by the exhibitor.`);
              return; // Exit if the breed is not selected by any exhibitor
            }

            // If the breed matches, send the notification
            const payload = {
              breed,
              category: lineup.category,
              show: lineup.show,
            };
            const response = await fetch("https://livestock-lineup.onrender.com/api/notifications", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (response.ok) {
              console.log(`Notification sent for breed: ${breed}`);
            } else {
              console.error(`Failed to send notification: ${response.statusText}`);
            }
          } catch (error) {
            console.error(`Error sending notification for breed: ${breed}`, error);
          }
        }
      });

      const label = document.createElement("label");
      label.textContent = breed;

      breedItem.appendChild(checkbox);
      breedItem.appendChild(label);
      breedList.appendChild(breedItem);
    });

    showDiv.appendChild(breedList);
    lineupContainer.appendChild(showDiv);
  });

  console.log("Lineups rendered successfully!");

  // Check for notifications
  async function checkForNotifications() {
    try {
      // Example notifications (replace with actual logic if needed)
      const notifications = [
        { breed: "Holland Lop" },
        { breed: "Netherland Dwarf" },
      ];

      // Fetch exhibitor entries from the backend
      const exhibitorResponse = await fetch("https://livestock-lineup.onrender.com/api/all-exhibitors");
      const exhibitorEntries = await exhibitorResponse.json();

      if (!exhibitorEntries || exhibitorEntries.length === 0) {
        console.warn("No exhibitor entries found.");
        return; // Exit if no entries are found
      }

      // Check if any notification breed matches the exhibitor's selected breeds
      notifications.forEach((notification) => {
        const isBreedSelectedByExhibitor = exhibitorEntries.some((exhibitor) =>
          exhibitor.submissions.some((submission) =>
            submission.breeds.includes(notification.breed)
          )
        );

        if (isBreedSelectedByExhibitor) {
          // Use the custom notification function from alert.js
          if (typeof notifyUser === "function") {
            notifyUser(notification.breed);
          } else {
            console.warn("notifyUser is not defined.");
          }
        }
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  setInterval(checkForNotifications, 5000);
});
