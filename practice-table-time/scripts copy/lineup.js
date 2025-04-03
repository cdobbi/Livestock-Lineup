document.addEventListener("DOMContentLoaded", function () {
  const saveLineupButton = document.getElementById("save-lineup");
  const printLineupButton = document.getElementById("print-lineup");
  const clearLineupButton = document.getElementById("clear-lineup");
  const finishedButton = document.getElementById("finished");
  const printButton = document.getElementById("print");

  let selectedBreeds = [];
  let showLineups = JSON.parse(localStorage.getItem("showLineups")) || {};

  // Function to update the selected breeds array
  function updateSelectedBreeds() {
    selectedBreeds = [];
    const checkboxes = document.querySelectorAll(
      "#breed-options input[type=checkbox]"
    );
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedBreeds.push(checkbox.value);
      }
    });
  }

  // Event listener for the "Save Lineup" button
  saveLineupButton.addEventListener("click", function () {
    updateSelectedBreeds();
    const selectedCategory = document.getElementById("category").value;
    const selectedShow = document.getElementById("show").value;

    // Initialize the category in showLineups if it doesn't exist
    if (!showLineups[selectedCategory]) {
      showLineups[selectedCategory] = {};
    }

    // Save the lineup for the selected show under the selected category
    showLineups[selectedCategory][selectedShow] = {
      category: selectedCategory,
      breeds: [...selectedBreeds],
    };

    localStorage.setItem("showLineups", JSON.stringify(showLineups));

    alert(
      `Lineup for Show ${selectedShow} in ${selectedCategory} category saved. Please enter the next show.`
    );
  });

  // Event listener for the "Print Lineups" button
  printLineupButton.addEventListener("click", function () {
    const lineupData = Object.keys(showLineups)
      .map((category) => {
        return Object.keys(showLineups[category])
          .map((show) => {
            const lineup = showLineups[category][show];
            return `Category: ${category}\nShow: ${show}\nBreeds:\n${lineup.breeds
              .map((breed, index) => `${index + 1}. ${breed}`)
              .join("\n")}`;
          })
          .join("\n\n");
      })
      .join("\n\n");

    const newWindow = window.open("", "", "width=600,height=400");
    newWindow.document.write(`<pre>${lineupData}</pre>`);
    newWindow.print();
    newWindow.close();
  });

  // Event listener for the "Finished" button
  finishedButton.addEventListener("click", function () {
    localStorage.setItem("showLineups", JSON.stringify(showLineups));
    alert("All lineups saved. Redirecting to lineup page.");
    window.location.href = "lineup.html"; // Redirect to the lineup page
  });

  // Event listener for the "Clear Lineup" button
  clearLineupButton.addEventListener("click", function () {
    showLineups = {};
    localStorage.removeItem("showLineups");
    alert("All lineups cleared.");
  });

  // Print button functionality
  printButton.addEventListener("click", function () {
    window.print();
  });
});
