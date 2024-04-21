function addEvent() {
    // Select the button by its id
    const volunteerBtn = document.getElementById('volunteer-btn');

    // Add an event listener to the button
    volunteerBtn.addEventListener('click', function() {
        // Display the collected information
        var x = document.getElementById("form-row");
        x.style.visibility = "visible";
    });
}

function donationOnLoad(){
    // Select the button by its id
    const btnSearch = document.getElementById('btnSearch');

    // Add an event listener to the button
    btnSearch.addEventListener('click', function() {
        // Display the collected information
        var x = document.getElementById("charity");
        var myTable = document.getElementById("donations-table");
        var rowCount = myTable.rows.length;   
        for(let x = 0; x<rowCount; x++) {
            myTable.deleteRow(0);
        }    
        fetchProjects(x.value);
    });
    const searchQuery = 'flood';
    fetchProjects(searchQuery)
}

function loadCharity() {
     // Parse the URL
     const url = new URL(window.location.href);
    
     // Get a specific parameter by name
     const id = url.searchParams.get('id');

     const charity = charities[id];
     document.getElementById('title').innerHTML = charity.name
     document.getElementById('address').innerHTML = charity.contact_information.address
     document.getElementById('phone').innerHTML = charity.contact_information.phone
     document.getElementById('email').innerHTML = charity.contact_information.email
     document.getElementById('description').innerHTML = charity.description
     document.getElementById('mission').innerHTML = charity.mission
     document.getElementById('impact').innerHTML = charity.impact
     document.getElementById('opportunities').innerHTML = charity.opportunities_to_get_involved
}

function fetchProjects(searchQuery) {
    const apiKey = '7103475b-fa77-4ac8-9e91-2a654c1a1414'; // Replace 'YOUR_API_KEY' with your actual API key
    const country = 'US';
    const apiUrl = `https://api.globalgiving.org/api/public/services/search/projects?api_key=${apiKey}&q=${searchQuery}&filter=country:${country}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(xmlString => {
            // Parse XML string to XML document
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

            // Now you can work with the xmlDoc object to access and manipulate XML data
            // For example, to get project titles:
            const projects = xmlDoc.getElementsByTagName('project');
            let jsonArray = [];
            for (let i = 0; i < projects.length; i++) {
                //console.log(projects[i].textContent);
                let project = xmlToJson(projects[i])
                jsonArray.push(project)
                console.log(project.title['#text'])
                // console.log(project.organization.name['#text'])
                // console.log(project.organization.addressLine1['#text'])
                // console.log(project.projectLink['#text'])
                // console.log(project.summary['#text'])
            }
            populateTable(jsonArray)
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

}


function xmlToJson(xml) {
    // Create the return object
    var obj = {};

    if (xml.nodeType === 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) === "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) === "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}


function populateTable(jsonArray) {
    // Get the table body element
    const tableBody = document.getElementById('donations-table');

    // Loop through the JSON array and add each object to the table
    jsonArray.forEach(item => {
        // Create a new row
        const row = document.createElement('tr');

        // Create columns for image, name, summary, and link
        const imageCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const summaryCell = document.createElement('td');
        const linkCell = document.createElement('td');

        // Create image element and set its attributes
        const image = document.createElement('img');
        image.src = item.imageLink['#text'];
        image.alt = item.title['#text'];
        image.width = 125;
        image.height = 125;
        image.style = 'border-radius: 25px;' 
        imageCell.appendChild(image);


        // Set text content for name, summary, and link cells
        nameCell.textContent = item.title['#text'];
        summaryCell.textContent = item.summary['#text'];

        // Create link element and set its attributes
        const link = document.createElement('a');
        link.href = item.projectLink['#text'];
        link.textContent = 'Donate';
        link.target = '_blank';
        link.class = 'btn btn-primary'
        linkCell.appendChild(link);

        // Append columns to the row
        row.appendChild(imageCell);
        row.appendChild(nameCell);
        row.appendChild(summaryCell);
        row.appendChild(linkCell);

        // Append the row to the table body
        tableBody.appendChild(row);
        
    });
}
