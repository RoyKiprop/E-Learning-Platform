'use strict';

// Sign Up elements
const signUpForm = document.getElementById('sign-up');
const nameInputs = document.querySelectorAll('input[name="fname"], input[name="lname"]');
const confirmPassword = document.querySelector('input[name="confirm-password"]');
const terms = document.querySelector('input[name="terms"]');

// Sign In elements
const signInForm = document.getElementById('signIn');
const loginButton = document.querySelector('button[name="loginButton"]');

// Common sign In and sign Up elements
const inputEmail = document.querySelector('input[name="email"]')
const inputPassword = document.querySelector('input[name="password"]')

// Course elements
const courseContainer = document.getElementById('courses-container') 
const purchaseModal = document.querySelector('.purchase-modal')
const courseCode = document.querySelector('.courseCode')
const courseTitle = document.querySelector('.courseTitle')
const proceedButton = document.querySelector('.proceed')
const closeModal = document.querySelector('.closeModal')
const purchaseSuccess = document.querySelector('.modal')
const closePopUp = document.querySelector('.closePopUp')

// Validation patterns
const namePattern = /^[a-zA-Z]{2,}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const disposableDomains = ["mailinator.com", "trashmail.com", "yopmail.com", "temp-mail.org", "10minutemail.com"];

// Error handling
const showError = (element, error) => {
    const errorElement = `<small style="color: hsl(0, 66%, 54%);" class="error-message">${error}</small>`;
    const container = element.closest('.form-group');
    container.insertAdjacentHTML('afterend', errorElement);
    container.style.borderColor = 'hsl(0, 66%, 54%)';
};

const showSignInError = (formId, error) => {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = error;
    errorDiv.className = 'text-red-600 mb-4 error-message';
    const form = document.getElementById(formId);
    form.insertAdjacentElement('beforebegin', errorDiv);
};

const resetErrors = () => {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.form-group').forEach(el => el.style.borderColor = '');
};

const clearInputFields = () => {
    const allInputs = document.querySelectorAll('.input')
    allInputs.forEach(input => input.value === '')
}

// User validation
const isEmailValid = async (email) => {
    try {
        const response = await fetch("/Users.json");
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.users.find(user => user.email === email) || null;
    } catch (error) {
        console.error('Error fetching users:', error);
        return null;
    }
};

// Sign Up
const signUp = async (formData) => {
    resetErrors();
    const userExists = await isEmailValid(formData.get('email'));
    if ( userExists !== null) {
        showSignInError('sign-up', "This email is already registered.");
        return false; 
    } else {
        // create the new user
        return true; 
    }
};


const validateSignUp = async (e) => {
    e.preventDefault();
    resetErrors();

    let isValid = true;

    nameInputs.forEach(input => {
        if (!namePattern.test(input.value)) {
            showError(input, "Name should be at least 2 characters long and contain only letters.");
            isValid = false;
        }
    });

    if (!emailPattern.test(inputEmail.value)) {
        showError(inputEmail, "Please enter a valid email address.");
        isValid = false;
    } else if (disposableDomains.includes(inputEmail.value.split('@')[1])) {
        showError(inputEmail, "Please use a non-disposable email address.");
        isValid = false;
    }

    if (!passwordPattern.test(inputPassword.value)) {
        showError(inputPassword, "Password should be at least 6 characters long, contain mixed case letters, numbers, and at least one special character.");
        isValid = false;
    }

    if (inputPassword.value !== confirmPassword.value) {
        showError(confirmPassword, "Passwords do not match.");
        isValid = false;
    }

    if (!terms.checked) {
        showError(terms, "You must agree to the terms and conditions.");
        isValid = false;
    }

    if (isValid) {
        const signUpSuccessful = await signUp(new FormData(signUpForm));
        if (signUpSuccessful) {
            clearInputFields();
        }
    }
};

// Login
const login = async (email, pass) => {
    resetErrors();

    if (!emailPattern.test(email)) {
        showError(inputEmail, 'A valid email address is required');
        return;
    }

    if (pass.trim() === '') {
        showError(inputPassword, 'Password is required');
        return;
    }

    try {
        const currentUser = await isEmailValid(email);
        if (currentUser === null) {
            showSignInError('signIn', 'User with the email provided not found!');
        } else if (currentUser.password === pass) {
            window.location.href = 'courses.html';
        } else {
            showSignInError('signIn', "Your email or password is not valid.");
        }
    } catch (err) {
        console.error(err);
        showSignInError('signIn', "An error occurred during login. Please try again.");
    }
};

