/* =========================================================
   FREdu SPARK
   MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. LOGOUT
   ========================================================= */

function logout() {

    const confirmLogout = confirm(
        "Are you sure you want to log out?"
    );

    if (confirmLogout) {

        window.location.href = "../index.html";

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

function openSubjectForm() {

    const subjectName =
        prompt(
            "Enter the name of the new subject:"
        );

    if (
        subjectName !== null &&
        subjectName.trim() !== ""
    ) {

        alert(
            subjectName +
            " has been added."
        );

    }

}


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