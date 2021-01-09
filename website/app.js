/* Global Variables */

// zip code input section
const zip = document.getElementById("zip");
const zipSubmit = document.getElementById("getTemp");
const zipFeed = document.querySelector("#zipFeed");

// feeling section
const feeling = document.getElementById("feelings");
const feelingFeed = document.getElementById("feelingFeed");
const generate = document.getElementById("generate");

// url
const BaseURL = "http://localhost:3000";

// Create a new date instance dynamically with JS

/**
 * @returns : the current date dd/mm/yy
 */
const getCurrentDate = () => {
  let d = new Date();
  let newDate = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
  return newDate;
};

// helper function

/**
 * @returns {string} : the input zip code value
 */
const getZip = () => zip.value;

/**
 * @description check the value of textarea
 * @returns {string} : the textarea feeling value
 * @returns {alert} : alert the user that the text area is empty
 * @todo : handle the empty textarea
 */
const getFeeling = () => {
  if (feeling.value != "") {
    return feeling.value;
  } else {
    alert("your feeling is important...");
    sendFeed("please Enter your feeling first", feelingFeed);
  }
};

/**
 * @description : update the description about the zipCode input
 * @param {string} feed : the msg to display in the UI realated the zip code input
 * @param  ele:the element to update
 */
const sendFeed = (feed, ele = zipFeed) => (ele.textContent = feed);

/**
 * @returns {Array<{date:string,temperature:number,user_res:string}>}
 * array of all the data form the backend
 */
const fetchData = async () => {
  const res = await fetch(BaseURL + "/data");
  try {
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

// main function

/**
 * @description : add the data to the UI
 * @param {Array<{date:string,temperature:number,user_res:string}>} data
 *  all the data from the backend
 */
const appendData = (data) => {
  const container = document.getElementById("entryHolder");
  if (data.length > 0) {
    container.innerHTML = "";
    data.forEach(({ date, temperature, user_res }, i, arr) => {
      const card = `
      <div id="card" class="row my-4 text-primary text-monospace">
      <div class="row col-12">
        <div id="date" class="col-6">
          <span class="text-bold">At :- </span> ${date}
        </div>
        <div id="temp" class="col-6">
          <span class="text-bold">Temp:- </span> ${temperature} Fْ
        </div>
      </div>
      <div id="content" class="col-12 mt-1">${user_res}</div>
    </div>
    `;
      container.innerHTML += card;
    });
  }
};

/**
 * @description
 * fetch the temprature for the zip code of the city
 * update the UI description of zip Code input
 * @returns {number} : the temprature
 */
const fetchTemp = async () => {
  const zipCode = parseFloat(getZip());
  if (typeof zipCode !== "number") {
    sendFeed("the zip code must be number ");
  } else {
    const res = await fetch(BaseURL + "/temp", {
      method: "POST",
      body: JSON.stringify({ zip: zipCode }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    try {
      const { temp } = await res.json();
      sendFeed(`the temprature today is ${temp} Fْ  :)`);
      return temp;
    } catch (error) {
      console.error(error);
    }
  }
};

/**
 * @description :
 * post the object { user_res:getFeeling(), temperature:getTemp(), date:getCurrentDate }
 * then
 * fetch all the data from the server fetchData()
 * then
 * update the UI element appendData()
 */
const handelSubmit = async () => {
  const user_res = getFeeling();
  if (!user_res) return;

  const temperature = await fetchTemp();
  if (!temperature) return;

  const date = getCurrentDate();
  const data = { user_res, temperature, date };

  const res = await fetch(BaseURL + "/add", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    const { ok } = await res;
    if (ok) {
      const allData = await fetchData();
      appendData(allData);
    }
  } catch (err) {
    console.log(err);
  }
};

// event listner
zipSubmit.addEventListener("click", fetchTemp);
generate.addEventListener("click", handelSubmit);
