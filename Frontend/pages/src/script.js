/* =========================================================
   FREdu SPARK
   MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. LOGOUT
   ========================================================= */

function logout() {
    const confirmLogout = confirm("Are you sure you want to log out?");
    if (confirmLogout) {
        window.location.href = "../../index.html";
    }
}


/* =========================================================
   STUDENT: LOAD SUBJECTS
   ========================================================= */

async function loadSubjects() {
    try {
        const [subjectsRes, lessonsRes] = await Promise.all([
            fetch("http://127.0.0.1:8000/subjects"),
            fetch("http://127.0.0.1:8000/lessons/")
        ]);
        const subjects = await subjectsRes.json();
        const lessons = await lessonsRes.json();

        const grid = document.querySelector(".subjects-grid");
        if (!grid) return;
        grid.innerHTML = "";

        subjects.forEach(subject => {
            const lessonCount = lessons.filter(l => l.subject_id === subject.id).length;

            const card = document.createElement("article");
            card.classList.add("subject-card");
            card.innerHTML = `
                <div class="subject-icon">📘</div>
                <p class="subject-category">${subject.name.toUpperCase()}</p>
                <h2>${subject.name}</h2>
                <p>${subject.description ? subject.description : "No description yet."}</p>
                <div class="subject-stats">
                    <span>📖 ${lessonCount} Lesson${lessonCount !== 1 ? "s" : ""}</span>
                </div>
                <a href="lessons.html?subject=${subject.id}" class="subject-link">
                    Explore ${subject.name} →
                </a>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching subjects:", error);
    }
}


/* =========================================================
   TEACHER: LOAD SUBJECTS (with real lesson/challenge counts)
   ========================================================= */

async function loadTeacherSubjects() {
    const grid = document.getElementById("teacherSubjectsGrid");
    if (!grid) return;

    try {
        const [subjectsRes, lessonsRes, challengesRes] = await Promise.all([
            fetch("http://127.0.0.1:8000/subjects"),
            fetch("http://127.0.0.1:8000/lessons/"),
            fetch("http://127.0.0.1:8000/challenges/")
        ]);
        const subjects = await subjectsRes.json();
        const lessons = await lessonsRes.json();
        const challenges = await challengesRes.json();

        grid.innerHTML = "";

        subjects.forEach(subject => {
            const lessonIds = lessons.filter(l => l.subject_id === subject.id).map(l => l.id);
            const lessonCount = lessonIds.length;
            const challengeCount = challenges.filter(c => lessonIds.includes(c.lesson_id)).length;

            const card = document.createElement("article");
            card.classList.add("subject-card");
            card.innerHTML = `
                <div class="subject-card-top">
                    <div class="subject-icon">📘</div>
                </div>
                <p class="subject-category">${subject.name.toUpperCase()}</p>
                <h2>${subject.name}</h2>
                <p>${subject.description ? subject.description : "No description yet."}</p>
                <div class="subject-stats">
                    <span>📖 ${lessonCount} Lesson${lessonCount !== 1 ? "s" : ""}</span>
                    <span>🧪 ${challengeCount} Challenge${challengeCount !== 1 ? "s" : ""}</span>
                </div>
                <a href="lessons.html?subject=${subject.id}" class="subject-link">
                    Manage Lessons →
                </a>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading teacher subjects:", error);
    }
}


/* =========================================================
   STUDENT: LOAD LESSONS (filtered by subject if in URL)
   ========================================================= */

async function loadLessons() {
    try {
        const response = await fetch("http://127.0.0.1:8000/lessons/");
        const lessons = await response.json();

        const grid = document.querySelector(".lesson-grid");
        if (!grid) return;

        const params = new URLSearchParams(window.location.search);
        const subjectId = params.get("subject");

        const filteredLessons = subjectId
            ? lessons.filter(l => l.subject_id === parseInt(subjectId))
            : lessons;

        grid.innerHTML = "";

        if (filteredLessons.length === 0) {
            grid.innerHTML = "<p>No lessons yet for this subject.</p>";
            return;
        }

        filteredLessons.forEach(lesson => {
            const card = document.createElement("article");
            card.classList.add("lesson-card");
            card.innerHTML = `
                <div class="lesson-image science-bg"></div>
                <div class="lesson-content">
                    <p class="subject-category">SUBJECT ${lesson.subject_id}</p>
                    <h2>${lesson.title}</h2>
                    <p>${lesson.description ? lesson.description : "No description yet."}</p>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching lessons:", error);
    }
}


/* =========================================================
   TEACHER: LOAD, EDIT, DELETE LESSONS
   ========================================================= */

async function loadTeacherLessons() {
    const tbody = document.getElementById("lessonsTableBody");
    if (!tbody) return;

    try {
        const response = await fetch("http://127.0.0.1:8000/lessons/");
        let lessons = await response.json();

        const params = new URLSearchParams(window.location.search);
        const subjectId = params.get("subject");
        if (subjectId) {
            lessons = lessons.filter(l => l.subject_id === parseInt(subjectId));
        }

        tbody.innerHTML = "";

        lessons.forEach(lesson => {
            const row = document.createElement("tr");
            row.id = `lesson-row-${lesson.id}`;
            row.innerHTML = `
                <td>
                    <div class="table-content">
                        <div class="table-icon">📘</div>
                        <div>
                            <strong>${lesson.title}</strong>
                            <small>${lesson.description ? lesson.description : ""}</small>
                        </div>
                    </div>
                </td>
                <td>Subject ${lesson.subject_id}</td>
                <td>${lesson.duration_minutes ? lesson.duration_minutes + " min" : "-"}</td>
                <td><span class="status published">Published</span></td>
                <td>
                    <div class="table-actions">
                        <button onclick="viewLesson(${lesson.id})">View</button>
                        <button onclick="editLesson(${lesson.id})">Edit</button>
                        <button class="delete-action" onclick="deleteLesson(${lesson.id})">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading lessons:", error);
    }
}

let lessonToDelete = null;

function deleteLesson(lessonId) {
    lessonToDelete = lessonId;
    const modal = document.getElementById("deleteModal");
    if (modal) modal.style.display = "flex";
}

function closeDeleteModal() {
    const modal = document.getElementById("deleteModal");
    if (modal) modal.style.display = "none";
    lessonToDelete = null;
}

async function confirmDeleteLesson() {
    if (lessonToDelete === null) return;

    try {
        const response = await fetch(`http://127.0.0.1:8000/lessons/${lessonToDelete}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            alert("Could not delete this lesson.");
            closeDeleteModal();
            return;
        }

        const row = document.getElementById(`lesson-row-${lessonToDelete}`);
        if (row) row.remove();

        closeDeleteModal();

    } catch (error) {
        console.error("Error deleting lesson:", error);
        alert("Could not connect to the server.");
        closeDeleteModal();
    }
}

function viewLesson(lessonId) {
    alert("Viewing lesson " + lessonId + ".");
}

function editLesson(lessonId) {
    window.location.href = "create-lesson.html?edit=" + lessonId;
}


/* =========================================================
   TEACHER: CREATE SUBJECT
   ========================================================= */

async function openSubjectForm() {
    const subjectName = prompt("Enter the name of the new subject:");

    if (subjectName === null || subjectName.trim() === "") {
        return;
    }

    const description = prompt("Enter a description for the subject:");

    try {
        const response = await fetch("http://127.0.0.1:8000/subjects/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: subjectName.trim(),
                description: description ? description.trim() : null
            })
        });

        if (!response.ok) {
            throw new Error("Failed to create subject");
        }

        const newSubject = await response.json();
        alert(newSubject.name + " has been added successfully!");
        loadSubjects();

    } catch (error) {
        console.error("Error creating subject:", error);
        alert("Could not add the subject.");
    }
}


/* =========================================================
   CHALLENGE PAGE (grid + detail, same file)
   ========================================================= */

async function loadChallengePage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const gridView = document.getElementById("challengeGridView");
    const detailView = document.getElementById("challengeDetailView");
    if (!gridView || !detailView) return;

    if (!id) {
        gridView.style.display = "block";
        detailView.style.display = "none";

        try {
            const response = await fetch("http://127.0.0.1:8000/challenges/");
            const challenges = await response.json();
            const grid = document.getElementById("challengesGrid");
            grid.innerHTML = "";

            challenges.forEach(c => {
                const card = document.createElement("article");
                card.classList.add("student-challenge-card");
                card.innerHTML = `
                    <span class="difficulty">${c.difficulty_level ? c.difficulty_level.toUpperCase() : "EASY"}</span>
                    <div class="challenge-card-icon">🧪</div>
                    <h3>${c.title}</h3>
                    <p>${c.real_life_application ? c.real_life_application : "No description yet."}</p>
                    <a href="challenge.html?id=${c.id}" class="primary-btn">Start Challenge</a>
                `;
                grid.appendChild(card);
            });
        } catch (error) {
            console.error("Error fetching challenges:", error);
        }

    } else {
        gridView.style.display = "none";
        detailView.style.display = "block";

        try {
            const response = await fetch(`http://127.0.0.1:8000/challenges/${id}`);
            const c = await response.json();

            document.getElementById("challengeTitle").textContent = c.title;
            document.getElementById("challengeDifficulty").textContent = c.difficulty_level ? c.difficulty_level.toUpperCase() : "EASY";
            document.getElementById("challengeRealLife").textContent = c.real_life_application || "No info yet.";

            const materialsList = document.getElementById("challengeMaterials");
            if (c.materials_needed) {
                materialsList.innerHTML = c.materials_needed
                    .split("\n").map(item => `<li><span>✓</span> ${item}</li>`).join("");
            }

            const instructionsDiv = document.getElementById("challengeInstructions");
            if (c.instructions) {
                instructionsDiv.innerHTML = c.instructions
                    .split("\n").map((step, i) => `
                        <div class="instruction"><span>${i + 1}</span><p>${step}</p></div>
                    `).join("");
            }

            const reflectionDiv = document.getElementById("challengeReflection");
            if (c.reflection_questions) {
                reflectionDiv.innerHTML = c.reflection_questions
                    .split("\n").map(q => `<p>${q}</p>`).join("");
            }

        } catch (error) {
            console.error("Error loading challenge:", error);
        }
    }
}


/* =========================================================
   ADD LESSON OBJECTIVE
   ========================================================= */

function addObjective() {
    const container = document.getElementById("objectivesContainer");
    if (!container) return;

    const field = document.createElement("div");
    field.className = "dynamic-field";
    field.innerHTML = `
        <input type="text" name="objectives[]" placeholder="Enter another learning objective" required>
        <button type="button" onclick="removeField(this)">×</button>
    `;
    container.appendChild(field);
}


/* =========================================================
   ADD MATERIAL
   ========================================================= */

function addMaterial() {
    const container = document.getElementById("materialsContainer");
    if (!container) return;

    const field = document.createElement("div");
    field.className = "dynamic-field";
    field.innerHTML = `
        <input type="text" name="materials[]" placeholder="Enter another material" required>
        <button type="button" onclick="removeField(this)">×</button>
    `;
    container.appendChild(field);
}


/* =========================================================
   ADD CHALLENGE INSTRUCTION
   ========================================================= */

function addInstruction() {
    const container = document.getElementById("instructionsContainer");
    if (!container) return;

    const number = container.children.length + 1;

    const field = document.createElement("div");
    field.className = "dynamic-field numbered-field";
    field.innerHTML = `
        <span>${number}</span>
        <input type="text" name="instructions[]" placeholder="Enter the next step..." required>
        <button type="button" onclick="removeField(this)">×</button>
    `;
    container.appendChild(field);
}


/* =========================================================
   REMOVE DYNAMIC FIELD
   ========================================================= */

function removeField(button) {
    const field = button.parentElement;
    const container = field.parentElement;

    if (container.children.length <= 1) {
        alert("You need at least one field.");
        return;
    }

    field.remove();
    updateInstructionNumbers();
}


/* =========================================================
   UPDATE INSTRUCTION NUMBERS
   ========================================================= */

function updateInstructionNumbers() {
    const container = document.getElementById("instructionsContainer");
    if (!container) return;

    const fields = container.querySelectorAll(".numbered-field");
    fields.forEach(function (field, index) {
        const number = field.querySelector("span");
        if (number) number.textContent = index + 1;
    });
}


/* =========================================================
   TEACHER: SEARCH LESSONS TABLE
   ========================================================= */

function searchTeacherLessons() {
    const input = document.getElementById("teacherLessonSearch");
    if (!input) return;

    const searchTerm = input.value.toLowerCase();
    const table = document.querySelector(".teacher-table tbody");
    if (!table) return;

    const rows = table.querySelectorAll("tr");
    rows.forEach(function (row) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? "" : "none";
    });
}


/* =========================================================
   CHALLENGE SEARCH
   ========================================================= */

function searchChallenges() {
    const input = document.getElementById("challengeSearch");
    if (!input) return;

    const searchTerm = input.value.toLowerCase();
    const cards = document.querySelectorAll(".teacher-challenge-card");
    cards.forEach(function (card) {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? "" : "none";
    });
}


/* =========================================================
   TEACHER: LOAD, VIEW / EDIT / DELETE CHALLENGE
   ========================================================= */

async function loadTeacherChallenges() {
    const grid = document.getElementById("teacherChallengesGrid");
    if (!grid) return;

    try {
        const response = await fetch("http://127.0.0.1:8000/challenges/");
        const challenges = await response.json();

        grid.innerHTML = "";

        challenges.forEach(c => {
            const card = document.createElement("article");
            card.classList.add("teacher-challenge-card");
            card.id = `challenge-card-${c.id}`;
            card.innerHTML = `
                <div class="teacher-challenge-top">
                    <span class="difficulty">${c.difficulty_level ? c.difficulty_level.toUpperCase() : "EASY"}</span>
                </div>
                <div class="challenge-card-icon">🧪</div>
                <h2>${c.title}</h2>
                <p>${c.real_life_application ? c.real_life_application : "No description yet."}</p>
                <div class="challenge-meta">
                    <span>⏱ ${c.duration_minutes ? c.duration_minutes + " min" : "-"}</span>
                    <span>📖 Lesson ${c.lesson_id}</span>
                </div>
                <div class="card-actions">
                    <button class="secondary-btn" onclick="viewChallenge(${c.id})">View</button>
                    <button class="secondary-btn" onclick="editChallenge(${c.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteChallenge(${c.id})">Delete</button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading challenges:", error);
    }
}

function viewChallenge(challengeId) {
    window.location.href = "../student/challenge.html?id=" + challengeId;
}

function editChallenge(challengeId) {
    window.location.href = "create-challenge.html?edit=" + challengeId;
}

let challengeToDelete = null;

function deleteChallenge(challengeId) {
    challengeToDelete = challengeId;
    const modal = document.getElementById("challengeDeleteModal");
    if (modal) modal.style.display = "flex";
}

function closeChallengeDeleteModal() {
    const modal = document.getElementById("challengeDeleteModal");
    if (modal) modal.style.display = "none";
    challengeToDelete = null;
}

async function confirmDeleteChallenge() {
    if (challengeToDelete === null) return;

    try {
        const response = await fetch(`http://127.0.0.1:8000/challenges/${challengeToDelete}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            alert("Could not delete this challenge.");
            closeChallengeDeleteModal();
            return;
        }

        const card = document.getElementById(`challenge-card-${challengeToDelete}`);
        if (card) card.remove();

        closeChallengeDeleteModal();

    } catch (error) {
        console.error("Error deleting challenge:", error);
        alert("Could not connect to the server.");
        closeChallengeDeleteModal();
    }
}


/* =========================================================
   LESSON FORM (dynamic subjects + real submit to backend)
   ========================================================= */

async function loadSubjectOptions() {
    const select = document.getElementById("lessonSubject");
    if (!select) return;

    try {
        const response = await fetch("http://127.0.0.1:8000/subjects");
        const subjects = await response.json();

        subjects.forEach(subject => {
            const option = document.createElement("option");
            option.value = subject.id;
            option.textContent = subject.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading subjects for dropdown:", error);
    }
}

const lessonForm = document.getElementById("lessonForm");

if (lessonForm) {

    loadSubjectOptions();

    lessonForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const objectives = Array.from(
            document.querySelectorAll('input[name="objectives[]"]')
        ).map(input => input.value).filter(v => v.trim() !== "");

        const payload = {
            title: document.getElementById("lessonTitle").value,
            description: document.getElementById("lessonDescription").value,
            learning_objective: objectives.join("\n"),
            duration_minutes: parseInt(document.getElementById("lessonDuration").value) || null,
            subject_id: parseInt(document.getElementById("lessonSubject").value)
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/lessons/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                alert("Something went wrong saving the lesson. Check console for details.");
                return;
            }

            alert("Lesson saved successfully!");
            window.location.href = "lessons.html";

        } catch (error) {
            console.error("Error saving lesson:", error);
            alert("Could not connect to the server.");
        }
    });

}


/* =========================================================
   CHALLENGE FORM (dynamic lessons + real submit to backend)
   ========================================================= */

async function loadLessonOptions() {
    const select = document.getElementById("challengeLesson");
    if (!select) return;

    try {
        const response = await fetch("http://127.0.0.1:8000/lessons/");
        const lessons = await response.json();

        lessons.forEach(lesson => {
            const option = document.createElement("option");
            option.value = lesson.id;
            option.textContent = lesson.title;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading lessons for dropdown:", error);
    }
}

const challengeForm = document.getElementById("challengeForm");

if (challengeForm) {

    loadLessonOptions();

    challengeForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const materials = Array.from(
            document.querySelectorAll('input[name="materials[]"]')
        ).map(input => input.value).filter(v => v.trim() !== "");

        const instructions = Array.from(
            document.querySelectorAll('input[name="instructions[]"]')
        ).map(input => input.value).filter(v => v.trim() !== "");

        const reflection = document.getElementById("reflectionQuestion").value;
        const description = document.getElementById("challengeDescription").value;

        const payload = {
            title: document.getElementById("challengeTitle").value,
            instructions: instructions,
            materials_needed: materials,
            real_life_application: description,
            reflection_questions: reflection ? [reflection] : [],
            difficulty_level: document.getElementById("challengeDifficulty").value,
            duration_minutes: parseInt(document.getElementById("challengeDuration").value) || null,
            lesson_id: parseInt(document.getElementById("challengeLesson").value)
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/challenges/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                alert("Something went wrong saving the challenge. Check console for details.");
                return;
            }

            alert("Challenge saved successfully!");
            window.location.href = "challenges.html";

        } catch (error) {
            console.error("Error saving challenge:", error);
            alert("Could not connect to the server.");
        }
    });

}


/* =========================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
   ========================================================= */

window.addEventListener("click", function (event) {
    const lessonModal = document.getElementById("deleteModal");
    const challengeModal = document.getElementById("challengeDeleteModal");

    if (lessonModal && event.target === lessonModal) {
        closeDeleteModal();
    }

    if (challengeModal && event.target === challengeModal) {
        closeChallengeDeleteModal();
    }
});


/* =========================================================
   AUTH FORM DEMO SUBMIT
   ========================================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const role = document.getElementById("loginRole").value;

        const formData = new URLSearchParams();

        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", role);

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.detail ||
                    "Login failed. Please check your details."
                );

                return;
            }

            // Save the logged-in user's information
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(data)
            );

            // Send the user to the correct dashboard
            if (data.role === "teacher") {

                window.location.href = "../teacher/dashboard.html";

            } else if (data.role === "student") {

                window.location.href = "../student/subjects.html";

            }

        } catch (error) {

            console.error("Login error:", error);

            alert(
                "Could not connect to the server."
            );
        }

    });

}

/* =========================================================
   SIGN UP: CREATE REAL ACCOUNT
   ========================================================= */

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const fullName = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const selectedRole = document.querySelector(
            'input[name="role"]:checked'
        );

        // Check passwords
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Check role
        if (!selectedRole) {
            alert("Please select whether you are a Student or Teacher.");
            return;
        }

        const role = selectedRole.value;

        // Prepare form data for FastAPI
        const formData = new URLSearchParams();

        formData.append("full_name", fullName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", role);

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/users/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.detail ||
                    "Could not create your account."
                );

                return;
            }

            alert(
                "Account created successfully! Please log in."
            );

            // Send the user to the login page
            window.location.href = "login.html";

        } catch (error) {

            console.error("Signup error:", error);

            alert(
                "Could not connect to the server. Make sure your backend is running."
            );
        }

    });

}
const forgotPasswordLink = document.getElementById("forgotPasswordLink");

