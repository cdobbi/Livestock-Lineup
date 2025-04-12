// Does this file need to go into the uiHandlers.bundle.js file? Also which html file does it belong in if any? If it doesn't belong in an HTML or any of the other files, how is it initialized, called or used? What is it's purpose? Please, verify, ensure that this file is updated to use ES Modals and dont use the weird notations. ensure that all variables, functions, and wording are consistent across files and that everything links properly.

import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug: log the resolved path for clarity
const appPath = path.join(__dirname, "../src/app.js");
console.log("Loading Express app from:", appPath);

// Dynamically import the app module
const { default: app } = await import(appPath);

const port = process.env.PORT || 3000; // Use the port from environment variables or default to 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});