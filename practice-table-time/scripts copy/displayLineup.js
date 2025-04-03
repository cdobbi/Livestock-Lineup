import { showInitialAlert } from "./alertMessages.js";
import { sendPusherEvent } from "./sendPusherEvent.js";

const authKey = "YOUR_PUSHER_KEY"; // Replace with your actual Pusher key
const secretKey = "YOUR_PUSHER_SECRET"; // Replace with your actual Pusher secret

document.addEventListener("DOMContentLoaded", function () {
  const lineupContainer = document.getElementById("lineup-container");
  const printButton = document.getElementById("print");

  // Show initial alert message
  showInitialAlert();

  // Retrieve the lineup data from localStorage
  const showLineups = JSON.parse(localStorage.getItem("showLineups")) || {};

  // Function to display the lineup
  function displayLineup() {
    lineupContainer.innerHTML = "";
    Object.keys(showLineups).forEach((category) => {
      Object.keys(showLineups[category]).forEach((show) => {
        const lineup = showLineups[category][show];
        const showDiv = document.createElement("div");
        showDiv.classList.add("col-12", "mb-4");
        const showTitle = document.createElement("h3");
        showTitle.textContent = `Category: ${category} - Show: ${show}`;
        showDiv.appendChild(showTitle);
        const breedList = document.createElement("ul");

        lineup.breeds.forEach((breed, index) => {
          const breedItem = document.createElement("li");
          breedItem.classList.add("form-check");
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.classList.add("form-check-input");
          checkbox.id = `breed-${category}-${show}-${index}`;
          // Add event listener to the checkbox
          checkbox.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent the default checkbox behavior
            checkbox.checked = true; // Check the checkbox
            const confirmMessage = `Are you sure you want to send an alert for:\nCategory: ${category}\nShow: ${show}\nBreed: ${breed}?`;
            if (confirm(confirmMessage)) {
              alert(
                `Alert sent for:\nCategory: ${category}\nShow: ${show}\nBreed: ${breed}`
              );

              // Prepare event data
              const eventData = {
                name: "my-event",
                channel: "my-channel",
                data: JSON.stringify({
                  message: `Take your ${breed} to the show table!`,
                }),
              };

              // Send event using the sendPusherEvent function
              sendPusherEvent(authKey, secretKey, eventData)
                .then((data) => {
                  console.log("Event sent successfully:", data);
                })
                .catch((error) => {
                  console.error("Error sending event:", error);
                });
            } else {
              checkbox.checked = false; // Uncheck the checkbox if the user cancels
            }
          });
          const label = document.createElement("label");
          label.classList.add("form-check-label");
          label.htmlFor = checkbox.id;
          label.textContent = breed;
          breedItem.appendChild(checkbox);
          breedItem.appendChild(label);
          breedList.appendChild(breedItem);
        });
        showDiv.appendChild(breedList);
        lineupContainer.appendChild(showDiv);
      });
    });
  }

  // Display the lineup on page load
  displayLineup();

  // Print button functionality
  printButton.addEventListener("click", function () {
    window.print();
  });
});
