function disableUser(userEmail) {
    fetch(`/disableUser/${userEmail}`)
    .then(response => {
        if (response.ok) {
            var search_query = document.getElementById('search_query').value.trim();
            if (search_query === ""){
                refresh()
            } else {
                searchUser()
            }
        } else {
            console.error('Failed to disable user');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function searchUser(){   
    var search_query = document.getElementById('search_query').value.trim();
    fetch('/search_user/' + search_query)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response from server:', data);
        const queryTable = document.getElementById('queryTable');
        queryTable.innerHTML = "";
        if (Array.isArray(data)) {
            if (data.length > 0) {
                const tableHeadings = ["Name", "Email", "Location", "Verified", "Server Provided", "Is Active", "Deleted", "Disabled"];
                const headerRow = document.createElement('tr');
                tableHeadings.forEach(heading => {
                    const th = document.createElement('th');
                    th.textContent = heading;
                    headerRow.appendChild(th);
                });
                queryTable.appendChild(headerRow);
                data.forEach(query => {
                    const row = document.createElement('tr');
                    row.addEventListener('click', () => {
                        disableUser(query.email);
                    });
                    row.innerHTML = `
                        <td>${query.name}</td>
                        <td>${query.email}</td>
                        <td>${query.location}</td>
                        <td>${query.verified}</td>
                        <td>${query.service_provided}</td>
                        <td>${query.isActive}</td>
                        <td>${query.deleted}</td>
                        <td>${query.disabled}</td>
                    `;
                    queryTable.appendChild(row);
                });
            } else {
                const noDataRow = document.createElement('tr');
                const noDataCell = document.createElement('td');
                noDataCell.textContent = 'No data found';
                noDataCell.colSpan = 8;
                noDataRow.appendChild(noDataCell);
                queryTable.appendChild(noDataRow);
            }
        } else {
            console.error('Query data is not in the expected format.');
        }
    })
    .catch(error => {
        console.error('Error occurred:', error);
    });
}

function loadSection(id){
    fetch('/admin_dashboard/' + id)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.html_content);
        document.getElementById('target_element').innerHTML = data.html_content;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function refresh(){
    loadSection("user")
}

function queryUpdate(id){
    fetch('/queryUpdate/' + id)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }else{
            loadSection("query")
        }
        return response.json();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

document.addEventListener("DOMContentLoaded", function(){
    var activeLinkId = 'home';
    loadSection("home")
    document.querySelector('.options ul').addEventListener('click', function(event) {
        document.querySelector('.options').classList.toggle('hide');
        if (event.target.tagName === 'A' && event.target.parentElement.tagName === 'LI') {
            event.preventDefault();
            var id = event.target.parentElement.id;
            if (id !== activeLinkId) {
                loadSection(id)
                activeLinkId = id;
            }
        }
    });
    document.addEventListener('click', function(event) {
        var options = document.querySelector('.options');
        if (!event.target.closest('.options') && !event.target.closest('.hamburger-menu')) {
            options.classList.add('hide');
        }
    });
    document.querySelector('.hamburger-menu').addEventListener('click', function(event) {
        var options = document.querySelector('.options');
        options.classList.toggle('hide');
        event.stopPropagation(); // Prevents the click event from bubbling up to the document
    });
});