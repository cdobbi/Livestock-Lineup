// printLineups.js
export function initPrintLineupButton(printLineupButton) {
    printLineupButton.addEventListener("click", async () => {
      try {
        const response = await fetch("/api/lineups");
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        const lineups = await response.json();
  
        // Open a new window for the print preview.
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`<html><head><title>Print Preview</title></head><body>`);
        printWindow.document.write("<h1>Saved Lineups</h1>");
        if (lineups.length === 0) {
          printWindow.document.write("<p>No lineups to display.</p>");
        } else {
          lineups.forEach((lineup) => {
            printWindow.document.write(
              `<p>Lineup ID: ${lineup.lineup_id} | Show: ${lineup.show_name} | Category: ${lineup.category_name} | Breed: ${lineup.breed_name}</p>`
            );
          });
        }
        printWindow.document.write("</body></html>");
        printWindow.document.close();
      } catch (err) {
        console.error("Error fetching lineups for print preview:", err);
        alert("Failed to fetch lineups for print preview.");
      }
    });
  }
  
// import { getLineups } from './localStorage.js';

// // Initialize Print Lineup button functionality
// export function initPrintLineupButton(printLineupButton) {
//     if (printLineupButton) {
//         printLineupButton.addEventListener("click", () => {
//             let printContent = "";

//             // Get lineups from localStorage
//             const savedLineups = getLineups();

//             if (savedLineups.length === 0) {
//                 printContent = "No lineups saved.";
//             } else {
//                 savedLineups.forEach((lineup, index) => {
//                     printContent += `Lineup: ${index + 1}\n`;
//                     printContent += `Category: ${lineup.category_id}\n`;
//                     printContent += `Show: ${lineup.show_id}\n`;

//                     if (Array.isArray(lineup.breeds) && lineup.breeds.length > 0) {
//                         printContent += `Breed:\n`;
//                         lineup.breeds.forEach((breed, i) => {
//                             printContent += (i < lineup.breeds.length - 1) ? `${breed},\n` : `${breed}.\n`;
//                         });
//                     } else {
//                         printContent += `Breed:\nUnknown.\n`;
//                     }
//                     printContent += "\n"; // Add blank line between lineups
//                 });
//             }

//             // Open printable window
//             const printWindow = window.open("", "_blank", "width=600,height=600");
//             printWindow.document.write(`
//                 <html>
//                 <head>
//                     <title>Lineup Print Preview</title>
//                     <style>
//                         body { font-family: Arial, sans-serif; padding: 20px; }
//                         pre { white-space: pre-wrap; }
//                         button { padding: 10px 20px; background: #17a2b8; color: white; border: none; cursor: pointer; }
//                     </style>
//                 </head>
//                 <body>
//                     <h2>Lineup Print Preview</h2>
//                     <pre>${printContent}</pre>
//                     <button onclick="window.print(); window.close();">Print</button>
//                 </body>
//                 </html>
//             `);
//             printWindow.document.close();
//         });
//     } else {
//         console.error("Print Lineup button not found.");
//     }
// }