if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", function (event) {
        event.preventDefault();
        alert("Please contact your teacher or school administrator to reset your password.");
    });
}

/* =========================================================
   STUDENT: SEARCH LESSONS
   ========================================================= */

function searchLessons() {
    const input = document.getElementById("lessonSearch");
    if (!input) return;

    const searchTerm = input.value.toLowerCase();
    const cards = document.querySelectorAll(".lesson-card");
    cards.forEach(function (card) {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? "" : "none";
    });
}


/* =========================================================
   STUDENT: SEARCH SUBJECTS
   ========================================================= */

function searchStudentSubjects() {
    const input = document.getElementById("studentSubjectSearch");
    if (!input) return;

    const searchTerm = input.value.toLowerCase();
    const cards = document.querySelectorAll(".subject-card");
    cards.forEach(function (card) {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? "" : "none";
    });
}


/* =========================================================
   STUDENT: COMPLETE CHALLENGE
   ========================================================= */

async function completeChallenge() {

    const params = new URLSearchParams(window.location.search);
    const challengeId = params.get("id");

    if (!challengeId) {
        alert("Challenge not found.");
        return;
    }

    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    if (!loggedInUser || loggedInUser.role !== "student") {
        alert("Please log in as a student first.");
        return;
    }

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/progress/challenges/${challengeId}/complete?student_id=${loggedInUser.id}`,
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.detail || "Could not complete challenge.");
            return;
        }

        // Update the progress bar
        const fill = document.querySelector(
            ".challenge-progress-fill"
        );

        if (fill) {
            fill.style.width = "100%";
        }

        // Update progress text
        const progressTexts = document.querySelectorAll(
            ".challenge-progress p"
        );

        if (progressTexts.length > 1) {
            progressTexts[1].textContent = "100% completed";
        }

        alert("Nice work! Challenge marked as complete.");

    } catch (error) {

        console.error(
            "Error completing challenge:",
            error
        );

        alert("Could not connect to the server.");
    }
}


/* =========================================================
   STUDENT: REFLECTION FORM
   ========================================================= */

    /* =========================================================
   STUDENT: REFLECTION FORM
   ========================================================= */

const reflectionForm = document.getElementById("reflectionForm");

if (reflectionForm) {

    reflectionForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const loggedInUser = JSON.parse(
            localStorage.getItem("loggedInUser")
        );

        if (!loggedInUser || loggedInUser.role !== "student") {
            alert("Please log in as a student first.");
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const challengeId = params.get("id");

        if (!challengeId) {
            alert("Challenge not found.");
            return;
        }

        const observation = document.getElementById("reflection").value.trim();
        const improvement = document.getElementById("improvement").value.trim();

        if (!observation || !improvement) {
            alert("Please answer both reflection questions.");
            return;
        }

        try {

            const formData = new URLSearchParams();

            formData.append("student_id", loggedInUser.id);
            formData.append("observation", observation);
            formData.append("improvement", improvement);

            const response = await fetch(
                `http://127.0.0.1:8000/reflections/challenges/${challengeId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.detail || "Could not submit reflection.");
                return;
            }

            alert("Reflection submitted successfully! 🎉");

            reflectionForm.reset();

        } catch (error) {

            console.error("Reflection error:", error);

            alert("Could not connect to the server.");
        }

    });

}


