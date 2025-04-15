// ---------- BEGIN FRONT-END CODE (lineup.js) ----------

// When the DOM is ready, render the lineup using hardcoded sample data.
// (Once your backend is working, you can replace this with a real API call.)
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("lineup-container");
    if (!container) {
      console.error("lineup-container not found");
      return;
    }
    
    // SAMPLE DATA: This simulates what your API should return.
    const sampleData = [
      { category_id: "Youth", show_id: 5, breed_name: "Mini Lop" },
      { category_id: "Open", show_id: 1, breed_name: "Rex" },
      { category_id: "Youth", show_id: 4, breed_name: "Rhinelander" }
    ];
    
    // Render the lineup using the sample data
    renderLineups(container, sampleData);
  });
  
  /**
   * Renders the lineup.
   * Groups the data by category and show, then creates clickable breed labels.
   */
  function renderLineups(container, data) {
    container.innerHTML = "";
    
    // Group the sample data by category and then by show.
    const grouped = {};
    data.forEach(entry => {
      const category = entry.category_name;
      const show = "Show " + entry.show_id;
      if (!grouped[category]) {
        grouped[category] = {};
      }
      if (!grouped[category][show]) {
        grouped[category][show] = [];
      }
      grouped[category][show].push(entry.breed_name);
    });
    
    // Create HTML for each group.
    Object.keys(grouped).forEach(category => {
      Object.keys(grouped[category]).forEach(show => {
        // Container for this category and show
        const groupDiv = document.createElement("div");
        groupDiv.classList.add("lineup", "mb-4", "p-3", "border", "rounded");
        
        // Title for the group
        const title = document.createElement("h3");
        title.textContent = `Category: ${category} - ${show}`;
        title.classList.add("text-primary");
        groupDiv.appendChild(title);
        
        // Create a list of breeds
        const ul = document.createElement("ul");
        ul.classList.add("list-group");
        
        grouped[category][show].forEach(breed => {
          const li = document.createElement("li");
          li.classList.add("list-group-item");
          
          const label = document.createElement("label");
          label.textContent = breed;
          label.style.cursor = "pointer";
          // When a breed label is clicked, send a remote notification request.
          label.addEventListener("click", (event) => {
            event.stopPropagation();
            console.log(`Breed ${breed} clicked in lineup: Category ${category}, ${show}`);
            sendNotification(breed, category, show);
          });
          
          li.appendChild(label);
          ul.appendChild(li);
        });
        
        groupDiv.appendChild(ul);
        container.appendChild(groupDiv);
      });
    });
  }
  
  async function sendNotification(breed, category, show) {
    try {
      const response = await fetch("/pusher-config/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: "livestock-lineup", event: "breed-notification", data: { breed, category, show } })
      });
      if (!response.ok) {
        const text = await response.text();
        console.error("Failed to trigger notification:", text);
      } else {
        console.log(`Notification triggered for ${breed}`);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
  