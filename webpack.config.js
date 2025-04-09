const path = require("path");

module.exports = {
  entry: "./src/uiHandlers.js",  // Your source file
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public/dist")  // Bundled file placed here
  },
  mode: "production",  // or 'development' if needed
};