/* =========================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================= */

(function () {
    const revealItems = document.querySelectorAll(".reveal");
    if (!revealItems.length) return;

    if (!("IntersectionObserver" in window)) {
        revealItems.forEach(function (item) {
            item.classList.add("is-visible");
        });
        return;
    }

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function () {
                        entry.target.classList.add("is-visible");
                    }, index * 90);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealItems.forEach(function (item) {
        observer.observe(item);
    });
})();


/* =========================================================
   NAVBAR SCROLL SHADOW
   ========================================================= */

(function () {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    window.addEventListener("scroll", function () {
        navbar.style.boxShadow = window.scrollY > 12
            ? "0 8px 20px rgba(0, 0, 0, 0.06)"
            : "none";
    });
})();


/* =========================================================
   SINGLE PAGE LOAD ENTRY POINT — runs relevant loaders
   based on which elements exist on the current page
   ========================================================= */
   /* =========================================================
   TEACHER DASHBOARD: LOAD REAL STATISTICS
   ========================================================= */

async function loadTeacherDashboard() {
    const subjectCount = document.getElementById("subjectCount");
    const lessonCount = document.getElementById("lessonCount");
    const challengeCount = document.getElementById("challengeCount");
    const studentCount = document.getElementById("studentCount");

    // Only run on the teacher dashboard
    if (
        !subjectCount &&
        !lessonCount &&
        !challengeCount &&
        !studentCount
    ) {
        return;
    }

    try {
        const [
            subjectsResponse,
            lessonsResponse,
            challengesResponse,
            studentsResponse
        ] = await Promise.all([
            fetch("http://127.0.0.1:8000/subjects/"),
            fetch("http://127.0.0.1:8000/lessons/"),
            fetch("http://127.0.0.1:8000/challenges/"),
            fetch("http://127.0.0.1:8000/users/students")
        ]);

        if (
            !subjectsResponse.ok ||
            !lessonsResponse.ok ||
            !challengesResponse.ok ||
            !studentsResponse.ok
        ) {
            throw new Error("Could not load dashboard statistics.");
        }

        const subjects = await subjectsResponse.json();
        const lessons = await lessonsResponse.json();
        const challenges = await challengesResponse.json();
        const students = await studentsResponse.json();

        // Put the real numbers into the dashboard
        if (subjectCount) {
            subjectCount.textContent = subjects.length;
        }

        if (lessonCount) {
            lessonCount.textContent = lessons.length;
        }

        if (challengeCount) {
            challengeCount.textContent = challenges.length;
        }

        if (studentCount) {
            studentCount.textContent = students.length;
        }

    } catch (error) {
        console.error("Error loading teacher dashboard:", error);
    }
}
/* =========================================================
   LOAD LOGGED-IN USER NAME
   ========================================================= */

