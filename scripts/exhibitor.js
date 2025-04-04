document.addEventListener("DOMContentLoaded", async function () {
    const breedOptionsContainer = document.getElementById("breed-options");
    const saveEntriesButton = document.getElementById("save-entries");
    const categorySelect = document.getElementById("category-select"); // Added for category
    const showSelect = document.getElementById("show-select"); // Added for show

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

    // Fetch breed data from data.json
    fetch("/data/data.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (!data.entries || !Array.isArray(data.entries)) {
                console.error("Error: 'entries' is missing or is not an array in the fetched data.");
                return;
            }

            // Ensure the breed-options container exists in the DOM
            if (!breedOptionsContainer) {
                console.error("Error: 'breed-options' container not found in the DOM.");
                return;
            }

            // Iterate over the breed entries to dynamically create buttons
            data.entries.forEach((entry) => {
                const breedButton = document.createElement("button");
                breedButton.className = "breed-button";
                breedButton.textContent = entry.breed;

                // Add a click event listener to toggle the selected class
                breedButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    breedButton.classList.toggle("selected");
                    console.log(`Button clicked for breed: ${entry.breed}`);
                });

                // Append the dynamically created button to the breed-options container
                breedOptionsContainer.appendChild(breedButton);
            });

            console.log("Breed options successfully fetched and rendered.");
        })
        .catch((error) => {
            console.error("Error fetching or processing breed data:", error);
        });

    // Save entries when the button is clicked
    saveEntriesButton.addEventListener("click", async function () {
        // Get selected category and show
        const selectedCategory = categorySelect.value;
        const selectedShow = showSelect.value;

        // Check that both category and show are selected
        if (!selectedCategory || !selectedShow) {
            alert("Please select both a category and a show.");
            return;
        }

        // Collect selected breeds
        const selectedBreeds = [];
        const selectedButtons = breedOptionsContainer.querySelectorAll(".breed-button.selected");

        selectedButtons.forEach((button) => {
            selectedBreeds.push(button.textContent);
        });

        if (selectedBreeds.length === 0) {
            alert("Please select at least one breed to start the application.");
            return;
        }

        // Create the entry object to send to the backend
        const entries = {
            category: selectedCategory,
            show: selectedShow,
            breeds: selectedBreeds,
        };

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

    // Check for notifications
    async function checkForNotifications() {
        try {
            const notifications = [
                { breed: "Holland Lop" },
                { breed: "Netherland Dwarf" },
            ];

            const exhibitorEntries = JSON.parse(localStorage.getItem("exhibitorEntries"));

            if (!exhibitorEntries || !Array.isArray(exhibitorEntries.breeds) || exhibitorEntries.breeds.length === 0) {
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
