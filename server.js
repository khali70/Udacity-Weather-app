// Setup empty JS object to act as endpoint for all routes
const projectData = [];
const data = require("./website/zip.json") || [];
const bodyParser = require("body-parser");
const Cors = require("cors");
const logger = require("morgan");
const fetch = require("node-fetch");
// Require Express to run server and routes
const express = require("express");
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
// Cors for cross origin allowance
app.use(Cors());
// Initialize the main project folder
app.use(express.static("website"));

/* helper functions  */
const getWeather = (city, stateCode = null) => {
  const ApiKey = "7e161dfccb949ec489a187df12c70cd7";
  if (stateCode) {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${stateCode}&appid=${ApiKey}`
    );
  } else {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${ApiKey}`
    );
  }
};
/* Express Routes */

// get
// DOC
/**
 * @description : send all the data to the user when GET at  '/data'
 */
app.get("/data", (req, res, next) => {
  res.send(projectData);
});
app.post("/temp", (req, res, next) => {
  const { zip } = req.body;
  console.log("body", req.body);
  let city = null;
  data.forEach((d, i, ar) => {
    if (d.zip.indexOf(zip) > -1) {
      city = d.city;
    }
  });
  if (city) {
    console.log(city);
    getWeather(city)
      .then((data) => data.json())
      .then((data) => data.main)
      .then(({ temp }) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ temp });
      })
      .catch((err) => console.log(err));
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end("city not found");
  }
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
    data.hasOwnProperty("user_res");

  if (validatData()) {
    projectData.push(data);
    console.log(projectData);
    res.status(200).send("data added");
  } else {
    res.send("not valid object");
  }
});

// Setup Server
const port = 3000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
