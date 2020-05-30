// Listen for data
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === "REPLACE"){
        console.log("RECIEVED REPLACE!")
        var message = request.message;
        document.body.innerHTML = document.body.innerHTML.replace(/Coronavirus/g, message);
        document.body.innerHTML = document.body.innerHTML.replace(/coronavirus/g, message);
        document.body.innerHTML = document.body.innerHTML.replace(/COVID-19/g, message);
        document.body.innerHTML = document.body.innerHTML.replace(/disease/g, message);
        document.body.innerHTML = document.body.innerHTML.replace(/pandemic/g, message);
    }
  });