function loadLoggedInUser() {
    const userData = localStorage.getItem("loggedInUser");

    if (!userData) return;

    try {
        const user = JSON.parse(userData);

        const teacherName = document.getElementById("teacherName");
        const welcomeTeacherName = document.getElementById("welcomeTeacherName");
        const profileInitial = document.getElementById("profileInitial");

        if (teacherName && user.full_name) {
            teacherName.textContent = user.full_name;
        }

        if (welcomeTeacherName && user.full_name) {
            welcomeTeacherName.textContent = user.full_name;
        }

        if (profileInitial && user.full_name) {
            profileInitial.textContent =
                user.full_name.charAt(0).toUpperCase();
        }

    } catch (error) {
        console.error("Error loading logged-in user:", error);
    }
}
/* =========================================================
   TEACHER: SHOW REAL NAME ON DASHBOARD
   ========================================================= */

function showTeacherName() {
    const userData = localStorage.getItem("loggedInUser");

    if (!userData) return;

    try {
        const user = JSON.parse(userData);

        if (user.role !== "teacher") return;

        const teacherName = user.full_name;

        // Change "Welcome back, Teacher!" to the real name
        const welcomeHeading = document.querySelector(".dashboard-welcome h1");

        if (welcomeHeading && teacherName) {
            welcomeHeading.textContent =
                `Welcome back, ${teacherName}! 👩🏾‍🏫`;
        }

        // Change the name beside the J
        const profileName = document.querySelector(".teacher-profile span");

        if (profileName && teacherName) {
            profileName.textContent = teacherName;
        }

    } catch (error) {
        console.error("Could not load teacher name:", error);
    }
}
/* =========================================================
   TEACHER: UPDATE PROFILE INITIAL ON ALL TEACHER PAGES
   ========================================================= */