//course element
const courseElement = (course) => {
    let completeDiv;
    if (course.completion.includes('%')){
        completeDiv = `<div class="flex items-center gap-2 mt-2">
                            <div class="h-[4px] w-[90%] bg-gray-300 rounded-md">
                                <div class="h-full bg-[#64cc9f] rounded-md" style="width: ${course.completion}"></div>
                            </div>
                            <span class="montserrat text-sm font-medium text-[#191919]">${course.completion}</span>
                        </div>`
    }else {
        completeDiv =`<div class="flex items-center gap-2">
                        <img src="static/Image_icons/tick.png" class="h-[15px] w-[15px]">
                        <p class="montserrat text-sm font-medium text-[#191919]">Completed</p>  
                      </div>`
    }

    const domainImages = {
        "Software Engineering": "/static/Image_icons/software.png",
        "Data Science": "/static/Image_icons/data-science.png",
        "Artificial Intelligence": "/static/Image_icons/robotic.png",
        "Cloud Computing": "/static/Image_icons/cloud-computing.png",
        "Web Development": "/static/Image_icons/magnifying.png",
        "User Interface Design": "/static/Image_icons/UI.png"
    };

    const domainSrc = domainImages[course.domain]; 


    const element = document.createElement('div')
    element.className = 'bg-white p-4 cursor-pointer course-card hover:border border-[#4dc591] focus:border border-[#4dc591]'
  
    element.insertAdjacentHTML(`beforeend`,`
          <a>
          <img class="h-[40px] w-[40px] mb-1" src=${domainSrc}>
           <h2 class="montserrat text-[#040404] text-xl font-normal mb-2">${course.title}</h2>
          <div class="flex items-center gap-2 mt-1 ml-0">
            <div class="h-9 w-9 bg-gray-300 rounded-full"></div>
            <p class="montserrat text-[#9295a3]">${course.instructor}</p>
          </div>
          
          
          <div class="flex gap-4 items-center ml-1 mt-3 mb-4">
            <div class="flex gap-2 items-center">
                <img class="h-4 w-4" src=${course.lesson_icon}>
                <span class="montserrat text-[#9295a3]">${course.lessons} Lessons</span>
            </div>
            <div class="flex gap-2 items-center">
                <img class="h-5 w-5"  src=${course.hours_icon}>
                <span class="montserrat text-[#9295a3]">${course.hours} Hours</span>
            </div>         
          </div>
           ${completeDiv} 
          </a> 
         
          `)
        element.addEventListener('click', () => {
            purchaseCourse()
            updateDetails(course)
        })
    return element
  }
  
//Display courses
const displayCourse = (courseData) => {
    courseData.forEach((course) =>{
      const elementCourse = courseElement(course)
      courseContainer.appendChild(elementCourse)
    })
}
  
// Fetching courses
async function main(){
    try{
      const response = await fetch('/courses.json')
      const data = await response.json()
      displayCourse(data.courses)
    } 
    catch (error) {
      console.error('Error fetching courses:', error);
    }
}

//course purchase
const purchaseCourse = () => {
    purchaseModal.classList.remove('hidden')
}

// purchase details
const updateDetails = (course) => {
    courseCode.textContent = course.course_code
    courseTitle.textContent = course.title
}

// Event Listeners
if (signUpForm) {
    signUpForm.addEventListener('submit', validateSignUp);
}

if (loginButton) {
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        login(inputEmail.value, inputPassword.value);
    });
}

closeModal.addEventListener('click', () => {
    purchaseModal.classList.add('hidden')
})

//successful purchase
proceedButton.addEventListener('click', () => {
    purchaseModal.classList.add('hidden')
    alert("Congratulations! You have successfully enrolled to this course")
    // purchaseSuccess.classList.remove('hidden')
})

closePopUp.addEventListener('click', ()=> purchaseSuccess.classList.add('hidden') )

// Calling the main function 
window.addEventListener('load', main);




  










