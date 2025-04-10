document.addEventListener("DOMContentLoaded", async () => {
    // Initialize Pusher for notifications
    const pusherInstance = await initializePusher();
    if (!pusherInstance) {
        console.error("Failed to initialize Pusher. Notifications will not work.");
    }

    const breedOptionsContainer = document.getElementById("breed-options");
    const saveEntriesButton = document.getElementById("save-shows");
    const categorySelect = document.getElementById("category-select");
    const showSelect = document.getElementById("show-select");

    // Fetch and render breeds
    await fetchAndRenderBreeds("https://livestock-lineup.onrender.com/api/breeds", breedOptionsContainer);

    // Save shows when the button is clicked
    saveEntriesButton.addEventListener("click", async function () {
        const selectedCategory = categorySelect.value;
        const selectedShow = showSelect.value;

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
        const shows = {
            category: selectedCategory,
            show: selectedShow,
            breeds: selectedBreeds,
        };

        try {
            const response = await fetch("https://livestock-lineup.onrender.com/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(shows),
            });

            if (response.ok) {
                alert("Your shows have been saved. You will be notified when your breed is called.");
            } else {
                console.error("Failed to save shows:", await response.text());
                alert("Failed to save shows. Please try again.");
            }
        } catch (error) {
            console.error("Error saving shows:", error);
            alert("An error occurred while saving your shows.");
        }
    });

    // Use Pusher for real-time notifications
    const channel = pusherInstance.channel;
    channel.bind("breed-notification", (data) => {
        const { breed, category, show } = data;
        alert(`Notification for Category: ${category}, Show: ${show}, Breed: ${breed}`);
        try {
            const notificationSound = new Audio("/sounds/alert.mp3");
            notificationSound.play();
        } catch (error) {
            console.error("Error playing notification sound:", error);
        }
    });
});