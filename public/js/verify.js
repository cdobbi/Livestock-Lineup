/**
 * This script handles the verification of organizer codes.
 * It sends the entered code to the backend `/codes/verify` endpoint for validation.
 * If the code is valid, the user is redirected to the organizer page.
 * If the code is invalid, an error message is displayed, and the input field is highlighted.
 * This script is designed to work with the frontend and backend integration.
 */

document.addEventListener("DOMContentLoaded", function () {
    const verifyButton = document.getElementById("verify-code");

    if (verifyButton) {
        verifyButton.addEventListener("click", async function () {  
            const organizerCode = document.getElementById("organizer-code").value;

            try {
                // Send code to the /codes/verify endpoint
                const response = await fetch("/api/codes/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code: organizerCode }),
                });

                const result = await response.json();

                if (result.valid) {
                    // Redirect to organizer page if the code is valid
                    window.location.href = "organizer.html";
                } else {
                    // Highlight the input field with an error style
                    const codeInput = document.getElementById("organizer-code");
                    codeInput.classList.add("error");
                }
            } catch (error) {
                // Log error for debugging and show a user-friendly message
                console.error("Error verifying code:", error);
            }
        });
    } else {
        console.warn("Verify button not found in the DOM.");
    }
});