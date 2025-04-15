// exhibitorClearSubmissions.js
export function initClearSubmissions() {
    // Retrieve the clear lineup button and the container holding the breed buttons.
    const clearButton = document.getElementById("clear-lineup");
    const rabbitList = document.getElementById("rabbit-list");
    
    if (!clearButton) {
      console.error("Clear Lineup button not found!");
      return;
    }
    
    // Attach click event listener to clear the active state from all breed buttons.
    clearButton.addEventListener("click", () => {
      // Select all breed buttons that are currently active.
      const activeButtons = rabbitList.querySelectorAll(".breed-button.active");
      activeButtons.forEach((btn) => btn.classList.remove("active"));
      alert("Lineup cleared.");
    });
  }
  