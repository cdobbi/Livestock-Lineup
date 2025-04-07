// Handle login
document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    // Clear previous error messages
    document.getElementById("login-email-error").textContent = "";
    document.getElementById("login-password-error").textContent = "";

    // Get form values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    let isValid = true;

    // Validate email
    if (!email) {
        document.getElementById("login-email-error").textContent = "Email is required.";
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        document.getElementById("login-email-error").textContent = "Please enter a valid email address.";
        isValid = false;
    }

    // Validate password
    if (!password) {
        document.getElementById("login-password-error").textContent = "Password is required.";
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
