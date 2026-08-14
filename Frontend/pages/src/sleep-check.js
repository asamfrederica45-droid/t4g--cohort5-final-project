/* =========================================================
   FREdu SPARK
   STUDENT SCREEN-TIME LOCK
   A lightweight, client-side "digital bedtime" for the
   student area. To change the schedule, edit the two
   numbers below — nothing else needs to change.
   ========================================================= */

(function () {

    /* ---- EDIT THESE TWO NUMBERS TO CHANGE THE SCHEDULE ---- */
    var SLEEP_START_HOUR = 20; // 8:00 PM — lock starts
    var WAKE_HOUR = 6;         // 6:00 AM — lock ends
    /* --------------------------------------------------------- */


    function isStudentBedtime() {

        var hour = new Date().getHours();

        if (SLEEP_START_HOUR > WAKE_HOUR) {
            // window crosses midnight, e.g. 8 PM -> 6 AM
            return hour >= SLEEP_START_HOUR || hour < WAKE_HOUR;
        }

        return hour >= SLEEP_START_HOUR && hour < WAKE_HOUR;

    }


    function formatStudentHour(hour) {

        var period = hour >= 12 ? "PM" : "AM";
        var displayHour = hour % 12;

        if (displayHour === 0) {
            displayHour = 12;
        }

        return displayHour + ":00 " + period;

    }


    // Expose helpers globally so script.js (login) and
    // bedtime.html can use the same schedule and logic.
    window.isStudentBedtime = isStudentBedtime;
    window.STUDENT_SLEEP_START_HOUR = SLEEP_START_HOUR;
    window.STUDENT_WAKE_HOUR = WAKE_HOUR;
    window.formatStudentHour = formatStudentHour;


    // Pages opt in to the auto-lock redirect by setting this
    // flag BEFORE including this script. login.html does NOT
    // set it, since the role isn't known until form submit.
    if (!window.ENFORCE_STUDENT_BEDTIME) {
        return;
    }

    var onBedtimePage = /bedtime\.html$/.test(window.location.pathname);

    if (onBedtimePage) {
        return;
    }

    if (isStudentBedtime()) {
        window.location.href = "bedtime.html";
        return;
    }

    // Keep checking while the page stays open, so the lock
    // kicks in the moment bedtime starts mid-session.
    setInterval(function () {

        if (isStudentBedtime()) {
            window.location.href = "bedtime.html";
        }

    }, 60000);

})();