/**
 * This script handles user login for the Livestock Lineup application.
 * It validates the login form inputs, sends the data to the backend `/login` endpoint,
 * and displays appropriate success or error messages based on the server's response.
 * This script integrates with the backend server and frontend form validation.
 */

document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    // Function to clear all previous error messages
    function clearErrors() {
        const errorFields = ["login-email-error", "login-password-error"];
        errorFields.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = "";
        });
    }

    // Function to display error messages
    function displayError(fieldId, message) {
        const element = document.getElementById(fieldId);
        if (element) element.textContent = message;
    }

    // Clear previous errors
    clearErrors();

    // Get form values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    let isValid = true;

    // Validate email
    if (!email) {
        displayError("login-email-error", "Email is required.");
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        displayError("login-email-error", "Please enter a valid email address.");
        isValid = false;
    }

    // Validate password
    if (!password) {
        displayError("login-password-error", "Password is required.");
        isValid = false;
    }

    if (!isValid) {
        return; // Stop execution if validation fails
    }

    try {
        // Send login data to the server
        const response = await fetch('https://livestock-lineup.onrender.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // Log the raw response for debugging
        const textResponse = await response.text();
        console.log("Raw response from server:", textResponse);

        // Attempt to parse the response as JSON
        const result = JSON.parse(textResponse);

        if (response.ok && result.success) {
            alert("Login successful!");
            window.location.href = "index.html"; // Redirect to the main page
        } else {
            alert(result.message || "Login failed. Please check your credentials.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later.");
    }
});