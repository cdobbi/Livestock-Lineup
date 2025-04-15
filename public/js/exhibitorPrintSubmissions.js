// exhibitorPrintSubmissions.js
export function initPrintSubmissions() {
    const printButton = document.getElementById("print-submissions");
    if (!printButton) {
      console.error("Print Submissions button not found!");
      return;
    }  
  
    printButton.addEventListener("click", async () => {
      try {
        const response = await fetch("https://livestock-lineup.onrender.com/api/submissions");
        if (!response.ok) {
          alert("Error fetching submissions.");
          return;
        }
        const submissions = await response.json();
        if (!submissions || submissions.length === 0) {
          alert("There are no submissions to print.");
          return;
        }
        
        // Build a minimal HTML document for printing
        let htmlContent = `
          <html>
            <head>
              <title>Print Submissions</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                h1 { margin-bottom: 20px; }
              </style>
            </head>
            <body>
              <h1>Submissions</h1>
              <table>
                <thead>
                  <tr>
                    <th>Submission ID</th>
                    <th>Category</th>
                    <th>Show</th>
                    <th>Breed</th>
                  </tr>
                </thead>
                <tbody>`;
        
        submissions.forEach((submission) => {
          htmlContent += `<tr>
            <td>${submission.lineup_id || ""}</td>
            <td>${submission.category_name || submission.category_id || ""}</td>
            <td>${submission.show_name || submission.show_id || ""}</td>
            <td>${submission.breed_name || ""}</td>
          </tr>`;
        });
        
        htmlContent += `
                </tbody>
              </table>
            </body>
          </html>`;
          
        const printWindow = window.open("", "_blank");
        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      } catch (err) {
        console.error("Error fetching or printing submissions:", err);
        alert("An error occurred while fetching submissions for print preview.");
      }
    });
  }  