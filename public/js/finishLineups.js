// finishLineups.js
export function initFinishedButton(finishedButton) {
    finishedButton.addEventListener("click", () => {
      // Redirect the user to the lineup viewing page.
      window.location.href = "/lineup.html";
    });
  }