// var arr = require('./sign-up.js');
// console.log(arr.users);
//import { users } from './sign-up.js';

document.addEventListener('DOMContentLoaded', function() {
    // FORM INPUTS
    document.querySelector(".submit-button").addEventListener("click", function(e){
        let usernameInput =  document.querySelector("input#username").value;
        let passwordInput = document.querySelector("input#password").value;
        let checkboxInput = $("#checkbox").is(":checked");
    
        // for checking
        if(validateInputs(usernameInput, passwordInput)) {
            console.log(usernameInput);
            console.log(passwordInput);
            console.log(checkboxInput);

            console.log("-- INPUTS ARE VALIDATED --");
        } else {
           e.preventDefault();  
        }
        
    });

    // INPUT VALIDATION
    function validateInputs(username, password) {
        if(username && password) {
            return true;
        } 
        
        if(!username && password){
            alert("Username Required!");
        } else if(!password && username) {
            alert("Password Required!");
        } else {
            alert("Username & Password Required!");
        }

        return false;
    }

    // CHECK IF USERNAME AND PASSWORD MATCHES
    function checkIfAccountExists(username, password) {

    }

    // TOGGLE PASSWORD
    const togglePassword = document.querySelector("#togglePassword");
    const password = document.querySelector("#password");

    togglePassword.addEventListener("click", function () {
        const type = password.getAttribute("type") === "password" ? "text" : "password";
        password.setAttribute("type", type);
        this.classList.toggle("bi-eye");
    });

    // const form = document.querySelector("form");
    // form.addEventListener('submit', function (e) {
    //    e.preventDefault();
    // });

    
});


