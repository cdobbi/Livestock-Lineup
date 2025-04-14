export function renderLineups(lineupContainer, showLineups) {
    console.log("Clearing lineup container...");
    lineupContainer.innerHTML = "";
  
    if (Array.isArray(showLineups)) {
      // Group the flat list into an object keyed by a composite of category and show.
      const grouped = {};
      showLineups.forEach((entry) => {
        // Use a composite key – adjust if you have a show_name field.
        const key = `${entry.category_name}|||Show ${entry.show_id}`;
        if (!grouped[key]) {
          // Create a new grouping entry with the expected structure.
          grouped[key] = {
            category: entry.category_name,
            show: "Show " + entry.show_id,
            submissions: [{ breeds: [] }],
          };
        }
        // Push the breed name into the current group's breeds array.
        grouped[key].submissions[0].breeds.push(entry.breed_name);
      });
  
      // Convert the grouped object into an array.
      const exhibitors = Object.values(grouped);
      console.log("Exhibitor entries grouped:", exhibitors);
  
      // Render each exhibitor group.
      exhibitors.forEach((exhibitor) => {
        const showDiv = document.createElement("div");
        showDiv.classList.add("lineup", "mb-4", "p-3", "border", "rounded");
  
        const showTitle = document.createElement("h3");
        showTitle.textContent = `Category: ${exhibitor.category} - ${exhibitor.show}`;
        showTitle.classList.add("text-primary");
        showDiv.appendChild(showTitle);
  
        const breedList = document.createElement("ul");
        breedList.classList.add("list-group");
  
        // exhibitor.submissions is an array containing one object
        if (exhibitor.submissions.length) {
          exhibitor.submissions[0].breeds.forEach((breed) => {
            const breedItem = document.createElement("li");
            breedItem.classList.add("list-group-item");
  
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            // Use a composite identifier for uniqueness.
            checkbox.id = `checkbox-${exhibitor.show}-${breed}`;
            checkbox.classList.add("breed-checkbox");
  
            const label = document.createElement("label");
            label.htmlFor = `checkbox-${exhibitor.show}-${breed}`;
            label.textContent = breed;
            label.style.cursor = "pointer";
  
            // When the label is clicked, trigger the notification.
            label.addEventListener("click", (event) => {
              event.stopPropagation();
              console.log(
                `Breed ${breed} clicked in lineup: Category ${exhibitor.category}, ${exhibitor.show}`
              );
              // Call your notification function.
              validateAndSendNotification(breed, exhibitor.category, exhibitor.show);
            });
  
            breedItem.appendChild(checkbox);
            breedItem.appendChild(label);
            breedList.appendChild(breedItem);
          });
        }
  
        showDiv.appendChild(breedList);
        lineupContainer.appendChild(showDiv);
      });
    } else {
      console.warn("showLineups is not an array. Cannot render lineups.");
    }
  }
  