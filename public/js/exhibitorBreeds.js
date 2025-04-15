import { fetchAndRenderBreeds } from "./fetchBreeds.js";

document.addEventListener("DOMContentLoaded", async () => {
  const rabbitListContainer = document.getElementById("rabbit-list");

  if (!rabbitListContainer) {
    console.error("Rabbit list container not found.");
    return;
  }

  const apiUrl = "https://livestock-lineup.onrender.com/api/breeds";
  await fetchAndRenderBreeds(apiUrl, rabbitListContainer);

  console.log("Breeds have been rendered for the exhibitor.");
});
