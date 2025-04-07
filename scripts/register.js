// Handle registration
document.getElementById("register-form").addEventListener("submit", async function (event) {
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
        try {
            // Send registration data to the server
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message || "Registration successful!");
            } else {
                alert(result.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            alert("An error occurred. Please try again later.");
            console.error(error);
        }
    }
});
