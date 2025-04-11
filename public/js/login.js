// Does this file need to go into the uiHandlers.bundle.js file? Also which html file does it belong in if any? If it doesn't belong in an HTML or any of the other files, how is it initialized, called or used? What is it's purpose? Please, verify, ensure that this file is updated to use ES Modals and dont use the weird notations. ensure that all variables, functions, and wording are consistent across files and that everything links properly.


export const handleLogin = async (event) => {
    event.preventDefault(); // Prevent form submission

    // Clear previous errors
    function clearErrors() {
        const errorFields = ["login-email-error", "login-password-error"];
        errorFields.forEach((id) => {
            const element = document.getElementById(id);
            if (element) element.textContent = "";
        });
    }

    // Display error messages
    function displayError(fieldId, message) {
        const element = document.getElementById(fieldId);
        if (element) element.textContent = message;
    }

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

    // Determine the backend URL dynamically
    const BACKEND_URL =
        window.location.hostname === "localhost"
            ? "http://localhost:3000" // Local development
            : "https://livestock-lineup.onrender.com"; // Production

    try {
        // Send login data to the server
        const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const textResponse = await response.text(); // Log raw response
        console.log("Raw response from server:", textResponse);

        let result;
        try {
            result = JSON.parse(textResponse); // Parse response as JSON
        } catch {
            throw new Error("Invalid JSON response");
        }

        if (response.ok && result.success) {
            // Show a temporary success message
            const successMessage = document.createElement("div");
            successMessage.textContent = "Login successful! Redirecting...";
            successMessage.style.position = "fixed";
            successMessage.style.top = "25px";
            successMessage.style.left = "50%";
            successMessage.style.transform = "translateX(-50%)";
            successMessage.style.backgroundColor = "#64999b;";
            successMessage.style.color = "white";
            successMessage.style.padding = "20px 30px";
            successMessage.style.borderRadius = "5px";
            successMessage.style.zIndex = "1000";
            document.body.appendChild(successMessage);

            // Redirect to welcome.html after 2 seconds
            setTimeout(() => {
                window.location.href = "/welcome.html"; // Ensure this path is correct
            }, 2000); // 2-second delay
        } else {
            alert(result.message || "Login failed. Please check your credentials.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later.");
    }
};

// Attach the event listener
document.getElementById("login-form").addEventListener("submit", handleLogin);

