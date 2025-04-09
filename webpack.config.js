const path = require("path");

module.exports = {
  entry: "./src/uiHandlers.js", // Your source file in the src folder
  output: {
    filename: "uiHandlers.bundle.js", // Name of the output bundled file
    path: path.resolve(__dirname, "public/js") // Output path where your HTML can load it from
  },
  mode: "production" // Use 'development' during development for better debugging
};
