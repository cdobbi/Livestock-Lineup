const dotenv = require("dotenv");
dotenv.config();

const app = require("../app"); // Import the app.js file

const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});