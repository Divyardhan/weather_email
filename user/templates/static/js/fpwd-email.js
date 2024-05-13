document.addEventListener("DOMContentLoaded", function() {
    function checkVisibility() {
        var targetElements = document.querySelectorAll('.error');
        var submitButton = document.getElementById('button');
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
    
    document.getElementById("button").addEventListener("click", function(event){
        event.preventDefault();
        var email = document.getElementById("email").value.trim();
        if (email === "") {
            document.getElementById("emailError").style.display = "block";
        } else {
            document.getElementById("form").submit();
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
    setInterval(checkVisibility, 500);
});
