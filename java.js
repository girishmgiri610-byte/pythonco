
let students = JSON.parse(
    localStorage.getItem("students") || "[]"
);

const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const search = document.getElementById("search");

// Save students in browser storage
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Prevent HTML injection when displaying student details
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// Display student records
function displayStudents(list = students) {
    studentList.innerHTML = "";

    document.getElementById("emptyMessage").style.display =
        list.length === 0 ? "block" : "none";

    list.forEach(student => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(student.name)}</td>
            <td>${escapeHTML(student.usn)}</td>
            <td>${escapeHTML(student.email)}</td>
            <td>${escapeHTML(student.phone)}</td>
            <td>${escapeHTML(student.course)}</td>
            <td>${escapeHTML(student.gender)}</td>
            <td>
                <button class="edit-btn"
                    onclick="editStudent('${student.id}')">
                    Edit
                </button>
                <button class="delete-btn"
                    onclick="deleteStudent('${student.id}')">
                    Delete
                </button>
            </td>
        `;

        studentList.appendChild(row);
    });

    updateDashboard();
}

// Update dashboard numbers
function updateDashboard() {
    document.getElementById("totalStudents").textContent =
        students.length;

    document.getElementById("maleStudents").textContent =
        students.filter(s => s.gender === "Male").length;

    document.getElementById("femaleStudents").textContent =
        students.filter(s => s.gender === "Female").length;
}

// Add or update student
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const id = document.getElementById("editId").value;

    const student = {
        id: id || (crypto.randomUUID ?
            crypto.randomUUID() : String(Date.now())),
        name: document.getElementById("name").value.trim(),
        usn: document.getElementById("usn").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        course: document.getElementById("course").value,
        gender: document.getElementById("gender").value
    };

    const duplicate = students.some(s =>
        s.usn.toLowerCase() === student.usn.toLowerCase()
        && s.id !== student.id
    );

    if (duplicate) {
        alert("This USN already exists!");
        return;
    }

    if (id) {
        students = students.map(s =>
            s.id === id ? student : s
        );
        alert("Student updated successfully!");
    } else {
        students.push(student);
        alert("Student added successfully!");
    }

    saveStudents();
    resetForm();
    displayStudents();
});

// Edit student
function editStudent(id) {
    const student = students.find(s => s.id === id);

    if (!student) return;

    document.getElementById("editId").value = student.id;
    document.getElementById("name").value = student.name;
    document.getElementById("usn").value = student.usn;
    document.getElementById("email").value = student.email;
    document.getElementById("phone").value = student.phone;
    document.getElementById("course").value = student.course;
    document.getElementById("gender").value = student.gender;

    document.getElementById("formTitle").textContent =
        "Edit Student";

    document.getElementById("submitBtn").textContent =
        "Update Student";

    showForm();
}

// Delete student
function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this student?")) {
        students = students.filter(s => s.id !== id);

        saveStudents();
        displayStudents();
    }
}

// Reset form
function resetForm() {
    form.reset();

    document.getElementById("editId").value = "";

    document.getElementById("formTitle").textContent =
        "Add New Student";

    document.getElementById("submitBtn").textContent =
        "Add Student";
}

// Show form
function showForm() {
    document.getElementById("add-student").scrollIntoView({
        behavior: "smooth"
    });
}

// Search students
search.addEventListener("input", function() {
    const keyword = search.value.toLowerCase();

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(keyword) ||
        s.usn.toLowerCase().includes(keyword)
    );

    displayStudents(filtered);
});

// Initial display
displayStudents();
