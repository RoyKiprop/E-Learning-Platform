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
        const response = await fetch('/users.json');
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
    const element = document.createElement('div')
    element.className = 'bg-white p-6 cursor-pointer course-card hover:border border-[#4dc591] focus:border border-[#4dc591]'
  
    element.insertAdjacentHTML(`beforeend`,`
          <a>
           <h2 class="montserrat text-[#121413] text-xl font-bold mb-2">${course.title}</h2>
          <p class="montserrat text-[#9295a3] mb-2">Course Code: ${course.course_code}</p>
          <p class="montserrat text-[#9295a3] mb-2">Domain: ${course.domain}</p>
          <p class="montserrat text-[#9295a3] mb-2">Instructor: ${course.instructor}</p>
          <div class="flex gap-4 items-center mt-4">
              <span class="montserrat text-[#4dc591]">${course.lessons} Lessons</span>
              <span class="montserrat text-[#4dc591]">${course.hours} Hours</span>
              <span class="montserrat text-[#4dc591]">${course.enrollments} Enrollments</span>
          </div>
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
    purchaseSuccess.classList.remove('hidden')
})

closePopUp.addEventListener('click', ()=> purchaseSuccess.classList.add('hidden') )

// Calling the main function 
window.addEventListener('load', main);




  










