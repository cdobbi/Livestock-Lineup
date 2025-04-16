export function initStartApplication() {
    const startButton = document.getElementById("start");
    const notificationMessage = document.getElementById("notification-message");

    if (!startButton) {
        console.error("Start Application button not found!");
        return;
    }

    startButton.addEventListener("click", () => {
        // Set the notification text; adjust the message as needed.
        if (notificationMessage) {
            notificationMessage.innerHTML = `
          <div class="notification-card">
            <p>
              You will be notified when it's time to take your rabbit to the judges table.<br>
              <br>Leave your volume up.<br><br>🐇🐇 - Hopping to it!...
            </p>
          </div>
        `;
            notificationMessage.style.display = "block";
            // Automatically hide the notification after 5 seconds.
            setTimeout(() => {
                notificationMessage.style.display = "none";
            }, 5000);
        } else {
            alert("Leave your phone's volume up, and you will be notified when it's time to take your submissions.");
        }
    });
}
