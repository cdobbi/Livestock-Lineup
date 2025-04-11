// Does this file need to go into the uiHandlers.bundle.js file? Also which html file does it belong in if any? If it doesn't belong in an HTML or any of the other files, how is it initialized, called or used? What is it's purpose? Please, verify, ensure that this file is updated to use ES Modals and dont use the weird notations. ensure that all variables, functions, and wording are consistent across files and that everything links properly.


const { getLineups } = require('./localStorage.js');

// Initialize Print Lineup button functionality
function initPrintLineupButton(printLineupButton) {
    if (printLineupButton) {
        printLineupButton.addEventListener("click", () => {
            let printContent = "";

            // Get lineups from localStorage
            const savedLineups = getLineups();

            if (savedLineups.length === 0) {
                printContent = "No lineups saved.";
            } else {
                savedLineups.forEach((lineup, index) => {
                    printContent += `Lineup: ${index + 1}\n`;
                    printContent += `Category: ${lineup.category_id}\n`;
                    printContent += `Show: ${lineup.show_id}\n`;

                    if (Array.isArray(lineup.breeds) && lineup.breeds.length > 0) {
                        printContent += `Breed:\n`;
                        lineup.breeds.forEach((breed, i) => {
                            printContent += (i < lineup.breeds.length - 1) ? `${breed},\n` : `${breed}.\n`;
                        });
                    } else {
                        printContent += `Breed:\nUnknown.\n`;
                    }
                    printContent += "\n"; // Add blank line between lineups
                });
            }

            // Open printable window
            const printWindow = window.open("", "_blank", "width=600,height=600");
            printWindow.document.write(`
                <html>
                <head>
                    <title>Lineup Print Preview</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        pre { white-space: pre-wrap; }
                        button { padding: 10px 20px; background: #17a2b8; color: white; border: none; cursor: pointer; }
                    </style>
                </head>
                <body>
                    <h2>Lineup Print Preview</h2>
                    <pre>${printContent}</pre>
                    <button onclick="window.print(); window.close();">Print</button>
                </body>
                </html>
            `);
            printWindow.document.close();
        });
    } else {
        console.error("Print Lineup button not found.");
    }
}

// Export the function for use in other files
module.exports = {
    initPrintLineupButton
};