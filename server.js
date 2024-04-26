const express = require("express");
const app = express();
const fs = require("fs");
const { handleRequest, connectDB } = require("./database");

app.use(express.json());

//reading contents from a file
fs.readFile("sample.txt", "utf-8", (err, data) => {
  if (err) {
    console.log("error reading file", err);
    return;
  }
  console.log("file content", data);
});

//writing content into a file
fs.writeFile("sample.txt", "Hello Node Js", (err) => {
  if (err) {
    console.log("error writing into file", err);
    return;
  }
  console.log("file written successfully");
});

const port = 3000;
app.use(async (req, res, next) => {
  try {
    await connectDB(); // Establish MongoDB connection
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/users", handleRequest);

app.get("/users/:name", handleRequest);

app.post("/users", handleRequest);

app.put("/users/:name", handleRequest);

app.delete("/users/:id", (req, res) => {
  const updateUser = req.body;
  const userId = parseInt(req.params.id);
  let userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return res.status(401).json({ message: "User not found" });
  }

  const deletedUser = users.splice(userIndex, 1);
  res.status(200).json(deletedUser);
});

// Middleware to close MongoDB connection after each request
app.use(async (req, res, next) => {
  try {
    await client.close(); // Close MongoDB connection
    console.log("Closed MongoDB connection");
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
