// exhibitorPrintSubmissions.js

export function initPrintSubmissions() {
    const exhibitorId = document.getElementById("exhibitor-id").value;

    const printButton = document.getElementById("print-submissions");
    if (!printButton) {
        console.error("Print Submissions button not found!");
        return;
    }

    printButton.addEventListener("click", async () => {
        try {
            const exhibitorIdElem = document.getElementById("exhibitor-id");
            if (!exhibitorIdElem) {
                alert("Exhibitor ID not found on the page.");
                return;
            }
            const exhibitorId = exhibitorIdElem.value;
            const response = await fetch(
                `https://livestock-lineup.onrender.com/api/submissions/exhibitor_id=${exhibitorId}`
            );
            if (!response.ok) {
                alert("Error fetching submissions.");
                return;
            }
            const submissionsData = await response.json();
            if (!submissionsData || submissionsData.length === 0) {
                alert("There are no submissions to print.");
                return;
            }

            const groupedSubmissions = {};
            submissionsData.forEach((sub) => {
                const key = `${sub.category_name || sub.category_id}_${sub.show_name || sub.show_id}`;
                if (!groupedSubmissions[key]) {
                    groupedSubmissions[key] = {
                        submission_id: sub.submission_id,
                        category: sub.category_name || sub.category_id,
                        show: sub.show_name || sub.show_id,
                        breeds: []
                    };
                }
                groupedSubmissions[key].breeds.push(sub.breed_name);
            });

            let htmlContent = `
          <html>
            <head>
              <title>Print Submissions</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; }
                th { background-color: #f2f2f2; }
                .breed-cell { white-space: pre-wrap; }
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
                <tbody>
        `;

            Object.keys(groupedSubmissions).forEach((key) => {
                const group = groupedSubmissions[key];
                const breedText = "Breed:\n" + group.breeds.join("\n\t");
                htmlContent += `<tr>
            <td>${group.submission_id || ""}</td>
            <td>${group.category || ""}</td>
            <td>${group.show || ""}</td>
            <td class="breed-cell">${breedText}</td>
          </tr>`;
            });

            htmlContent += `
                </tbody>
              </table>
            </body>
          </html>
        `;

            const printWindow = window.open("", "_blank");
            if (!printWindow) {
                alert("Unable to open print window.");
                return;
            }
            printWindow.document.open();
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        } catch (error) {
            console.error("Error printing submissions:", error);
        }
    });
}
