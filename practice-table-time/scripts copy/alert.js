document.addEventListener("DOMContentLoaded", function () {
  // Enable Pusher logging - don't include this in production
  Pusher.logToConsole = true;

  var pusher = new Pusher("999673f7c045421210be", {
    cluster: "us3",
  });

  var channel = pusher.subscribe("my-channel");
  channel.bind("my-event", function (data) {
    // Check if the browser supports notifications and service workers
    if ("Notification" in window && "serviceWorker" in navigator) {
      // Request permission to display notifications
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          // Subscribe to push notifications
          navigator.serviceWorker.ready.then(function (registration) {
            registration.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey:
                  "BOof9myOTsT1d4hX0gUOCizYg93nwztm_4cd5U1cBBOW2x0dRxFym9qjSwSiDSUiRuMncym9qjSwSiDSUiRuMncM4sqEfNEB7vhXNV-tw", // Replace with your actual VAPID public key
              })
              .then(function (subscription) {
                console.log("Subscribed to push notifications:", subscription);

                // Send subscription to server
                fetch("http://localhost:3000/send-notification", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    subscription: subscription,
                    message: data.message,
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log("Notification sent:", data);
                  })
                  .catch((error) => {
                    console.error("Error sending notification:", error);
                  });
              })
              .catch(function (error) {
                console.error(
                  "Failed to subscribe to push notifications:",
                  error
                );
              });
          });
        }
      });
    } else {
      // Fallback for browsers that do not support notifications
      alert(data.message);
    }
  });
});
