// Setup empty JS object to act as endpoint for all routes

const projectData = [];

// import zipcode json data to validat the zip code
const data = require("./website/zip.json") || [];
const bodyParser = require("body-parser");
const Cors = require("cors");

// import morgan to log the requsets in the console
const logger = require("morgan");

// import node fetch to perfrom GET request with fetch
const fetch = require("node-fetch");

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();
// import .env
require("dotenv").config();
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

/**
 * @description fetch the data from the api and send it to the cliend side
 * @param {string} city the city name to search for
 * @param {string} stateCode
 */
const getWeather = (city, stateCode = null) => {
  const ApiKey = process.env.API_KEY;
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

/**
 * @description : send all the data to the user when GET at  '/data'
 */
app.get("/data", (req, res, next) => {
  res.send(projectData);
});

// post

/**
 * @description get the temprature from the cloud add it to the DB and send it to the clint
 */
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

/**
 * @description
 * add new weather feed from the user
 * @param { user_res, temperature, date}
 */
app.post("/add", (req, res, next) => {
  const data = req.body;

  // validate the object
  const validatData = () =>
    data.hasOwnProperty("temperature") &&
    data.hasOwnProperty("date") &&
    data.hasOwnProperty("user_res");

  if (validatData()) {
    // add the data to the DB
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
