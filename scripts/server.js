//Are you absolutly sure you need to modify this file. Check again.
// // Dynamically imports app.js using ES Modules syntax.
// Starts the server by calling app.listen(port).
// Emtry point.
// filepath: c:\Livestock-Lineup\scripts\server.js

import dotenv from "dotenv";
dotenv.config();

// import { fileURLToPath, pathToFileURL } from "url";
import app from "../src/app.js"

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const appPath = path.join(__dirname, "./staticServer.js");
// console.log("Loading Static Server from:", appPath);

// const appUrl = pathToFileURL(appPath).href;
// const { default: app } = await import(appUrl);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});