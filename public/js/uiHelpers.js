export function notifyUser(breed) {
    const notificationSound = new Audio("./sounds/alrt.mp3");
    notificationSound.play();

    setTimeout(() => {
        showModal(`${breed} is up next!\nTake ${breed} to [show].\nGood luck!`);
    }, 500);
}

export function showModal(message) {
    const modal = document.getElementById("notificationModal");
    if (!modal) {
        alert(message);
        return;
    }
    document.getElementById("modalMessage").innerText = message;
    modal.style.display = "block";

    setTimeout(() => {
        modal.style.display = "none";
    }, 5000);
}