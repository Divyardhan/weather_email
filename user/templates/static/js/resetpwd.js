document.addEventListener("DOMContentLoaded", function() {
    function checkVisibility() {
        var targetElements = document.querySelectorAll('.error');
        var submitButton = document.getElementById('submitbtn');
        var visible = Array.from(targetElements).some(function(element) {
            return element.offsetParent !== null;
        });
        if (visible) {
            submitButton.classList.add('submit-disabled');
        } else {
            submitButton.classList.remove('submit-disabled');
        }
    }
    checkVisibility();

    document.getElementById("submitbtn").addEventListener("click", function(event){
        event.preventDefault();
        var email = document.getElementById("email").value.trim();
        var p1 = document.getElementById("p1").value.trim();
        var p2 = document.getElementById("p2").value.trim();
        document.getElementById('pwd1Error').style.display = p1 === "" ? "block" : "none";
        document.getElementById('pwd2Error').style.display = p2 === "" ? "block" : "none";
        if (p1 !== p2) {
            document.getElementById('pwdError').style.display = 'block';
        } else {
            document.getElementById('pwdError').style.display = 'none';
            document.querySelector("form").submit();
        }
    });

    document.getElementById('p1').addEventListener("input", function() {
        const pwdValue = this.value.trim();
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        document.getElementById("con").style.display = passwordRegex.test(pwdValue) ? "none" : "block";
        document.getElementById("pwd1Error").style.display = pwdValue === "" ? "block" : "none";
    });

    document.getElementById('p2').addEventListener("input", function() {
        const pwdValue = this.value.trim();
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        document.getElementById("con").style.display = passwordRegex.test(pwdValue) ? "none" : "block";
        document.getElementById("pwd2Error").style.display = pwdValue === "" ? "block" : "none";
    });

    setInterval(checkVisibility, 1000);
});
