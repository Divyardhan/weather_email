function showSpinner() {
    document.getElementById("weatherReport").innerHTML="";
    document.getElementById("spinner").style.display = "block";
    document.getElementById("loading").style.display = "block";
}
function hideSpinner() {
    document.getElementById("spinner").style.display = "none";
    document.getElementById("loading").style.display = "none";
}
function getStatusText(statusCode) {
    switch (statusCode) {
        case 0:
            return "Requested";
        case 1:
            return "Processing";
        case 2:
            return "Solved";
        default:
            return "Unknown";
    }
}
function getquery(email){
    fetch('/getAllQuery/'+ encodeURIComponent(email))
        .then(response => response.json())
        .then(queryData => {
            const queryTable = document.getElementById('queryTable'); // Get the table element
            queryTable.innerHTML = ""; // Clear existing content
            const tableHeadings = ["Date", "Time", "Query", "Status"];
            const headerRow = document.createElement('tr');
            tableHeadings.forEach(heading => {
                const th = document.createElement('th');
                th.textContent = heading;
                headerRow.appendChild(th);
            });
            queryTable.appendChild(headerRow);
            if (Array.isArray(queryData)) {
                queryData.forEach(query => {
                    const row = document.createElement('tr');
                    const dateTime = new Date(query.fields.date);
                    const date = dateTime.toLocaleDateString();
                    const time = dateTime.toLocaleTimeString();
                    row.innerHTML = `
                        <td>${date}</td>
                        <td>${time}</td>
                        <td>${query.fields.query}</td>
                        <td>${getStatusText(query.fields.status)}</td>
                    `;
                    queryTable.appendChild(row);
                });
            } else {
                console.error('Query data is not in the expected format.');
                // Handle other unexpected data formats here
            }
    })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });
}
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Check if the cookie contains the CSRF token
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.addEventListener("DOMContentLoaded", function(event) {
    event.preventDefault();
    document.querySelector('.extension').style.display = 'none';
    document.querySelector('.service').style.display = 'none';
    document.querySelector('.profile').style.display = 'none';
    document.querySelector('.Query').style.display = 'none';
    document.getElementById("nameError").style.display = "none";
        
    document.getElementById('delete').addEventListener('touchstart', function(){
        if (confirm("Are you sure you want to delete?")) {
            document.querySelector("form.delete").submit();
        } else {
            // Do nothing if the user cancels
        }
    });

    document.getElementById('logout').addEventListener('touchstart', function(){
            document.querySelector("form.logout").submit();
    });

    document.querySelector('.hamburger-menu').addEventListener('click', function(event) {
        var options = document.querySelector('.options');
        options.classList.toggle('hide');
        event.stopPropagation(); // Prevents the click event from bubbling up to the document
    });
    
    document.addEventListener('click', function(event) {
        var options = document.querySelector('.options');
        if (!event.target.closest('.options') && !event.target.closest('.hamburger-menu')) {
            options.classList.add('hide');
        }
    });
    
    document.getElementById('report').addEventListener('click', function(){
        document.querySelector('.report').style.display = 'block';
        document.querySelector('.extension').style.display = 'none';
        document.querySelector('.service').style.display = 'none';
        document.querySelector('.profile').style.display = 'none';
        document.querySelector('.Query').style.display = 'none';
        document.querySelector('.options').classList.toggle('hide');
    });

    document.getElementById('extension').addEventListener('click', function(){
        document.querySelector('.report').style.display = 'none';
        document.querySelector('.extension').style.display = 'block';
        document.querySelector('.service').style.display = 'none';
        document.querySelector('.profile').style.display = 'none';
        document.querySelector('.Query').style.display = 'none';
        document.querySelector('.options').classList.toggle('hide');
    });
    
    document.getElementById('service').addEventListener('click', function(){
        document.querySelector('.report').style.display = 'none';
        document.querySelector('.extension').style.display = 'none';
        document.querySelector('.service').style.display = 'block';
        document.querySelector('.profile').style.display = 'none';
        document.querySelector('.Query').style.display = 'none';
        document.querySelector('.options').classList.toggle('hide');
    });
    
    document.getElementById('profile').addEventListener('click', function(){
        document.querySelector('.report').style.display = 'none';
        document.querySelector('.extension').style.display = 'none';
        document.querySelector('.service').style.display = 'none';
        document.querySelector('.profile').style.display = 'block';
        document.querySelector('.Query').style.display = 'none';
        document.querySelector('.options').classList.toggle('hide');
    });

    document.getElementById('query').addEventListener('click', function(){
        document.querySelector('.report').style.display = 'none';
        document.querySelector('.extension').style.display = 'none';
        document.querySelector('.service').style.display = 'none';
        document.querySelector('.profile').style.display = 'none';
        document.querySelector('.Query').style.display = 'block';
        document.querySelector('.options').classList.toggle('hide');
    });

    document.getElementById('edit').addEventListener('click', function(){
        var name = document.getElementById('name').value.trim();
        var checkbox = document.getElementById("toggleSwitch");
        document.getElementById("pwdError").style.display = "none";
        document.getElementById("nameError").style.display = "none";
        if (name === "" ){
            document.getElementById("nameError").style.display = "block";
        }else{
            document.querySelector("form.edit_profile").submit();
        }
    });

    document.getElementById('search').addEventListener('click', function(event) {
        event.preventDefault();
        if (document.getElementById('search').disabled === true) {
        }else {
            const city = document.getElementById('location').value.trim();
            if (city === ''){
                document.getElementById('cityError').style.display='block';
            }else{
                document.getElementById('cityError').style.display='none';
                document.getElementById('search').disabled = true;
                var searchQuery = document.getElementById('location').value;
                const currentDate = new Date();
                const numberOfDaysToAdd = 1;
                showSpinner()
                fetch('http://192.168.71.60:8888/weather_report/'+ searchQuery)
                    .then(response => response.json())
                    .then(weather_data => {
                        hideSpinner()
                        const weatherReportElement = document.getElementById('weatherReport');
                        weatherReportElement.innerHTML = ""; // Clear existing content
                        if (Array.isArray(weather_data)) {
                            weather_data.forEach(weather => {
                                console.log(weather)
                                const year = currentDate.getFullYear();
                                const month = currentDate.getMonth() + 1; // January is 0
                                const day = currentDate.getDate();
                                // Format the incremented date as needed (e.g., YYYY-MM-DD)
                                const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                                const weatherDetailsHTML = `
                                    <div class="container">
                                        <div class="left-side1">
                                            <h3>Wind</h3>
                                            <p><span>${weather.Wind}</span></p>
                                            <h3>Temperature</h3>
                                            <p><span>${weather.Temperature}</span></p>
                                            <h3>Humidity</h3>
                                            <p><span>${weather.Humidity}</span></p>
                                        </div>
                                        <div class="middle-side1">
                                            <h3>Date</h3>
                                            <p><span>${formattedDate}</span></p>
                                            <h3>Day</h3>
                                            <p><span>${weather.Day}</span></p>
                                            <h3>Weather</h3>
                                            <p><span>${weather.Weather}</span></p>
                                            <div class="weather-image">
                                                <img src="${weather.ImageURL}" alt="Weather Image">
                                            </div>
                                        </div>
                                        <div class="right-side1">
                                            <h3>Precipitation</h3>
                                            <p><span>${weather.Precipitation}</span></p>
                                            <h3>Min Temperature</h3>
                                            <p><span>${weather['Min Temperature']}</span></p>
                                            <h3>Max Temperature</h3>
                                            <p><span>${weather['Max Temperature']}</span></p>
                                        </div>
                                    </div>
                                `;
                                weatherReportElement.innerHTML += weatherDetailsHTML;
                                currentDate.setDate(currentDate.getDate() + numberOfDaysToAdd);
                            });
                        } else {
                            // Handle the case when weather_data is not an array
                            console.error('Weather data is not in the expected format.');
                        }
                    })
                    .catch(error => {
                        // Handle errors
                        console.error('Error:', error);
                    });
                document.getElementById('search').disabled = false;
            }
        }  
    });

    document.getElementById('query_submit').addEventListener('click', function(event) {
        event.preventDefault();
        var problem = document.getElementById('problem').value.trim(); // Get the input value and trim any leading/trailing whitespace
    
        if (problem.length == 0) {
            document.getElementById("length_error").style.display = 'none';
            document.getElementById("empty_query").style.display = 'block'; // Hide the error message if input length is greater than or equal to 10
        } else if (problem.length <= 9) {
            document.getElementById("empty_query").style.display = 'none';
            document.getElementById("length_error").style.display = 'block'; // Hide the error message if input length is less than 10
        } else {
            document.getElementById("length_error").style.display = 'none';
            document.getElementById("empty_query").style.display = 'none'; 
            var email = document.getElementById("email").value.trim();
            var dateTimeInput = document.getElementById("date");
            var currentDate = new Date();
            var year = currentDate.getFullYear();
            var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            var day = currentDate.getDate().toString().padStart(2, '0');
            var hours = currentDate.getHours().toString().padStart(2, '0');
            var minutes = currentDate.getMinutes().toString().padStart(2, '0');
            var seconds = currentDate.getSeconds().toString().padStart(2, '0');
            var formattedDateTime = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds;
            dateTimeInput.value = formattedDateTime.toString();
            var formData = new FormData();
            formData.append('problem', problem);
            formData.append('email', email);
            formData.append('date', formattedDateTime);

            var csrftoken = getCookie('csrftoken');
            fetch('/query/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken
                },
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Handle successful response
                return response.json();
            })
            .then(data => {
                // Handle data from the response
                console.log('Response from server:', data);
                // Call getquery function or perform other actions as needed
                getquery(email);
                document.getElementsByClassName('problem_submit')[0].reset();
            })
            .catch(error => {
                // Handle errors
                console.error('Error occurred:', error);
            });
        }
        
    });

    document.getElementById('re').addEventListener('click', function(event) {
        event.preventDefault();
        var email = document.getElementById("email").value.trim();
        getquery(email)
    });
});