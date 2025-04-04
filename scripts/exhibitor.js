document.addEventListener("DOMContentLoaded", async function () {
    const breedOptionsContainer = document.getElementById("breed-options");
    const saveEntriesButton = document.getElementById("save-entries");

    // Fetch saved entries from the backend
    try {
        const response = await fetch("https://livestock.lineup.onrender.com/get-entries");
        if (response.ok) {
            const data = await response.json();
            const savedBreeds = data.breeds || [];

            savedBreeds.forEach((breed) => {
                const button = Array.from(breedOptionsContainer.querySelectorAll(".breed-button"))
                    .find((btn) => btn.textContent === breed);

                if (button) {
                    button.classList.add("selected");
                }
            });
        } else {
            console.error("Failed to fetch saved entries.");
        }
    } catch (error) {
        console.error("Error fetching saved entries:", error);
    }

    // Existing code for Pusher configuration
    const pusherConfig = await fetch("/pusher-config")
        .then((response) => response.json())
        .catch((error) => {
            console.error("Error fetching Pusher configuration:", error);
            return null;
        });
    
    if (!pusherConfig) {
      alert("Failed to load Pusher configuration. Notifications will not work.");
      return;
    }
  
    const pusher = new Pusher(pusherConfig.key, {
      cluster: pusherConfig.cluster,
    });
  
    const channel = pusher.subscribe("table-time");
  
    // Use custom notification on Pusher events
    channel.bind("breed-notification", (data) => {
      if (typeof notifyUser === "function") {
        notifyUser(data.breed);
      } else {
        // Fallback if notifyUser is not defined
        alert(`Your breed (${data.breed}) is up next!`);
        const notificationSound = new Audio("sounds/alert.mp3");
        notificationSound.play();
      }
    });
  
    fetch("/data/data.json")
      .then((response) => response.json())
      .then((data) => {
        data.entries.forEach((entry) => {
          const breedButton = document.createElement("button");
          breedButton.className = "breed-button";
          breedButton.textContent = entry.breed;
  
          breedButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent page reload
            breedButton.classList.toggle("selected"); // Toggle the selected class
          });
  
          breedOptionsContainer.appendChild(breedButton);
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  
    saveEntriesButton.addEventListener("click", async function () {
      const selectedBreeds = [];
      const selectedButtons = breedOptionsContainer.querySelectorAll(".breed-button.selected");
  
      selectedButtons.forEach((button) => {
        selectedBreeds.push(button.textContent);
      });
  
      if (selectedBreeds.length === 0) {
        alert("Please select at least one breed to start the application.");
        return;
     }

      const entries = { breeds: selectedBreeds };

      try {
        const response = await fetch("https://livestock.lineup.onrender.com/api/save-entries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entries),
        });

        if (response.ok) {
            alert("Your entries have been saved. You will be notified when your breed is called.");
        } else {
            alert("Failed to save entries. Please try again.");
        }
      } catch (error) {
          console.error("Error saving entries:", error);
          alert("An error occurred while saving your entries.");
      }
    });
  
    async function checkForNotifications() {
        try {
          const notifications = [
            { breed: "Holland Lop" },
            { breed: "Netherland Dwarf" }
          ];
  
          const exhibitorEntries = JSON.parse(localStorage.getItem("exhibitorEntries"));
  
          // Check if exhibitorEntries is valid
          if (!exhibitorEntries || !Array.isArray(exhibitorEntries.breeds) || exhibitorEntries.breeds.length === 0) {
            // Exit silently if no valid entries are found
            return;
          }
  
          notifications.forEach((notification) => {
            if (exhibitorEntries.breeds.includes(notification.breed)) {
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
  