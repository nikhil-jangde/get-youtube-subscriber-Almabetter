const express = require("express");
const path = require("path");
//SCHEMA
const schema = require("./models/subscribers");
const { error } = require("console");
const app = express();

//PARSE INCOMING JSON DATA
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//HOME PAGE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

//THIS ROUTE SHOWS ALL THE SUBSCRIBERS LIST WITH DETAILS
app.get("/subscribers", async (req, res, next) => {
  try {
    let subscribers = await schema.find();
    res.status(200).json(subscribers);
  } catch (err) {
    res.status(400);
    next(err);
  }
});

//THIS ROUTE PROVIDES AN ARRAY OF ALL SUBSCRIBERS WITH ONLY TWO FIELDS, THEIR NAME AND SUBSCRIBED CHANNEL.
app.get("/subscribers/names", async (req, res, next) => {
  try {
    let subscribers = await schema.find(
      {},
      { name: 1, subscribedChannel: 1, _id: 0 }
    );
    res.status(200).json(subscribers);
  } catch (err) {
    res.status(400);
    next(err);
  }
});

// THIS ROUTE PROVIDES THE DETAILS OF SUBSCRIBER WITH THE GIVEN ID.
// app.get("/subscribers/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const subscribers = await schema.findById(id);
//     res.send(subscribers);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
app.get("/subscribers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "No ID provided" });
      return;
    }
    const subscriber = await schema.findById(id);
    if (!subscriber) {
      res.status(404).json({ message: "Subscriber not found" });
      return;
    }
    res.send(subscriber);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// HANDLES ALL THE UNWANTED REQUESTS.
app.use((req, res) => {
  res.status(404).json({ message: "Error - Route not found" });
});

module.exports = app;
