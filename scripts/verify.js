document.addEventListener("DOMContentLoaded", function () {
    const verifyButton = document.getElementById("verify-code");

    if (verifyButton) {
        verifyButton.addEventListener("click", async function () {
            const organizerCode = document.getElementById("organizer-code").value;

            try {
                // Send code to the new /codes/verify endpoint
                const response = await fetch("/codes/verify", {
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
                    document.getElementById("organizer-code").classList.add("error");
                    alert("Invalid code. Please try again.");
                }
            } catch (error) {
                // Log error for debugging and show a user-friendly message
                console.error("Error verifying code:", error);
                alert("An error occurred while verifying the code. Please try again.");
            }
        });
    } else {
        console.warn("Verify button not found in the DOM.");
    }
});
