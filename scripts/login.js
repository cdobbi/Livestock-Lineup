// Handle login
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

    if (isValid) {
        try {
            // Send login data to the server
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            if (response.ok && result.success) {
                alert("Login successful!");
                window.location.href = "index.html"; // Redirect to the main page
            } else {
                alert(result.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            alert("An error occurred. Please try again later.");
            console.error(error);
        }
    }
});
