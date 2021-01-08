// Setup empty JS object to act as endpoint for all routes
const Data = [];
const bodyParser = require("body-parser");
const Cors = require("cors");
// Require Express to run server and routes
const express = require("express");
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(Cors());
// Initialize the main project folder
app.use(express.static("website"));
/* Express Routes */

// get
// DOC
/**
 * @description
 */
app.get("/data", (req, res, next) => {
  res.send(Data);
});

// post
// DOC
/**
 * @description
 */
app.post("/add", (req, res, next) => {
  const data = req.body;

  // validate the object
  const validatData = () =>
    data.hasOwnProperty("temperature") &&
    data.hasOwnProperty("date") &&
    data.hasOwnProperty("response");

  //? Make sure your POST route is setup to add each of these values with a key to projectData.

  if (validatData()) {
    Data.push(data);
    res.send("data added");
  } else {
    res.send("not valid object");
  }
});

// Setup Server
const port = 3000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
