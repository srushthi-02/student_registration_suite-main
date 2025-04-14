// Get references to the form input elements by their IDs
const studentName = document.querySelector("#studentName");
const studentid = document.querySelector("#studentId");
const studentEmailid = document.querySelector("#Emailid");
const studentContractNo = document.querySelector("#contactNo");

// Get references to the submit button and the table body (where student data will be displayed)
const buttonSubmit = document.querySelector("#submit");
const tableBody = document.querySelector("tbody");

// Add event listener for when the submit button is clicked
buttonSubmit.addEventListener("click", submitOnclick);

// Function to handle the submit button click event
function submitOnclick(event) {
    event.preventDefault(); // Prevent form from submitting and page reload
    
    let isValid = true; // Variable to track form validity

    // Clear previous error messages if any
    clearErrorMessages();

    // Validate each form field and show error messages if any field is invalid
    if (!studentName.checkValidity()) {
        showError(studentName, "Please enter a valid student name.");
        isValid = false; // Mark as invalid
    }
    if (!studentid.checkValidity()) {
        showError(studentid, studentid.title); // Show student ID validation error
        isValid = false;
    }
    if (!studentEmailid.checkValidity()) {
        showError(studentEmailid, studentEmailid.title); // Show email validation error
        isValid = false;
    }
    if (!studentContractNo.checkValidity()) {
        showError(studentContractNo, studentContractNo.title); // Show contact number validation error
        isValid = false;
    }

    // If all fields are valid, proceed with adding the student data to the table
    if (isValid) {
        const student = {
            Name: studentName.value,
            id: studentid.value,
            Emailid: studentEmailid.value,
            ContractNo: studentContractNo.value,
        };

        // Add the student to the table and local storage
        addStudentToTable(student);
        addStudentToLocalStorage(student);

        // Clear form fields after submission
        studentName.value = '';
        studentid.value = '';
        studentEmailid.value = '';
        studentContractNo.value = '';

        // Smooth scroll to the secondary page (where data is displayed)
        window.scrollTo({
            top: document.getElementById('secondayPage').offsetTop,
            behavior: 'smooth',
        });
    }
}

// Function to show error messages below invalid fields
function showError(input, message) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    input.parentElement.appendChild(error); // Append error message below the field
}

// Function to clear all error messages from the page
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove()); // Remove all error messages
}

// Function to add a new student to local storage
function addStudentToLocalStorage(student) {
    // Check if 'students' already exists in localStorage
    if (localStorage.getItem('students') === null) {
        let students = [];
        students.push(student); // Add the new student
        localStorage.setItem('students', JSON.stringify(students)); // Store in localStorage
    } else {
        let students = JSON.parse(localStorage.getItem('students'));
        students.push(student); // Add the new student
        localStorage.setItem('students', JSON.stringify(students)); // Update localStorage
    }
}

// Function to add a student row to the HTML table
function addStudentToTable(student) {
    const Row = document.createElement("tr");

    // Create and add table data cells for each student attribute
    const student1 = document.createElement("td");
    student1.innerText = student.Name.trim('');
    student1.classList.add("student-name");
    Row.appendChild(student1);

    const student2 = document.createElement("td");
    student2.innerText = student.id.trim('');
    student2.classList.add("student-id");
    Row.appendChild(student2);

    const student3 = document.createElement("td");
    student3.innerText = student.Emailid.trim('');
    student3.classList.add("student-Emailid");
    Row.appendChild(student3);

    const student4 = document.createElement("td");
    student4.innerText = student.ContractNo.trim('');
    student4.classList.add("student-ContractNo");
    Row.appendChild(student4);

    // Create and add an edit button to the row
    const student5 = document.createElement("td");
    student5.classList.add("editbutton");

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>'; // Pen icon for editing
    editButton.addEventListener("click", handleeditButtonClick);
    student5.appendChild(editButton);
    Row.appendChild(student5);

    // Create and add a delete button to the row
    const student6 = document.createElement("td");
    student6.classList.add("Trashbutton");

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // Trash icon for deleting
    deleteButton.addEventListener("click", handletrashButtonClick);
    student6.appendChild(deleteButton);
    Row.classList.add("student-item");
    Row.appendChild(student6);

    tableBody.appendChild(Row); // Add the row to the table body
}

