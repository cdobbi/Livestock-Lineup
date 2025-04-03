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
      checkbox.style.marginRight = "15px";

      // Add checkbox click functionality for notifications
      checkbox.addEventListener("click", async () => {
        if (checkbox.checked) {
          try {
            const payload = {
              breed,
              category: lineup.category,
              show: lineup.show,
            };
            const response = await fetch("/notify", {
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
      const notifications = [
        { breed: "Holland Lop" },
        { breed: "Netherland Dwarf" }
      ];

      const exhibitorEntries = JSON.parse(localStorage.getItem("exhibitorEntries"));

      notifications.forEach((notification) => {
        if (exhibitorEntries && exhibitorEntries.breeds.includes(notification.breed)) {
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
