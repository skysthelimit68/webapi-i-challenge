// require the express npm module, needs to be added to the project using "yarn add" or "npm install"
const express = require("express");
const data = require("./data/db.js");

// creates an express application using the express module
const server = express();
server.use(express.json());

const hobbits = [
  {
    id: 1,
    name: "Samwise Gamgee"
  },
  {
    id: 2,
    name: "Frodo Baggins"
  }
];

// configures our server to execute a function for every GET request to "/"
// the second argument passed to the .get() method is the "Route Handler Function"
// the route handler function will run on every GET request to "/"
server.get("/", (req, res) => {
  // express will pass the request and response objects to this function
  // the .send() on the response object can be used to send a response to the client
  res.send("Hello World");
});

server.get("/hobbits", (req, res) => {
  res.status(200).json(hobbits);
});

server.get("/api/users", (req, res) => {
  data
    .find()
    .then(response => {
      console.log(response);
      res.status(200).json(response);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

server.post("/api/users", (req, res) => {
  console.log(req);
  const username = req.body.name;
  const userbio = req.body.bio;
  if (!username || !userbio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
    return;
  }

  data
    .insert({ name: username, bio: userbio })
    .then(response => {
      console.log(response);
      res.status(201).json(response);
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the user to the database"
      });
    });
});

server.get("/api/users/:id", (req, res) => {
  data
    .findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

server.put("/api/users/:id", (req, res) => {
  const { name, bio } = req.body;
  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
  data
    .update(req.params.id, { name, bio })
    .then(newUser => {
      if (newUser === 0) {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      } else {
        res.status(200).json(newUser);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be modified." });
    });
});

server.delete("/api/users/:id", (req, res) => {
  data
  .remove(req.params.id)
  .then ( user => {
    if (user === 0) {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else {
      res.status(200).json({ message: "The user has been deleted."});
    }
  })
  .catch (err => {
    res.status(500).json({ error: "The user could not be removed" })
  })

})


// once the server is fully configured we can have it "listen" for connections on a particular "port"
// the callback function passed as the second argument will run once when the server starts
server.listen(8000, () => console.log("API running on port 8000"));
