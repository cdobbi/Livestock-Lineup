// exhibitorPrintSubmissions.js
const exhibitorId = document.getElementById("exhibitor-id").value;
const response = await fetch(`https://livestock-lineup.onrender.com/api/submissions?exhibitor_id=${exhibitorId}`);
if (!response.ok) {
    alert("Error fetching submissions.");
    return;
}
const submissionsData = await response.json();
if (!submissionsData || submissionsData.length === 0) {
    alert("There are no submissions to print.");
    return;
}

// Group submissions by show and category since each submission row is saved per breed.
let groupedSubmissions = {};
submissionsData.forEach((sub) => {
    // Use the combination of show and category as the group key
    const key = `${sub.show_id}-${sub.category_id}`;
    if (!groupedSubmissions[key]) {
        groupedSubmissions[key] = {
            submission_id: sub.submission_id, // (optional: you can list the first one or ignore)
            show_name: sub.show_name,
            category_name: sub.category_name,
            breeds: []
        };
    }
    groupedSubmissions[key].breeds.push(sub.breed_name);
});

// Build a minimal HTML document for printing
let htmlContent = `
  <html>
    <head>
      <title>Print Submissions</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; }
        th { background-color: #f2f2f2; }
        h1 { margin-bottom: 20px; }
        .breed-cell { white-space: pre-wrap; } /* Preserves line breaks */
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
    // Format the breed names with a line break and tab-style spacing
    const breedText = "Breed:\n" + group.breeds.join("\n\t");
    htmlContent += `<tr>
      <td>${group.submission_id || ""}</td>
      <td>${group.category_name || ""}</td>
      <td>${group.show_name || ""}</td>
      <td class="breed-cell">${breedText}</td>
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
printWindow.close();