// Load student data from localStorage and add it to the table when the page loads
function loadStudentData() {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    students.forEach(addStudentToTable); // Add each student to the table
}

loadStudentData(); // Call the function to load the data on page load

// Function to handle the edit button click event
function handleeditButtonClick(e) {
    const item = e.target.closest("button");
    const itemElement = item.closest(".student-item");

    // Get current values from the table row
    const studentName = itemElement.querySelector(".student-name").textContent;
    const studentId = itemElement.querySelector(".student-id").textContent;
    const studentEmailId = itemElement.querySelector(".student-Emailid").textContent;
    const studentContactNo = itemElement.querySelector(".student-ContractNo").textContent;

    // Create input fields for editing and replace the text in table cells with inputs
    itemElement.querySelector(".student-name").innerHTML = `<input type="text" value="${studentName}" class="edit-name">`;
    itemElement.querySelector(".student-Emailid").innerHTML = `<input type="email" value="${studentEmailId}" class="edit-emailid" title="Please enter a valid email address (e.g., example@domain.com)">`;
    itemElement.querySelector(".student-ContractNo").innerHTML = `<input type="text" value="${studentContactNo}" class="edit-contactno" pattern="\\d{10}" maxlength="10" title="Contact number should be exactly 10 digits.">`;

    // Change the edit button to a save button
    item.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
    item.classList.add("save-button");

    // Remove the edit event and add the save event
    item.removeEventListener("click", handleeditButtonClick);
    item.addEventListener("click", function handleSaveClick() {
        if (saveEdit(itemElement, item)) { // Save the edited data if valid
            item.removeEventListener("click", handleSaveClick);
        }
    });
}

// Function to save the edited student data
function saveEdit(itemElement, saveButton) {
    clearErrorMessages();

    const studentId = itemElement.querySelector(".student-id").textContent.trim();

    // Get edited values from input fields
    const editedName = itemElement.querySelector(".edit-name").value;
    const editedEmailId = itemElement.querySelector(".edit-emailid").value;
    const editedContactNo = itemElement.querySelector(".edit-contactno").value;

    // Validate the edited fields
    let isValid = true;
    if (!editedName) {
        showError(itemElement.querySelector(".edit-name"), "Name cannot be empty.");
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(editedEmailId)) {
        showError(itemElement.querySelector(".edit-emailid"), "Please enter a valid email address.");
        isValid = false;
    }

    const contactPattern = /^\d{10}$/;
    if (!contactPattern.test(editedContactNo)) {
        showError(itemElement.querySelector(".edit-contactno"), "Contact number should be exactly 10 digits.");
        isValid = false;
    }

    if (!isValid) {
        return false; // Don't save if validation fails
    }

    // Update the table row with the new values
    itemElement.querySelector(".student-name").textContent = editedName;
    itemElement.querySelector(".student-Emailid").textContent = editedEmailId;
    itemElement.querySelector(".student-ContractNo").textContent = editedContactNo;

    // Update the student data in localStorage
    const students = JSON.parse(localStorage.getItem("students")) || [];
    let studentFound = false;

    // Find the student by ID and update the data
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === studentId) {
            students[i] = {
                Name: editedName,
                id: studentId,
                Emailid: editedEmailId,
                ContractNo: editedContactNo
            };
            studentFound = true;
            break;
        }
    }

    if (studentFound) {
        localStorage.setItem("students", JSON.stringify(students)); // Update localStorage
    }

    saveButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>'; // Change back to edit button
    saveButton.classList.remove("save-button");
    saveButton.addEventListener("click", handleeditButtonClick); // Re-add the edit button event
    return true;
}

// Function to handle the delete button click event
function handletrashButtonClick(e) {
    const item = e.target.closest("button");
    const itemElement = item.closest(".student-item");

    // Remove the student data from the table and localStorage
    const studentId = itemElement.querySelector(".student-id").textContent.trim();
    itemElement.remove(); // Remove the table row

    let students = JSON.parse(localStorage.getItem("students")) || [];
    students = students.filter(student => student.id !== studentId); // Remove student by ID
    localStorage.setItem("students", JSON.stringify(students)); // Update localStorage
}
