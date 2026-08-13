/* =========================================================
   FREdu SPARK
   MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. LOGOUT
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

document.addEventListener("DOMContentLoaded", () => {
    loadSubjects();
    loadLessons();
});
function logout() {

    const confirmLogout = confirm(
        "Are you sure you want to log out?"
    );

    if (confirmLogout) {

        window.location.href = "../../index.html";

    }

}


/* =========================================================
   2. DELETE LESSON
   ========================================================= */

let lessonToDelete = null;


function deleteLesson(lessonId) {

    lessonToDelete = lessonId;

    const modal = document.getElementById("deleteModal");

    if (modal) {

        modal.style.display = "flex";

    }

}


function closeDeleteModal() {

    const modal = document.getElementById("deleteModal");

    if (modal) {

        modal.style.display = "none";

    }

    lessonToDelete = null;

}


function confirmDeleteLesson() {

    if (lessonToDelete === null) {
        return;
    }

    alert(
        "Lesson " +
        lessonToDelete +
        " would be deleted here."
    );

    closeDeleteModal();

}


/* =========================================================
   3. VIEW LESSON
   ========================================================= */

function viewLesson(lessonId) {

    alert(
        "Viewing lesson " +
        lessonId +
        "."
    );

}


/* =========================================================
   4. EDIT LESSON
   ========================================================= */

function editLesson(lessonId) {

    alert(
        "Editing lesson " +
        lessonId +
        "."
    );

    window.location.href =
        "create-lesson.html?edit=" + lessonId;

}


/* =========================================================
   5. SEARCH LESSONS
   ========================================================= */

