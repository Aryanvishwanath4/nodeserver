// Import the Express module
const express = require("express");

// Create an Express application
const app = express();
app.use(express.json());
// Define a route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Start the server
const port = 3000; // Choose any port you prefer
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

let users = [
  { id: 1, name: "Chaarvi", age: 30 },
  { id: 2, name: "Vihana", age: 25 },
];

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  res.json(user);
});

app.post("/users", (req, res) => {
  const newUser = req.body;
  if (!newUser || !newUser.name || !newUser.age) {
    res.status(404).json({ message: "Invalid user data" });
  }
  newUser.id = users.length + 1;
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put("/users/:id", (req, res) => {
  const updateUser = req.body;
  const userId = parseInt(req.params.id);
  let userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return res.status(401).json({ message: "User not found" });
  }

  users[userIndex] = { ...users[userIndex], ...updateUser };
  res.status(200).json(users[userIndex]);
});
