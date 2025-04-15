import { fetchAndRenderBreeds } from "./fetchBreeds.js";
import { saveLineup } from "./saveLineups.js";
import { initClearLineupButton } from "./clearLineups.js";
import { initFinishedButton } from "./finishLineups.js";
import { initPrintLineupButton } from "./printLineups.js";

document.addEventListener("DOMContentLoaded", async function () {
  const apiBaseUrl = "https://livestock-lineup.onrender.com/api";

  // Select required DOM elements
  // (IDs in the HTML remain kebab-case as defined in your markup.)
  const save_lineup_button = document.getElementById("save-lineup");
  const print_lineup_button = document.getElementById("print-lineup");
  const clear_lineup_button = document.getElementById("clear-lineup");
  const finished_button = document.getElementById("finished");
  const rabbit_list = document.getElementById("rabbit-list");
  const categoryEl = document.getElementById("category");
  const showEl = document.getElementById("show");

  // Check if required elements exist
  if (!rabbit_list) {
    console.error("Rabbit list element not found");
    return;
  }
  if (!save_lineup_button) {
    console.error("Save Lineup button not found");
    return;
  }
  if (!print_lineup_button) console.error("Print Preview button not found");
  if (!clear_lineup_button) console.error("Clear Lineup button not found");
  if (!finished_button) console.error("Finished button not found");

  // Fetch and render breeds into the rabbit list element.
  fetchAndRenderBreeds(`${apiBaseUrl}/breeds`, rabbit_list);

  // Initialize Save Lineup button event listener.
  save_lineup_button.addEventListener("click", async () => {
    // Get selected category and show values and their display text for alerts.
    const category_id = categoryEl ? categoryEl.value : "";
    const show_id = showEl ? showEl.value : "";
    const category_text = categoryEl
      ? categoryEl.options[categoryEl.selectedIndex].text
      : "";
    const show_text = showEl
      ? showEl.options[showEl.selectedIndex].text
      : "";

    // Get active breed buttons and extract their data attributes and text.
    const active_breed_buttons = document.querySelectorAll(".breed-button.active");
    const breed_ids = Array.from(active_breed_buttons).map((btn) => btn.dataset.breed);
    const breed_names = Array.from(active_breed_buttons).map((btn) =>
      btn.textContent.trim()
    );

    // Debug: log the payload being sent to the server.
    console.log("Payload being prepared:", {
      category_id,
      show_id,
      breed_ids,
    });

    // Validate that all required fields are provided.
    if (!category_id || !show_id || breed_ids.length === 0) {
      alert("Please select a category, show, and at least one breed.");
      console.error("Invalid payload:", { category_id, show_id, breed_ids });
      return;
    }

    try {
      await saveLineup(category_id, show_id, breed_ids, `${apiBaseUrl}/lineups`);

      const message = `Category: ${category_text}\nShow: ${show_text}\nBreeds: ${breed_names.join(
        ", "
      )}\n\nSaved! Create another lineup or click finished to continue.`;

      alert(message);

      // Optionally, you can remove the active state from the breed buttons here.
    } catch (error) {
      console.error("Error saving lineup:", error);
      alert("Failed to save lineup. Please try again.");
    }
  });

  // Initialize additional buttons.
  if (print_lineup_button) initPrintLineupButton(print_lineup_button);
  if (clear_lineup_button) initClearLineupButton(clear_lineup_button);
  if (finished_button) initFinishedButton(finished_button);
});