function searchTeacherLessons() {

    const input =
        document.getElementById(
            "teacherLessonSearch"
        );

    if (!input) {
        return;
    }

    const searchTerm =
        input.value.toLowerCase();

    const table =
        document.querySelector(
            ".teacher-table tbody"
        );

    if (!table) {
        return;
    }

    const rows =
        table.querySelectorAll("tr");

    rows.forEach(function (row) {

        const text =
            row.textContent.toLowerCase();

        if (text.includes(searchTerm)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

}


/* =========================================================
   6. SUBJECT MENU
   ========================================================= */

function showSubjectMenu(subject) {

    alert(
        "Subject options for: " +
        subject
    );

}


/* =========================================================
   7. ADD SUBJECT
   ========================================================= */


        async function openSubjectForm() {

    const subjectName = prompt(
        "Enter the name of the new subject:"
    );

    if (subjectName === null || subjectName.trim() === "") {
        return;
    }

    const description = prompt(
        "Enter a description for the subject:"
    );

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/subjects/",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: subjectName.trim(),
                    description: description
                        ? description.trim()
                        : null
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to create subject");
        }

        const newSubject = await response.json();

        alert(
            newSubject.name +
            " has been added successfully!"
        );

        loadSubjects();

    } catch (error) {

        console.error(
            "Error creating subject:",
            error
        );

        alert(
            "Could not add the subject."
        );

    }
}
async function loadChallengePage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const gridView = document.getElementById("challengeGridView");
    const detailView = document.getElementById("challengeDetailView");
    if (!gridView || !detailView) return;

    if (!id) {
        // GRID VIEW
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
        // DETAIL VIEW
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

document.addEventListener("DOMContentLoaded", () => {
    loadChallengePage();
});
/* =========================================================
   8. ADD LESSON OBJECTIVE
   ========================================================= */

function addObjective() {

    const container =
        document.getElementById(
            "objectivesContainer"
        );

    if (!container) {
        return;
    }

    const field =
        document.createElement("div");

    field.className =
        "dynamic-field";

    field.innerHTML = `
        <input
            type="text"
            name="objectives[]"
            placeholder="Enter another learning objective"
            required
        >

        <button
            type="button"
            onclick="removeField(this)"
        >
            ×
        </button>
    `;

    container.appendChild(field);

}


/* =========================================================
   9. ADD MATERIAL
   ========================================================= */

function addMaterial() {

    const container =
        document.getElementById(
            "materialsContainer"
        );

    if (!container) {
        return;
    }

    const field =
        document.createElement("div");

    field.className =
        "dynamic-field";

    field.innerHTML = `
        <input
            type="text"
            name="materials[]"
            placeholder="Enter another material"
            required
        >

        <button
            type="button"
            onclick="removeField(this)"
        >
            ×
        </button>
    `;

    container.appendChild(field);

}


/* =========================================================
   10. ADD CHALLENGE INSTRUCTION
   ========================================================= */

function addInstruction() {

    const container =
        document.getElementById(
            "instructionsContainer"
        );

    if (!container) {
        return;
    }

    const number =
        container.children.length + 1;

    const field =
        document.createElement("div");

    field.className =
        "dynamic-field numbered-field";

    field.innerHTML = `
        <span>
            ${number}
        </span>

        <input
            type="text"
            name="instructions[]"
            placeholder="Enter the next step..."
            required
        >

        <button
            type="button"
            onclick="removeField(this)"
        >
            ×
        </button>
    `;

    container.appendChild(field);

}


/* =========================================================
   11. REMOVE DYNAMIC FIELD
   ========================================================= */

function removeField(button) {

    const field =
        button.parentElement;

    const container =
        field.parentElement;

    if (container.children.length <= 1) {

        alert(
            "You need at least one field."
        );

        return;

    }

    field.remove();

    updateInstructionNumbers();

}


/* =========================================================
   12. UPDATE INSTRUCTION NUMBERS
   ========================================================= */

function updateInstructionNumbers() {

    const container =
        document.getElementById(
            "instructionsContainer"
        );

    if (!container) {
        return;
    }

    const fields =
        container.querySelectorAll(
            ".numbered-field"
        );

    fields.forEach(function (field, index) {

        const number =
            field.querySelector("span");

        if (number) {

            number.textContent =
                index + 1;

        }

    });

}


/* =========================================================
   13. CHALLENGE SEARCH
   ========================================================= */

function searchChallenges() {

    const input =
        document.getElementById(
            "challengeSearch"
        );

    if (!input) {
        return;
    }

    const searchTerm =
        input.value.toLowerCase();

    const cards =
        document.querySelectorAll(
            ".teacher-challenge-card"
        );

    cards.forEach(function (card) {

        const text =
            card.textContent.toLowerCase();

        if (text.includes(searchTerm)) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}


/* =========================================================
   14. VIEW CHALLENGE
   ========================================================= */

function viewChallenge(challengeId) {

    alert(
        "Viewing challenge " +
        challengeId +
        "."
    );

}


/* =========================================================
   15. EDIT CHALLENGE
   ========================================================= */

function editChallenge(challengeId) {

    alert(
        "Editing challenge " +
        challengeId +
        "."
    );

    window.location.href =
        "create-challenge.html?edit=" +
        challengeId;

}


/* =========================================================
   16. DELETE CHALLENGE
   ========================================================= */

let challengeToDelete = null;


function deleteChallenge(challengeId) {

    challengeToDelete =
        challengeId;

    const modal =
        document.getElementById(
            "challengeDeleteModal"
        );

    if (modal) {

        modal.style.display =
            "flex";

    }

}


function closeChallengeDeleteModal() {

    const modal =
        document.getElementById(
            "challengeDeleteModal"
        );

    if (modal) {

        modal.style.display =
            "none";

    }

    challengeToDelete = null;

}


function confirmDeleteChallenge() {

    if (challengeToDelete === null) {
        return;
    }

    alert(
        "Challenge " +
        challengeToDelete +
        " would be deleted here."
    );

    closeChallengeDeleteModal();

}


/* =========================================================
   17. LESSON FORM
   ========================================================= */

const lessonForm =
    document.getElementById(
        "lessonForm"
    );

if (lessonForm) {

    lessonForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            alert(
                "Lesson saved successfully!"
            );

            window.location.href =
                "lessons.html";

        }
    );

}


/* =========================================================
   18. CHALLENGE FORM
   ========================================================= */

const challengeForm =
    document.getElementById(
        "challengeForm"
    );

if (challengeForm) {

    challengeForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            alert(
                "Challenge saved successfully!"
            );

            window.location.href =
                "challenges.html";

        }
    );

}


