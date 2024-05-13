document.addEventListener("DOMContentLoaded", function() {
    function checkVisibility() {
        var targetElements = document.querySelectorAll('.error');
        var submitButton = document.getElementById('create');
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

    const create = document.getElementById("create");
    if (create) {
        create.addEventListener("click", function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value.trim();
            const name = document.getElementById('name').value.trim();
            const pwd1 = document.getElementById('pwd1').value.trim();
            const pwd2 = document.getElementById('pwd2').value.trim();
            var elements = document.querySelectorAll('.error')
            elements.forEach(function(element) {
                // Do something with each element
                element.style.display = "none";
            });
            if (email === "" || name === "" || pwd1 === "" || pwd2 === ""){
                document.getElementById("emailError").style.display = "none";
                document.getElementById("nameError").style.display = "none";
                document.getElementById("pwd1Error").style.display = "none";
                document.getElementById("pwd2Error").style.display = "none";
                if (email.trim()===""){
                    document.getElementById("emailError").style.display = "block";
                }
                if (name.trim()===""){
                    document.getElementById("nameError").style.display = "block";
                }
                if (pwd1.trim()===""){
                    document.getElementById("pwd1Error").style.display = "block";
                }
                if (pwd2.trim()===""){
                    document.getElementById("pwd2Error").style.display = "block";
                }
            }else{
                if(pwd1!==pwd2){
                    document.getElementById("emailError").style.display = "none";
                    document.getElementById("nameError").style.display = "none";
                    document.getElementById("pwd1Error").style.display = "none";
                    document.getElementById("pwd2Error").style.display = "none";
                    document.getElementById("pwdError").style.display = "block";
                }else{
                    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
                    if (!passwordRegex.test(pwd1)) {
                        document.getElementById("con").style.display = "block";
                        return; // Stop further execution if password is invalid
                    }else{
                        document.getElementById("con").style.display = "none";
                    }
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
            }
        });
    }

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

    document.getElementById('name').addEventListener("click", function() {
        document.addEventListener("click", function(event) {
            const emailInput = document.getElementById('name');
            const clickedElement = event.target;
            if (clickedElement !== emailInput && !emailInput.contains(clickedElement)) {
                const emailValue = emailInput.value.trim();
                if (emailValue === '') {
                    document.getElementById("nameError").style.display = "block";
                }else{
                    document.getElementById("nameError").style.display = "none";
                }
            }
        });
    });

    document.getElementById('name').addEventListener("input", function() {
        const pwdValue = this.value; // Retrieve the value of the password input field
        if (pwdValue === '') {
            document.getElementById("nameError").style.display = "block";
        } else {
            document.getElementById("nameError").style.display = "none";
        }
    });

    document.getElementById('pwd1').addEventListener("click", function() {
        document.addEventListener("click", function(event) {
            const pwdInput = document.getElementById('pwd1');
            const clickedElement = event.target;
            // Check if the clicked element is not the email input field or its descendants
            if (clickedElement !== pwdInput && !pwdInput.contains(clickedElement)) {
                const pwdValue = pwdInput.value.trim();
                if (pwdValue === '') {
                    document.getElementById("pwd1Error").style.display = "block";
                }else{
                    document.getElementById("pwd1Error").style.display = "none";
                }
            }
        });
    });

    document.getElementById('pwd2').addEventListener("click", function() {
        document.addEventListener("click", function(event) {
            const pwdInput = document.getElementById('pwd2');
            const clickedElement = event.target;
            // Check if the clicked element is not the email input field or its descendants
            if (clickedElement !== pwdInput && !pwdInput.contains(clickedElement)) {
                const pwdValue = pwdInput.value.trim();
                if (pwdValue === '') {
                    document.getElementById("pwd2Error").style.display = "block";
                }else{
                    document.getElementById("pwd2Error").style.display = "none";
                }
            }
        });
    });

    document.getElementById('pwd1').addEventListener("input", function() {
        document.getElementById("pwdError").style.display = "none";
        const pwdValue = this.value;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (passwordRegex.test(pwdValue)) {
            document.getElementById("con").style.display = "none";
        } else {
            document.getElementById("con").style.display = "block";
        }
        if (pwdValue === '') {
            document.getElementById("pwd1Error").style.display = "block";
        } else {
            document.getElementById("pwd1Error").style.display = "none";
        }
    });
    
    document.getElementById('pwd2').addEventListener("input", function() {
        document.getElementById("pwdError").style.display = "none";
        const pwdValue = this.value; // Retrieve the value of the password input field
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (passwordRegex.test(pwdValue)) {
            document.getElementById("con").style.display = "none";
        } else {
            document.getElementById("con").style.display = "block";
        }
        if (pwdValue === '') {
            document.getElementById("pwd2Error").style.display = "block";
        } else {
            document.getElementById("pwd2Error").style.display = "none";
        }
    });
    
    setInterval(checkVisibility, 1000);
});