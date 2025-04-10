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