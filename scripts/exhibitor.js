document.addEventListener("DOMContentLoaded", async function () {
    const breedOptionsContainer = document.getElementById("breed-options");
    const saveEntriesButton = document.getElementById("save-entries");
  
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
    
    
  
    saveEntriesButton.addEventListener("click", function () {
      const selectedBreeds = [];
      const selectedButtons = breedOptionsContainer.querySelectorAll(".breed-button.selected");
  
      selectedButtons.forEach((button) => {
        selectedBreeds.push(button.textContent);
      });
        
      const categoryDropdown = document.getElementById("category");
      const showDropdown = document.getElementById("show");
    
      const selectedCategory = categoryDropdown.value;
      const selectedShow = showDropdown.value;
  
      if (selectedBreeds.length === 0) {
        alert("Please select at least one breed to start the application.");
        localStorage.removeItem("exhibitorEntries"); // Clear stale data
      } else {
          const entries = {
            category: selectedCategory,  // Add category
              breeds: selectedBreeds,
                show: selectedShow, // Add show
          };
          localStorage.setItem("exhibitorEntries", JSON.stringify(entries));
          alert(`${selectedCategory}, ${selectedShow}, ${selectedBreeds.join(", ")} saved. You will be notified when your breed is called.`);
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
  