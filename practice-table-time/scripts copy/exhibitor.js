document.addEventListener("DOMContentLoaded", function () {
  const breedOptionsContainer = document.getElementById("breed-options");
  const saveEntriesButton = document.getElementById("save-entries");

  // Fetch the data from the JSON file
  fetch("data/data.json")
    .then((response) => response.json())
    .then((data) => {
      // Populate breed options
      function populateBreedOptions() {
        // Clear existing breed options
        breedOptionsContainer.innerHTML = "";

        // Filter and display breeds
        data.entries.forEach((entry) => {
          const breedOption = document.createElement("div");
          breedOption.className = "form-check form-check-inline";

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "form-check-input";
          checkbox.id = entry.breed;
          checkbox.value = entry.breed;

          const label = document.createElement("label");
          label.className = "form-check-label";
          label.htmlFor = entry.breed;
          label.textContent = entry.breed;

          breedOption.appendChild(checkbox);
          breedOption.appendChild(label);
          breedOptionsContainer.appendChild(breedOption);
        });
      }

      // Initial population of breed options
      populateBreedOptions();
    })
    .catch((error) => console.error("Error fetching data:", error));

  // Event listener for the "Start Application" button
  saveEntriesButton.addEventListener("click", function () {
    const selectedBreeds = [];
    const checkboxes = breedOptionsContainer.querySelectorAll(
      "input[type=checkbox]"
    );
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedBreeds.push(checkbox.value);
      }
    });

    if (selectedBreeds.length === 0) {
      // Show error message if no breeds are selected
      const errorMessage = document.createElement("div");
      errorMessage.className = "alert alert-danger text-center";
      errorMessage.style.position = "fixed";
      errorMessage.style.top = "50%";
      errorMessage.style.left = "50%";
      errorMessage.style.transform = "translate(-50%, -50%)";
      errorMessage.style.zIndex = "1000";
      errorMessage.innerHTML = `
                <h4 class="alert-heading">Error!</h4>
                <p>Please select at least one breed to start the application.</p>
                <button id="close-error" class="btn btn-primary">Close</button>
            `;
      document.body.appendChild(errorMessage);

      // Close error message
      document
        .getElementById("close-error")
        .addEventListener("click", function () {
          errorMessage.style.display = "none";
        });
    } else {
      const entries = {
        breeds: selectedBreeds,
      };

      // Save entries to localStorage
      localStorage.setItem("exhibitorEntries", JSON.stringify(entries));

      // Show success alert box
      alert(
        "Your entries have been saved and the application has started. You will be notified when you need to bring a rabbit to the judge's table."
      );
    }
  });

  // Display welcome alert message
  const alertMessage = document.createElement("div");
  alertMessage.className = "alert alert-info text-center";
  alertMessage.style.position = "fixed";
  alertMessage.style.top = "50%";
  alertMessage.style.left = "50%";
  alertMessage.style.transform = "translate(-50%, -50%)";
  alertMessage.style.zIndex = "1000";
  alertMessage.innerHTML = `
        <h4 class="alert-heading">Hello Exhibitor!</h4>
        <p>Click on your entered breeds. Good luck today!</p>
        <button id="close-alert" class="btn btn-primary">Close</button>
    `;
  document.body.appendChild(alertMessage);

  // Close welcome alert message
  document.getElementById("close-alert").addEventListener("click", function () {
    alertMessage.style.display = "none";
  });
});

document.addEventListener("DOMContentLoaded", function () {
    Pusher.logToConsole = true;

    var pusher = new Pusher("999673f7c045421210be", {
        cluster: "us3",
    });

    var channel = pusher.subscribe("my-channel");
    channel.bind("my-event", function (data) {
        // Check if the browser supports notifications
        if ("Notification" in window) {
            // Request permission to display notifications
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    // Create and display the notification
                    var notification = new Notification("Table Time Alert", {
                        body: data.message,
                        icon: "images/notification-icon.png" // Optional: Add an icon for the notification
                    });

                    // Play a sound
                    var audio = new Audio("sounds/alert.mp3"); // Path to your alert sound file
                    audio.play();
                }
            });
        } else {
            // Fallback for browsers that do not support notifications
            alert(data.message);
        }
    });
});