function updateTeacherInitial() {
    const userData = localStorage.getItem("loggedInUser");

    if (!userData) return;

    try {
        const user = JSON.parse(userData);

        if (user.role !== "teacher" || !user.full_name) return;

        const profileCircle = document.querySelector(".profile-circle");

        if (profileCircle) {
            profileCircle.textContent =
                user.full_name.charAt(0).toUpperCase();
        }

        const profileName = document.querySelector(".teacher-profile span");

        if (profileName) {
            profileName.textContent = user.full_name;
        }

    } catch (error) {
        console.error("Error updating teacher profile:", error);
    }
}
function loadLoggedInUser() {
    const userData = localStorage.getItem("loggedInUser");

    if (!userData) return;

    const user = JSON.parse(userData);

    const profileNames = document.querySelectorAll(
        ".student-profile span, .teacher-profile span"
    );

    profileNames.forEach(function (element) {
        element.textContent = user.full_name;
    });

    const profileCircles = document.querySelectorAll(
        ".student-profile .profile-circle, .teacher-profile .profile-circle"
    );

    profileCircles.forEach(function (element) {
        element.textContent = user.full_name
            .charAt(0)
            .toUpperCase();
    });
}
document.addEventListener("DOMContentLoaded", () => {
    loadTeacherDashboard();
    loadLoggedInUser();
    showTeacherName();
    updateTeacherInitial();
    loadLoggedInUser();
    loadSubjects();
    loadTeacherSubjects();
    loadLessons();
    loadTeacherLessons();
    loadChallengePage();
    loadTeacherChallenges();
});