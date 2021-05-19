// Empty Cache and Filter
let cache = null;
let filtered = null;

// Declare Global Vars
var data;

// Notify of wake
chrome.runtime.sendMessage({ cmd: "GET_DATA" });

// Refresh every 60 seconds
var interval = setInterval(function () {
  chrome.runtime.sendMessage({ cmd: "GET_DATA" });
  console.log("GET_DATA");
}, 300000);

// Listen for data
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === "DATA_RESPONSE") {
    console.log("Recieved Data");
    data = request.data;

    console.log(data[0]);
    console.log(data[1]);
    displayData(data);
  }
});

// Listen for user input
userInput();

// Render Data
function displayData(data) {
  // List of all geographical locations to iterate through
  present_keys = Object.keys(data[0]);
  past_keys = Object.keys(data[1]);
  areas = present_keys.filter((element) => past_keys.includes(element));

  // Compute US Total
  usTotalPresent = data[0]["USATotal"];
  usTotalPast = data[1]["USATotal"];

  // Percent Change for total US cases
  var USTotalPercentChange = getPercentChangeInHTML(usTotalPast.activeCases, usTotalPresent.activeCases);

  // Display US Total Row
  addRow(
    "US",
    USTotalPercentChange,
    usTotalPresent.totalCases,
    usTotalPresent.activeCases,
    usTotalPresent.newCases,
    usTotalPresent.totalDeaths,
    usTotalPresent.newDeaths
  );

  // Iterate through each location's data
  for (i = 1; i < areas.length; i++) {
    e = data[0][areas[i]];
    ePast = data[1][areas[i]];

    // Get Percentage and format Positive and Negative
    var areaPercentChange = getPercentChangeInHTML(ePast.activeCases, e.activeCases)

    // Display Row
    addRow(
      fixState(areas[i]),
      areaPercentChange,
      e.totalCases,
      e.activeCases,
      e.newCases,
      e.totalDeaths,
      e.newDeaths
    );
  }
}

// Display Row to pop.html
function addRow(
  state,
  percentage,
  totalCases,
  activeCases,
  newCases,
  deaths,
  newDeaths
) {

  var selector = (state == "US") ? "#total" : "tbody";
  document.querySelector(selector).innerHTML +=
    "\
  <tr>\
    <td>" +
    state +
    "</td>\
    <td>" +
    percentage +
    "</td>\
    <td>" +
    totalCases +
    "</td>\
    <td>" +
    activeCases +
    "</td>\
    <td>" +
    newCases +
    "</td>\
    <td>" +
    deaths +
    "</td>\
    <td>" +
    newDeaths +
    "</td>\
  </tr>";
}

// User Input
function userInput() {
  // Start Clicked
  $("#replace").click(function () {
    var message = document.querySelector("#message").value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { cmd: "REPLACE", message: message });
      console.log("SENT REPLACE");
    });
  });
}

function calculatePercentChange(past, present){

  var percentage = (
    100 * (present - past) 
              / past
    ).toFixed(2);
  return percentage;
}

function getPercentChangeInHTML(past, present){

  if (past.includes(",")) past = removeCommas(past); 
  if (present.includes(",")) present = removeCommas(present);

  var percentage = calculatePercentChange(past, present);

  // Check positive or negative
  var color = '';
  var sign = '';
  if (percentage >= 0) {
    color = 'red';
    sign = '+';
  }
  else {
    percentage *= -1;
    color = '#5ced83';
    sign = '-';
  }
  percentage = Math.abs(percentage)

  // Float Formatting
  percentageStr = percentage.toString();
  index = percentageStr.indexOf(".") + 1;
  percentageStr = percentageStr.slice(0, index) + " " + percentageStr.slice(index, percentageStr.length);
  return "<span style='color: " + color + "'> " + sign + percentageStr + "%</span>";

}

function removeCommas(str){
  newStr = "";
  for (let i=0; i < str.length; i++){
    if (str[i] != ",") newStr += str[i]; 
  }
  return newStr;
}

// Fix states
function fixState(state) {
  return state.replace(/([A-Z])/g, " $1").trim();
}
