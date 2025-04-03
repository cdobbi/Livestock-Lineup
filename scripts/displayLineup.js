console.log("Starting displayLineup.js...");

document.addEventListener("DOMContentLoaded", function () {
  // Verify lineup-container exists
  const lineupContainer = document.getElementById("lineup-container");

  if (!lineupContainer) {
    console.error("lineup-container element not found in the DOM.");
    return; // Stop execution if lineup-container is missing
  }

  const showLineups = JSON.parse(localStorage.getItem("showLineups")) || [];
  console.log("Retrieved lineups from localStorage:", showLineups);

  if (showLineups.length === 0) {
    lineupContainer.innerHTML = "<p class='text-muted'>No lineups saved.</p>";
    console.warn("No lineups found in localStorage.");
    return;
  }

  // Render the lineups
  showLineups.forEach((lineup, index) => {
    const showDiv = document.createElement("div");
    showDiv.classList.add("col-12", "mb-4");

    const showTitle = document.createElement("h3");
    showTitle.textContent = `Lineup ${index + 1}: Category: ${lineup.category} - Show: ${lineup.show}`;
    showDiv.appendChild(showTitle);

    // Create a breed list
    const breedList = document.createElement("ul");
    breedList.style.listStyleType = "none";

    lineup.breeds.forEach((breed, breedIndex) => {
      const breedItem = document.createElement("li");
      breedItem.classList.add("form-check", "d-flex", "align-items-center", "mb-2");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("form-check-input");
      checkbox.style.width = "44px";
      checkbox.style.height = "44px";
      checkbox.style.marginRight = "25px";

      checkbox.addEventListener("click", async () => {
        if (checkbox.checked) {
          try {
            // Retrieve exhibitor entries from localStorage
            const exhibitorEntries = JSON.parse(localStorage.getItem("exhibitorEntries"));
      
            // Validate exhibitorEntries and check if the breed matches
            if (!exhibitorEntries || !Array.isArray(exhibitorEntries.breeds) || !exhibitorEntries.breeds.includes(breed)) {
              console.warn(`Breed ${breed} is not selected by the exhibitor.`);
              return; // Exit if the breed is not selected by the exhibitor
            }
      
            // If the breed matches, send the notification
            const payload = {
              breed,
              category: lineup.category,
              show: lineup.show,
            };
            const response = await fetch("https://Livestock-Lineup.onrender.com/notify", {
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
      label.style.fontSize = "20px";

      breedItem.appendChild(checkbox);
      breedItem.appendChild(label);
      breedList.appendChild(breedItem);
    });

    showDiv.appendChild(breedList);
    lineupContainer.appendChild(showDiv);
  });

  console.log("Lineups rendered successfully!");

  // Example check for notifications (using a hard-coded list) – update as necessary
  async function checkForNotifications() {
    try {
      // Example notifications (replace with actual logic if needed)
      const notifications = [
        { breed: "Holland Lop" },
        { breed: "Netherland Dwarf" },
      ];
  
      // Retrieve exhibitor entries from localStorage
      const exhibitorEntries = JSON.parse(localStorage.getItem("exhibitorEntries"));
  
      if (!exhibitorEntries || !exhibitorEntries.breeds || exhibitorEntries.breeds.length === 0) {
        console.warn("No exhibitor entries found.");
        return; // Exit if no entries are found
      }
  
      // Check if any notification breed matches the exhibitor's selected breeds
      notifications.forEach((notification) => {
        if (exhibitorEntries.breeds.includes(notification.breed)) {
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
