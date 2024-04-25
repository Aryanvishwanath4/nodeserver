const express = require("express");
const app = express();
const fs = require("fs");

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

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

let users = [
  { id: 1, name: "Chaarvi", age: 30 },
  { id: 2, name: "Vihana", age: 25 },
];

const getApiResponse = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(users);
    }, 1000);
  });
};
const saveData = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
};

app.get("/users", async (req, res) => {
  try {
    const result = await getApiResponse();
    res.json(result);
  } catch (error) {
    console.log("error", error);
  }
});

app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  res.json(user);
});

app.post("/users", async (req, res) => {
  try {
    const newUser = req.body;
    if (!newUser || !newUser.name || !newUser.age) {
      res.status(400).json({ message: "Invalid user data" });
      return;
    }

    await saveData(newUser);

    newUser.id = users.length + 1;
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
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
