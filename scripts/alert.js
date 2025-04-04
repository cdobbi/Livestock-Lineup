document.addEventListener("DOMContentLoaded", function () {
    const notificationSound = new Audio("/sounds/alert.mp3");
    const displayedNotifications = new Set();
    function showModal(message) {
        const modal = document.getElementById("notificationModal");
        if (!modal) {
            alert(message);
            return;
        }
        document.getElementById("modalMessage").innerText = message;
        modal.style.display = "block";
        
        // Auto-dismiss after 5 seconds (5000ms)
        setTimeout(() => {
            modal.style.display = "none";
        }, 5000);
      }
      
      function notifyUser(breed) {
      notificationSound.play();
      setTimeout(() => {
        showModal(`Your breed (${breed}) is up next!`);
      }, 500);
    }
  
    async function checkForNotifications() {
      const exhibitorEntries = JSON.parse(localStorage.getItem("exhibitorEntries"));
      if (!exhibitorEntries || !exhibitorEntries.breeds) {
        console.warn("No exhibitor entries found.");
        return;
      }
  
      try {
        const response = await fetch("https://livestock-lineup.onrender.com/api/notifications");
        if (!response.ok) {
          throw new Error("Failed to fetch notifications.");
        }
        const notifications = await response.json();
        notifications.forEach((notification) => {
          if (
            !displayedNotifications.has(notification.breed) &&
            exhibitorEntries.breeds.includes(notification.breed)
          ) {
            displayedNotifications.add(notification.breed);
            // Instead of showing a native alert, we use our custom function
            notifyUser(notification.breed);
          }
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  
    setInterval(checkForNotifications, 30000);  
    // Expose notifyUser globally so other files (like exhibitor.js and displayLineup.js) can use it
    window.notifyUser = notifyUser;
  });