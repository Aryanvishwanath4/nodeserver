const { MongoClient } = require("mongodb");

// Replace the following with your Atlas connection string
const uri =
  "mongodb+srv://aryanvdsce:aryanvdsce@cluster0.str56k7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}
async function handleRequest(req, res) {
  try {
    const db = client.db("sample_mflix");
    const col = db.collection("users");

    switch (req.method) {
      case "GET":
        if (req.params.name) {
          try {
            const document = await col
              .find({
                name: req.params.name,
              })
              .toArray();
            if (document.length === 0) {
              res.status(404).json({ error: "Document not found" });
              return;
            }
            res.json(document);
          } catch (err) {
            console.error("Error fetching documents:", err);
            res.status(500).json({ error: "Internal server error" });
          }
        } else {
          try {
            const documents = await col.find({}).toArray();
            res.json(documents);
          } catch (err) {
            console.error("Error fetching documents:", err);
            res.status(500).json({ error: "Internal server error" });
          }
        }
        break;
      case "POST":
        try {
          const newDocument = req.body; // Assuming the request body contains the new document
          const result = await col.insertOne(newDocument);
          const insertedId = result.insertedId;
          const insertedDocument = await col.findOne({ _id: insertedId });
          res.json(insertedDocument); // Return the inserted document
        } catch (err) {
          console.error("Error inserting document:", err);
          res.status(500).json({ error: "Internal server error" });
        }
        break;
      case "PUT":
        try {
          const db = client.db("sample_mflix");
          const col = db.collection("users");

          // Extract the document ID from the request parameters
          const name = req.params.name;

          // Extract the updated data from the request body
          const updatedData = req.body;

          // Update the document in the collection
          const result = await col.updateOne(
            { name: name },
            { $set: updatedData }
          );

          // Check if the update operation was successful
          if (result.modifiedCount === 1) {
            // Document updated successfully
            res.json({ message: "Document updated successfully" });
          } else {
            // No document found to update
            res
              .status(404)
              .json({ error: "No document found with the specified name" });
          }
        } catch (err) {
          console.log("error updating document: ", err);
          res.status(500).json({ error: "Internal server error" });
        }
        break;
      case "DELETE":
        // Handle DELETE method
        break;
      default:
        res.status(405).json({ error: "Method not allowed" }); // Return 405 Method Not Allowed for unsupported methods
    }
  } catch (err) {
    console.log(err.stack);
  }
}

module.exports = { handleRequest, connectDB };
