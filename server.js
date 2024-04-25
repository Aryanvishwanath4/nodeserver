// Import the Express module
const express = require("express");

// Create an Express application
const app = express();

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Start the server
const port = 3000; // Choose any port you prefer
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
