const apiUrl = "http://localhost:3000/api/supported-animals"; // Backend endpoint to fetch the list of animals
const animalDetailsUrl = "http://localhost:3000/api/animals"; // Backend endpoint to fetch details for a specific animal

document.addEventListener("DOMContentLoaded", fetchAndDisplayAnimalOptions);

async function fetchAndDisplayAnimalOptions() {
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const animals = await response.json();
        console.log("Supported Animals:", animals); // Debug log

        if (!animals || !Array.isArray(animals) || animals.length === 0) {
            throw new Error('No animals found in the API.');
        }

        displayAnimalOptions(animals);
    } catch (error) {
        console.error("Error:", error);
        errorMessage.classList.remove('d-none'); // Show error message
        errorMessage.textContent = error.message;
    }
}

function displayAnimalOptions(animals) {
    const container = document.getElementById('animal-cards-container');
    container.innerHTML = ""; // Clear any existing content

    animals.forEach((animal) => {
        const card = document.createElement('div');
        card.className = "col-md-4"; // Bootstrap grid column for responsive layout

        card.innerHTML = `
            <div class="card h-100 clickable-card" data-animal="${animal}">
                <div class="card-body">
                    <h5 class="card-title">${animal}</h5>
                </div>
            </div>
        `;

        card.addEventListener('click', () => fetchAndDisplayAnimalDetails(animal)); // Add click event to fetch details
        container.appendChild(card);
    });
}

async function fetchAndDisplayAnimalDetails(animal) {
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch(`${animalDetailsUrl}?animal=${animal}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const animalDetails = await response.json();
        console.log("Animal Details:", animalDetails); // Debug log

        displayAnimalDetails(animalDetails);
    } catch (error) {
        console.error("Error:", error);
        errorMessage.classList.remove('d-none'); // Show error message
        errorMessage.textContent = error.message;
    }
}

function displayAnimalDetails(animalDetails) {
    const container = document.getElementById('animal-cards-container');
    container.innerHTML = ""; // Clear the container to display details

    animalDetails.forEach((detail) => {
        const card = document.createElement('div');
        card.className = "col-md-4";

        const imageUrl = detail.Image || "https://via.placeholder.com/150"; // Placeholder if no image is available

        card.innerHTML = `
            <div class="card h-100">
                <img src="${imageUrl}" class="card-img-top" alt="${detail.Animal || "Animal"}">
                <div class="card-body">
                    <h5 class="card-title">${detail.Animal || "Unknown Animal"}</h5>
                    <p class="card-text"><strong>Habitat:</strong> ${detail.Habitat || "Unknown"}</p>
                    <p class="card-text"><strong>Lifespan:</strong> ${detail["Lifespan (years)"] || "Unknown"} years</p>
                    <p class="card-text"><strong>Diet:</strong> ${detail.Diet || "Unknown"}</p>
                    <p class="card-text"><strong>Top Speed:</strong> ${detail["Top Speed (km/h)"] || "Unknown"} km/h</p>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}