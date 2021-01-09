/* Global Variables */
const zip = document.getElementById("zip");
const zipSubmit = document.getElementById("getTemp");
const zipFeed = document.querySelector("#zipFeed");

const feeling = document.getElementById("feelings");
// TODO add feed back for the feeling section when empty
const feelingFeed = document.getElementById("feelingFeed");
const generate = document.getElementById("generate");
const BaseURL = "http://localhost:3000";
// Create a new date instance dynamically with JS
const getCurrentDate = () => {
  let d = new Date();
  let newDate = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
  return newDate;
};
// helper function
const getZip = () => zip.value;
const getFeeling = () => {
  if (feeling.value != "") {
    return feeling.value;
  } else {
    alert("your feeling is important...");
  }
};
const sendFeed = (feed) => (zipFeed.textContent = feed);
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
const appendData = (data = []) => {
  const container = document.getElementById("entryHolder");
  /* 
  <div id="date"></div>
  <div id="temp"></div>
  <div id="content"></div>
  */
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
const handelSubmit = async () => {
  const user_res = getFeeling();
  const temperature = await fetchTemp();
  if (!user_res && !temperature) return;
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
// 71621
