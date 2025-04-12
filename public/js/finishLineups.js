// finishLineups.js
export function initFinishedButton(finishedButton) {
    finishedButton.addEventListener("click", () => {
      // Redirect the user to the lineup viewing page.
      window.location.href = "/lineup.html";
    });
  }
  


// import { hasLineups, getLineups, clearLineups } from './localStorage.js';

// // Initialize Finished button functionality
// export function initFinishedButton(finishedButton) {
//     if (finishedButton) {
//         finishedButton.addEventListener("click", () => {
//             // Check if there are any saved lineups
//             if (!hasLineups()) {
//                 alert("Please save at least one lineup before finishing.");
//                 return;
//             }

//             // Clear all lineups from localStorage
//             clearLineups();

//             // Redirect to lineup.html
//             window.location.href = "lineup.html";
//         });
//     } else {
//         console.error("Finished button not found.");
//     }
// }