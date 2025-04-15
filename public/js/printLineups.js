// printLineups.js
export function initPrintLineupButton(printLineupButton) {
    printLineupButton.addEventListener("click", async () => {
      try {
        const response = await fetch("/api/lineups");
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        const lineups = await response.json();
  
        // Group the lineups by a composite key (show_id and category_id).
        // We assume that a save action inserts multiple rows (one per breed)
        // that share the same show and category. We group them so that the preview
        // shows a single "Lineup" entry with a list of breeds.
        // Group the lineups by a composite key (show_id and category_id).
        const groupedLineups = {};
        lineups.forEach((row) => {
        const key = `${row.show_id}|${row.category_id}`;
        if (!groupedLineups[key]) {
            groupedLineups[key] = {
            lineup_id: row.lineup_id,
            show_name: row.show_name,
            category_name: row.category_name,
            breed_names: []
            };
        }
        groupedLineups[key].breed_names.push(row.breed_name);
        });

              
          }
          groupedLineups[key].breedNames.push(row.breed_name);
        });
  
        // Open a new window for the print preview.
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Preview</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                h1 { margin-bottom: 20px; }
                button { padding: 10px 20px; font-size: 16px; }
              </style>
            </head>
            <body>
              <h1>Saved Lineups</h1>
        `);
  
        if (Object.keys(groupedLineups).length === 0) {
          printWindow.document.write("<p>No lineups to display.</p>");
        } else {
          // Create a table header
          printWindow.document.write("<table>");
          printWindow.document.write("<tr><th>Lineup</th><th>Show</th><th>Category</th><th>Breeds</th></tr>");
          // Loop through each group
          for (const key in groupedLineups) {
            const group = groupedLineups[key];
            printWindow.document.write("<tr>");
            printWindow.document.write(`<td>${group.lineupId}</td>`);
            printWindow.document.write(`<td>${group.showName}</td>`);
            printWindow.document.write(`<td>${group.categoryName}</td>`);
            // Join breed names with a <br> for line breaks.
            printWindow.document.write(`<td>${group.breedNames.join("<br>")}</td>`);
            printWindow.document.write("</tr>");
          }
          printWindow.document.write("</table>");
        }
  
        // Add a Print button.
        printWindow.document.write(`<button onclick="window.print()">Print Lineup</button>`);
        printWindow.document.write(`
            </body>
          </html>
        `);
        printWindow.document.close();
      } catch (err) {
        console.error("Error fetching lineups for print preview:", err);
        alert("Failed to fetch lineups for print preview.");
      }
    });
  }
  