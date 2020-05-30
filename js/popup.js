// Empty Cache and Filter
let cache = null;
let filtered = null;

// Declare Global Vars
var data;

// Notify of wake
chrome.runtime.sendMessage({ cmd: "GET_DATA" });

// Refresh every 60 seconds
var interval = setInterval(function(){
  chrome.runtime.sendMessage({ cmd: "GET_DATA" });
  console.log("GET_DATA")
}, 300000)


// Listen for data
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === "DATA_RESPONSE"){
    console.log("Recieved Data")  
    data = request.data;

    // No cruise ships
    data[0].splice(51, 1);
    data[0].splice(51, 1);
    data[1].splice(51, 1);
    data[1].splice(51, 1);

    console.log(data[0])
    console.log(data[1])
    displayData(data); 
  }
});

// Listen for user input
userInput();

// Render Data
function displayData(data) {

  usTotal = data[0][0]
  var curTotalActiveCases = usTotal.activeCases.replace(/,/g, "");
  var pastTotalActiveCases = data[1][0].activeCases.replace(/,/g, "");
  var totalRow = [];

  // Percentage for total US cases
  var percentage = ((100 * curTotalActiveCases / pastTotalActiveCases) - 100).toFixed(2);
  if (percentage > 0){
    percentage = "<span style='color: red'> +" + percentage + "%</span>";
  }
  else {
    percentage *= -1;
    percentage = "<span style='color: #5ced83'>-" + percentage + "%</span>";
  }

  totalRow.push(
    usTotal.state,
    percentage,
    usTotal.totalCases,
    usTotal.activeCases,
    usTotal.newCases,
    usTotal.totalDeaths,
    usTotal.newDeaths,
  )



  for (i = 1; i < data[0].length; i++){

    e = data[0][i]
    ePast = data[1][i]

    var activeCases = e.activeCases.replace(/,/g, "");
    var pastActiveCases = ePast.activeCases.replace(/,/g, "");

    // Get Percentage and format Positive and Negative
    var percentage = ((100 * activeCases / pastActiveCases) - 100).toFixed(2);
    if (percentage >= 0){
      percentage = "<span style='color: red'> +" + percentage + "%</span>";
    }
    else {
      percentage *= -1;
      percentage = "<span style='color: #5ced83'>-" + percentage + "%</span>";
    }

    // Display Row
    addRow(
      fixState(e.state),
      percentage,
      e.totalCases,
      e.activeCases,
      e.newCases,
      e.totalDeaths,
      e.newDeaths,
    );
  }

  document.querySelector("#total").innerHTML = '\
    <td> US </td>\
    <td>' + totalRow[1] + '</td>\
    <td>' + totalRow[2] + '</td>\
    <td>' + totalRow[3] + '</td>\
    <td>' + totalRow[4] + '</td>\
    <td>' + totalRow[5] + '</td>\
    <td>' + totalRow[6] + '</td>';

  console.log("\nToday's Total Active Cases: " + curTotalActiveCases);
  console.log("\nYesterdays Total Active Cases: " + pastTotalActiveCases);
}

// Display Row to pop.html
function addRow(state, percentage, totalCases, activeCases, newCases, deaths, newDeaths){
  if (state != "USTotal"){
    document.querySelector("tbody").innerHTML += '\
    <tr>\
      <td>' + state + '</td>\
      <td>' + percentage + '</td>\
      <td>' + totalCases + '</td>\
      <td>' + activeCases + '</td>\
      <td>' + newCases + '</td>\
      <td>' + deaths + '</td>\
      <td>' + newDeaths + '</td>\
    </tr>'
  }
}


// User Input
function userInput(){
  // Start Clicked
  $('#replace').click(function(){
    var message = document.querySelector("#message").value;
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
      chrome.tabs.sendMessage(tabs[0].id, {cmd: "REPLACE", message: message});
      console.log("SENT REPLACE");
  
    });
  });
}

// Fix states
function fixState (state) {
  return state.replace(/([A-Z])/g, ' $1').trim()
}
