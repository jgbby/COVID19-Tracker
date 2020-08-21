chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === "GET_DATA" ){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://www.worldometers.info/coronavirus/country/us/", true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            // innerText does not let the attacker inject HTML elements.
            var html = xhr.responseText;
            var dom = $(html);
            var rows = {};

/*             $($("#usa_table_countries_today > tbody > tr")[0]).children().each((index, e) => {
                console.log(e.innerText)
            }); */

            var headers = {
                "USAState" : -1,
                "TotalCases" : -1,
                "NewCases" : -1,
                "TotalDeaths" : -1,
                "NewDeaths" : -1,
                "ActiveCases" : -1,
            }
            var tags = Object.keys(headers);
            tags.forEach(tag => {
                headers[tag] = dom.find("th:contains(" + tag + ")").index();
            })


            dom.find("#usa_table_countries_today > tbody > tr").each((index, element) => {
        
                // States
                var state = ($($(element).find('td')[headers["USAState"]]).text());
                state = state.replace(/\s+/g, '');
        
                // Total Cases
                var totalCases = ($($(element).find('td')[[headers["TotalCases"]]]).text());
                totalCases = totalCases.replace(/\s+/g, '');
                if (!totalCases){
                    totalCases = "0";
                }
            
                // New Cases
                var newCases = ($($(element).find('td')[[headers["NewCases"]]]).text());
                newCases = newCases.replace(/\s+/g, '');
                if (!newCases){
                    newCases = "0";
                }


                // Total Deaths
                var totalDeaths = ($($(element).find('td')[[headers["TotalDeaths"]]]).text());
                totalDeaths = totalDeaths.replace(/\s+/g, '');
                if (!totalDeaths){
                    totalDeaths = "0";
                }


                // New Deaths
                var newDeaths = ($($(element).find('td')[[headers["NewDeaths"]]]).text());
                newDeaths = newDeaths.replace(/\s+/g, '');
                if (!newDeaths){
                    newDeaths = "0";
                }


                // Active Cases
                var activeCases = ($($(element).find('td')[[headers["ActiveCases"]]]).text());
                activeCases = activeCases.replace(/\s+/g, '');
                if (!activeCases){
                    activeCases = "0";
                }


                // Push to row
                rows[state] = {
                    totalCases: totalCases,
                    newCases: newCases,
                    totalDeaths: totalDeaths,
                    newDeaths: newDeaths,
                    activeCases: activeCases
                }
            });

            // getYesterday
            var rows1 = {};
            dom.find("#usa_table_countries_yesterday > tbody > tr").each((index, element) => {
        
                // States
                var state = ($($(element).find('td')[headers["USAState"]]).text());
                state = state.replace(/\s+/g, '');
        
                // Total Cases
                var totalCases = ($($(element).find('td')[headers["TotalCases"]]).text());
                totalCases = totalCases.replace(/\s+/g, '');
                if (!totalCases){
                    totalCases = "Unsure";
                }
            
                // New Cases
                var newCases = ($($(element).find('td')[headers["NewCases"]]).text());
                newCases = newCases.replace(/\s+/g, '');
                if (!newCases){
                    newCases = "Unsure";
                }


                // Total Deaths
                var totalDeaths = ($($(element).find('td')[headers["TotalDeaths"]]).text());
                totalDeaths = totalDeaths.replace(/\s+/g, '');
                if (!totalDeaths){
                    totalDeaths = "Unsure";
                }


                // New Deaths
                var newDeaths = ($($(element).find('td')[headers["NewDeaths"]]).text());
                newDeaths = newDeaths.replace(/\s+/g, '');
                if (!newDeaths){
                    newDeaths = "unsure";
                }


                // Active Cases
                var activeCases = ($($(element).find('td')[headers["ActiveCases"]]).text());
                activeCases = activeCases.replace(/\s+/g, '');
                if (!activeCases){
                    activeCases = "Unsure";
                }


                // Push to row
                rows1[state] = {
                    totalCases: totalCases,
                    newCases: newCases,
                    totalDeaths: totalDeaths,
                    newDeaths: newDeaths,
                    activeCases: activeCases
                }
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
