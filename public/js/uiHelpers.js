// uiHelpers.js

export function notifyUser(breed) {
    // Use "/sounds/alert.mp3" for consistency with pusher notifications.
    const notificationSound = new Audio("/sounds/alert.mp3");
    notificationSound.play();

    // Wait 500ms before showing the modal (or alert fallback)
    setTimeout(() => {
        showModal(`${breed} is up next!\nTake ${breed} to [show].\nGood luck!`);
    }, 500);
}

export function showModal(message) {
    const modal = document.getElementById("notificationModal");
    if (!modal) {
        // Fallback in case no modal exists in the DOM.
        alert(message);
        return;
    }
    const modalMessage = document.getElementById("modalMessage");
    if (modalMessage) {
        modalMessage.innerText = message;
    }
    modal.style.display = "block";

    setTimeout(() => {
        modal.style.display = "none";
    }, 5000);
}
