// exhibitorClearSubmissions.js
export function initClearSubmissions() {
    const clearButton = document.getElementById("clear-lineup");
    const rabbitList = document.getElementById("rabbit-list");
    if (!clearButton) {
      console.error("Clear Lineup button not found!");
      return;
    }
    clearButton.addEventListener("click", () => {
      // Remove the "active" class from all breed buttons.
      const activeButtons = rabbitList.querySelectorAll(".breed-button.active");
      activeButtons.forEach((btn) => btn.classList.remove("active"));
      alert("Lineup cleared.");
    });
  }
  