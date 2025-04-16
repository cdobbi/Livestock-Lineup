// exhibitorSaveLineup.js
export function initSaveLineup() {
    const save_lineup_button = document.getElementById("save-lineup");
    const category_select = document.getElementById("category-select");
    const show_select = document.getElementById("show-select");
    const rabbit_list_container = document.getElementById("rabbit-list");
    const flipping_card = document.getElementById("flipping-card");
    const exhibitor_id_element = document.getElementById("exhibitor-id");

    if (!save_lineup_button) {
        console.error("Save Lineup button not found!");
        return;
    }

    save_lineup_button.addEventListener("click", async () => {
        const category_id = category_select.value;
        const show_id = show_select.value;
        const selected_breed = [];
        const selected_buttons = rabbit_list_container.querySelectorAll(".breed-button.active");

        // IMPORTANT: use button.dataset.breed (singular) to match how the attribute was set.
        selected_buttons.forEach((button) => {
            selected_breed.push(button.dataset.breed);
        });

        if (!category_id || !show_id) {
            alert("Please select both a category and a show.");
            return;
        }
        if (selected_breed.length === 0) {
            alert("Please select at least one breed to start the application.");
            return;
        }

        const exhibitor_id = exhibitor_id_element ? exhibitor_id_element.value : "1";

        const submission = {
            exhibitor_id: exhibitor_id,
            show_id: show_id,
            category_id: category_id,
            breed_ids: selected_breed
        };

        console.log("Payload being prepared:", submission);

        try {
            const response = await fetch("https://livestock-lineup.onrender.com/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submission),
            });

            const response_data = await response.json();
            console.log("Response from save:", response_data);

            if (!response.ok) {
                console.error("Failed to save lineup:", response_data);
                alert("Failed to save lineup: " + JSON.stringify(response_data));
                return;
            }

            flipping_card.style.display = "block";
            flipping_card.classList.add("flipped");

            setTimeout(() => {
                flipping_card.classList.remove("flipped");
                flipping_card.style.display = "none";
                alert(
                    `Category: ${category_select.options[category_select.selectedIndex].text}\n` +
                    `Show: ${show_select.options[show_select.selectedIndex].text}\n` +
                    `Breeds: ${selected_breed.join(", ")}\n\nSubmission saved successfully! Save another or click on 'Start Application'.`
                );
            }, 2000);
        } catch (error) {
            console.error("Error saving lineup:", error);
            alert("An error occurred while saving your lineup.");
        }
    });
}
