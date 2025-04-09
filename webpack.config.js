const path = require("path");

module.exports = {
  entry: "./src/uiHandlers.js",  // Your main client-side JS file
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public/dist")  // Output folder for bundled file
  },
  mode: "production",  // Change to 'development' if you need easier debugging
};
