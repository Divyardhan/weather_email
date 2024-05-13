document.addEventListener("DOMContentLoaded", function() {
    function checkVisibility() {
        var targetElements = document.querySelectorAll('.error');
        var submitButton = document.getElementById('login');
        var visible = false;
        targetElements.forEach(function(element, index) {
            if (element.offsetParent !== null) {
                visible = true;
                console.log('Element with class "error" at index ' + index + ' is currently visible');
            }
        });
        if (visible) {
            submitButton.classList.add('submit-disabled');
        } else {
            submitButton.classList.remove('submit-disabled');
        }
    }
    checkVisibility();
    
    
    document.getElementById("login").addEventListener("click", function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value.trim();
        const pwd = document.getElementById('pwd').value.trim();
        var elements = document.querySelectorAll('.error')
        elements.forEach(function(element) {
            // Do something with each element
            element.style.display = "none";
        });
        if (email === "" || pwd === "") {
            document.getElementById("emailError").style.display = "none";
            document.getElementById("pwdError").style.display = "none";
            if (email.trim() === "") {
                document.getElementById("emailError").style.display = "block";
            }
            if (pwd.trim() === "") {
                document.getElementById("pwdError").style.display = "block";
            }
        } else {
            fetch('https://ipinfo.io/json')
                .then(response => response.json())
                .then(data => {
                    const coordinates = data.loc.split(',');
                    const latitude = parseFloat(coordinates[0]);
                    const longitude = parseFloat(coordinates[1]);
                    document.getElementById("latitude").value = latitude;
                    document.getElementById("longitude").value = longitude;
                    document.querySelector("form").submit();
                })
                .catch(error => {
                    console.error('Error getting location by IP:', error);
                }); 
        }
    });

    document.getElementById('email').addEventListener("click", function() {
        document.addEventListener("click", function(event) {
            const emailInput = document.getElementById('email');
            const clickedElement = event.target;
            if (clickedElement !== emailInput && !emailInput.contains(clickedElement)) {
                const emailValue = emailInput.value.trim();
                if (emailValue === '') {
                    document.getElementById("emailError").style.display = "block";
                    
                }
            }
        });
    });

    document.getElementById('email').addEventListener("input", function(){
        const emailValue = this.value.trim();
        if (emailValue === '') {
            document.getElementById("emailError").style.display = "block";
            document.getElementById("validEmail").style.display = "none";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailValue)) {
                document.getElementById("validEmail").style.display = "block";
                document.getElementById("emailError").style.display = "none";
            } else {
                document.getElementById("validEmail").style.display = "none";
                document.getElementById("emailError").style.display = "none";
            }
        }       
    });

    document.getElementById('pwd').addEventListener("click", function() {
        document.addEventListener("click", function(event) {
            const pwdInput = document.getElementById('pwd');
            const clickedElement = event.target;
        
            // Check if the clicked element is not the email input field or its descendants
            if (clickedElement !== pwdInput && !pwdInput.contains(clickedElement)) {
                const pwdValue = pwdInput.value.trim();
                if (pwdValue === '') {
                    document.getElementById("pwdError").style.display = "block";
                }
            }
        });
    });

    document.getElementById('pwd').addEventListener("input", function() {
        const pwdValue = this.value; // Retrieve the value of the password input field
        if (pwdValue === '') {
            document.getElementById("pwdError").style.display = "block";
        } else {
            document.getElementById("pwdError").style.display = "none";
        }
    });

    setInterval(checkVisibility, 1000);
});