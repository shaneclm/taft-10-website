const User = function(username, email, lastName, firstName, bio, phoneNum, password, profilePicture, isOwner) {
    this.username = username;
    this.email = email;
    this.lastName = lastName;
    this.firstName = firstName;
    this.bio = bio;
    this.phoneNum = phoneNum;
    this.password = password;
    this.profilePicture = profilePicture;
    this.isOwner = isOwner;
    this.numReviews = 0;
}

let userCount = 0;
let users = [];

document.addEventListener('DOMContentLoaded', function() {
    // FORM INPUTS
    document.querySelector(".submit-button").addEventListener("click", function(e){
        let usernameInput = document.querySelector("input#username").value;
        let emailInput = document.querySelector("input#email").value;
        let lastNameInput = document.querySelector("input#lname").value;
        let firstNameInput = document.querySelector("input#fname").value;
        let bioInput = document.querySelector("textarea#description").value;
        let phoneNumInput = document.querySelector("input#number").value;
        let passwordInput = document.querySelector("input#password").value;
        let confirmPasswordInput = document.querySelector("input#confirm-password").value;
        let profilePictureInput = document.querySelector("input#file").value;
        let isOwnerInput = document.querySelector("#checkbox").checked;

        if(validateInputs(usernameInput, emailInput, lastNameInput, firstNameInput, bioInput, passwordInput, confirmPasswordInput, profilePictureInput)) {
            console.log(usernameInput);
            console.log(emailInput);
            console.log(lastNameInput);
            console.log(firstNameInput);
            console.log(bioInput);
            console.log(phoneNumInput);
            console.log(passwordInput);
            console.log(confirmPasswordInput);
            console.log(profilePictureInput);
            console.log(isOwnerInput);

            console.log("-- INPUTS ARE VALIDATED --");

            let newUser = new User(usernameInput, emailInput, lastNameInput, firstNameInput, bioInput, phoneNumInput, passwordInput, profilePictureInput, isOwnerInput);
            users.push(newUser);
            userCount = userCount + 1;

            console.log("USER COUNT: " + users.length);
            console.log(users);

        } else {
            e.preventDefault();
        }

    });

    // INPUT VALIDATION
    function validateInputs(username, email, lastName, firstName, bio, password, confirmPassword, profilePicture) {
        if(username && email && lastName && firstName && bio && password && profilePicture) {
            if(checkPasswords(password, confirmPassword)) {
                return true;
            }
        } else {
            alert("Please fill in the required fields with asterisks.")
        }

        return false;
    }

    // CHECK IF THE PASSWORD INPUTS BOTH MATCH
    function checkPasswords(password, confirmPassword) {
        if(password === confirmPassword) {
            return true;
        } else {
            alert("Passwords do not match. Please try again");
        }

        return false;
    }

    // TOGGLE PASSWORD
    const togglePassword = document.querySelector("#togglePassword");
    const password = document.querySelector("#password");

    togglePassword.addEventListener("click", function () {
        const type = password.getAttribute("type") === "password" ? "text" : "password";
        password.setAttribute("type", type);
        this.classList.toggle("bi-eye");
    });

    const toggleConfirmPassword = document.querySelector("#toggleConfirmPassword");
    const confirmPassword = document.querySelector("#confirm-password");

    toggleConfirmPassword.addEventListener("click", function () {
        const type = confirmPassword.getAttribute("type") === "password" ? "text" : "password";
            confirmPassword.setAttribute("type", type);
            this.classList.toggle("bi-eye");
    });

    // const form = document.querySelector("form");
    // form.addEventListener('submit', function (e) {
    //     e.preventDefault();
    // });

});
