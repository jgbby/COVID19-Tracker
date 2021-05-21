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

    console.log(data.Today);
    console.log(data.Yesterday);
    displayData(data);
  }
});

// Listen for user input
userInput();

// Render Data
function displayData(data) {
  // List of all geographical locations to iterate through
  present_keys = Object.keys(data.Today);
  past_keys = Object.keys(data.Yesterday);
  areas = present_keys.filter((element) => past_keys.includes(element));

  // Compute US Total
  usTotalPresent = data.Today.USATotal;
  usTotalPast = data.Yesterday.USATotal;

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
    e = data.Today[areas[i]];
    ePast = data.Yesterday[areas[i]];

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
  return (past == 0) ? 0 : percentage;
}

function getPercentChangeInHTML(past, present){

  // Remove all commas
  strs = [past, present];
  newStrs = ["", ""];
  for (let i=0; i < 2; i++){
    for (let j=0; j < strs[i].length; j++){
      if (strs[i][j] != ",") newStrs[i] += strs[i][j]
    }
  }
  past = newStrs[0];
  present = newStrs[1];

  // Calculate Percent Change
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

  // Float Formatting because decimals are tough to see
  percentageStr = percentage.toString();
  if (percentageStr.includes(".")){
    index1 = percentageStr.indexOf(".") - 1;
    index2 = percentageStr.indexOf(".") + 1;
    period = ". "
    if (percentageStr[index2] == "2") period = " " + period;
    percentageStr = percentageStr.slice(0, index1) + period + percentageStr.slice(index2, percentageStr.length);
  }

  
  return "<span style='color: " + color + "'> " + sign + percentageStr + "%</span>";
}

// Fix states
function fixState(state) {
  return state.replace(/([A-Z])/g, " $1").trim();
}
