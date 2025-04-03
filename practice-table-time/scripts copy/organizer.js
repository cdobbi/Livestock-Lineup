document.addEventListener("DOMContentLoaded", function () {
  const breedOptionsContainer = document.getElementById("breed-options");
  const saveEntriesButton = document.getElementById("save-lineup");
  const clearLineupButton = document.getElementById("clear-lineup");
  const lineupContainer = document.getElementById("lineup");
  const printLineupButton = document.getElementById("print-lineup");

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

          // Add event listener to the checkbox
          checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
              localStorage.setItem("currentBreed", entry.breed);
            }
          });
        });
      }

      // Initial population of breed options
      populateBreedOptions();
    })
    .catch((error) => console.error("Error fetching data:", error));

  // Grouped Event Listeners
  if (saveEntriesButton) {
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

      // Save the lineup data to localStorage
      const lineupData = {
        breeds: selectedBreeds,
      };
      localStorage.setItem("showLineups", JSON.stringify(lineupData));

      alert("Lineup saved successfully!");
    });
  }

  if (clearLineupButton) {
    clearLineupButton.addEventListener("click", function () {
      // Clear the lineup container
      if (lineupContainer) {
        lineupContainer.innerHTML = "";
      }

      // Clear the relevant data in localStorage
      localStorage.removeItem("exhibitorEntries");
      localStorage.removeItem("currentBreed");

      // Uncheck all checkboxes
      const checkboxes = breedOptionsContainer.querySelectorAll(
        "input[type=checkbox]"
      );
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });

      // Optionally reload the page to ensure everything is cleared
      window.location.reload();
    });
  }

  if (printLineupButton) {
    printLineupButton.addEventListener("click", function () {
      if (lineupContainer) {
        const printContent = lineupContainer.innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
      }
    });
  }
});