/* =========================================================
   19. CLOSE MODALS WHEN CLICKING OUTSIDE
   ========================================================= */

window.addEventListener(
    "click",
    function (event) {

        const lessonModal =
            document.getElementById(
                "deleteModal"
            );

        const challengeModal =
            document.getElementById(
                "challengeDeleteModal"
            );


        if (
            lessonModal &&
            event.target === lessonModal
        ) {

            closeDeleteModal();

        }


        if (
            challengeModal &&
            event.target === challengeModal
        ) {

            closeChallengeDeleteModal();

        }

    }
);


/* =========================================================
   20. AUTH FORM DEMO SUBMIT
   ========================================================= */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        alert("Logged in successfully!");

    });

}

const signupForm =
    document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const password =
            document.getElementById("signupPassword");

        const confirmPassword =
            document.getElementById("confirmPassword");

        if (
            password &&
            confirmPassword &&
            password.value !== confirmPassword.value
        ) {

            alert("Passwords do not match.");
            return;

        }

        alert("Account created successfully!");

    });

}


/* =========================================================
   21. STUDENT: SEARCH LESSONS
   ========================================================= */

function searchLessons() {

    const input =
        document.getElementById("lessonSearch");

    if (!input) {
        return;
    }

    const searchTerm =
        input.value.toLowerCase();

    const cards =
        document.querySelectorAll(".lesson-card");

    cards.forEach(function (card) {

        const text =
            card.textContent.toLowerCase();

        if (text.includes(searchTerm)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });

}


/* =========================================================
   22. STUDENT: SEARCH SUBJECTS
   ========================================================= */

function searchStudentSubjects() {

    const input =
        document.getElementById("studentSubjectSearch");

    if (!input) {
        return;
    }

    const searchTerm =
        input.value.toLowerCase();

    const cards =
        document.querySelectorAll(".subject-card");

    cards.forEach(function (card) {

        const text =
            card.textContent.toLowerCase();

        if (text.includes(searchTerm)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });

}


/* =========================================================
   23. STUDENT: COMPLETE CHALLENGE
   ========================================================= */

function completeChallenge() {

    const fill =
        document.querySelector(".challenge-progress-fill");

    const label =
        document.querySelector(".challenge-progress + p, .challenge-progress p:last-child");

    if (fill) {
        fill.style.width = "100%";
    }

    const progressText =
        document.querySelector(".challenge-progress p");

    if (progressText) {
        progressText.textContent = "100% completed";
    }

    alert("Nice work! Challenge marked as complete.");

}


/* =========================================================
   24. STUDENT: REFLECTION FORM
   ========================================================= */

const reflectionForm =
    document.getElementById("reflectionForm");

if (reflectionForm) {

    reflectionForm.addEventListener("submit", function (event) {

        event.preventDefault();

        alert("Reflection submitted. Great thinking!");

        reflectionForm.reset();

    });

}


/* =========================================================
   25. SCROLL REVEAL ANIMATIONS
   ========================================================= */

(function () {

    const revealItems =
        document.querySelectorAll(".reveal");

    if (!revealItems.length) {
        return;
    }

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
        {
            threshold: 0.15,
            rootMargin: "0px 0px -60px 0px"
        }
    );

    revealItems.forEach(function (item) {
        observer.observe(item);
    });

})();


/* =========================================================
   22. NAVBAR SCROLL SHADOW
   ========================================================= */

(function () {

    const navbar =
        document.querySelector(".navbar");

    if (!navbar) {
        return;
    }

    window.addEventListener("scroll", function () {

        if (window.scrollY > 12) {
            navbar.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.06)";
        } else {
            navbar.style.boxShadow = "none";
        }

    });

})();