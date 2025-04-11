const path = require("path");

module.exports = {
  entry: "./src/uiHandlers.js", 
  output: {
    filename: "uiHandlers.bundle.js", 
    path: path.resolve(__dirname, "public/js") 
  },
  mode: "production"
};
