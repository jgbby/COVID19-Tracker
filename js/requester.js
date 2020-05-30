chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === "GET_DATA" ){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://www.worldometers.info/coronavirus/country/us/", true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            // innerText does not let the attacker inject HTML elements.
            var html = xhr.responseText;
            var dom = $(html);
            var rows = [];
            dom.find("#usa_table_countries_today > tbody > tr").each((index, element) => {
        
                // States
                var state = ($($(element).find('td')[0]).text());
                state = state.replace(/\s+/g, '');
        
                // Total Cases
                var totalCases = ($($(element).find('td')[1]).text());
                totalCases = totalCases.replace(/\s+/g, '');
                if (!totalCases){
                    totalCases = "N/A";
                }
            
                // New Cases
                var newCases = ($($(element).find('td')[2]).text());
                newCases = newCases.replace(/\s+/g, '');
                if (!newCases){
                    newCases = "N/A";
                }


                // Total Deaths
                var totalDeaths = ($($(element).find('td')[3]).text());
                totalDeaths = totalDeaths.replace(/\s+/g, '');
                if (!totalDeaths){
                    totalDeaths = "N/A";
                }


                // New Deaths
                var newDeaths = ($($(element).find('td')[4]).text());
                newDeaths = newDeaths.replace(/\s+/g, '');
                if (!newDeaths){
                    newDeaths = "N/A";
                }


                // Active Cases
                var activeCases = ($($(element).find('td')[5]).text());
                activeCases = activeCases.replace(/\s+/g, '');
                if (!activeCases){
                    activeCases = "N/A";
                }


                // Push to row
                rows.push({
                    state: state,
                    totalCases: totalCases,
                    newCases: newCases,
                    totalDeaths: totalDeaths,
                    newDeaths: newDeaths,
                    activeCases: activeCases
                })
            });

            // getYesterday
            var rows1 = [];
            dom.find("#usa_table_countries_yesterday > tbody > tr").each((index, element) => {
        
                // States
                var state = ($($(element).find('td')[0]).text());
                state = state.replace(/\s+/g, '');
        
                // Total Cases
                var totalCases = ($($(element).find('td')[1]).text());
                totalCases = totalCases.replace(/\s+/g, '');
                if (!totalCases){
                    totalCases = "Unsure";
                }
            
                // New Cases
                var newCases = ($($(element).find('td')[2]).text());
                newCases = newCases.replace(/\s+/g, '');
                if (!newCases){
                    newCases = "Unsure";
                }


                // Total Deaths
                var totalDeaths = ($($(element).find('td')[3]).text());
                totalDeaths = totalDeaths.replace(/\s+/g, '');
                if (!totalDeaths){
                    totalDeaths = "Unsure";
                }


                // New Deaths
                var newDeaths = ($($(element).find('td')[4]).text());
                newDeaths = newDeaths.replace(/\s+/g, '');
                if (!newDeaths){
                    newDeaths = "unsure";
                }


                // Active Cases
                var activeCases = ($($(element).find('td')[5]).text());
                activeCases = activeCases.replace(/\s+/g, '');
                if (!activeCases){
                    activeCases = "Unsure";
                }


                // Push to row
                rows1.push({
                    state: state,
                    totalCases: totalCases,
                    newCases: newCases,
                    totalDeaths: totalDeaths,
                    newDeaths: newDeaths,
                    activeCases: activeCases
                })
            });

            data = [rows, rows1];
            // Send Data
            chrome.runtime.sendMessage({ cmd: "DATA_RESPONSE", data: data });
            console.log("Sent: " + data);
          }
        }
        xhr.send();
    }
});
