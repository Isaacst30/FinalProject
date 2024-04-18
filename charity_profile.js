

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

