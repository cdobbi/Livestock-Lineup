
export const handleRegistration = async (event) => {
    event.preventDefault(); // Prevent form submission

    // Clear previous error messages
    document.getElementById("register-username-error").textContent = "";
    document.getElementById("register-email-error").textContent = "";
    document.getElementById("register-password-error").textContent = "";

    // Get form values
    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    let isValid = true;

    // Validate username
    if (!username) {
        document.getElementById("register-username-error").textContent = "Username is required.";
        isValid = false;
    }

    // Validate email
    if (!email) {
        document.getElementById("register-email-error").textContent = "Email is required.";
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        document.getElementById("register-email-error").textContent = "Please enter a valid email address.";
        isValid = false;
    }

    // Validate password
    if (!password) {
        document.getElementById("register-password-error").textContent = "Password is required.";
        isValid = false;
    } else if (password.length < 6) {
        document.getElementById("register-password-error").textContent = "Password must be at least 6 characters.";
        isValid = false;
    }

    if (isValid) {
        // Determine the backend URL dynamically
        const BACKEND_URL = window.location.hostname === "localhost"
            ? "http://localhost:3000" // Local development
            : "https://livestock-lineup.onrender.com"; // Production

        try {
            // Send registration data to the server
            const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const textResponse = await response.text(); // Log raw response
            console.log("Raw response from server:", textResponse);

            let result;
            try {
                result = JSON.parse(textResponse); // Parse response as JSON
            } catch {
                throw new Error("Invalid JSON response");
            }

            if (response.ok) {
                alert(result.message || "Registration successful!");
                // Redirect to login page or dashboard
                window.location.href = "/welcome.html";
            } else {
                alert(result.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            alert("An error occurred. Please try again later.");
            console.error("Error during registration:", error);
        }
    }
};

// Attach the event listener
document.getElementById("register-form").addEventListener("submit", handleRegistration);
