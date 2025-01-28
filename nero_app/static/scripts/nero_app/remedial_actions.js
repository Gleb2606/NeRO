document.addEventListener("DOMContentLoaded", () => {
    const processAfterDisturbance = document.getElementById("processAfterDisturbance");
    const processAfterControlAction = document.getElementById("processAfterControlAction");
    const controlActionFields = document.getElementById("controlActionFields");

    processAfterDisturbance.addEventListener("change", () => {
        if (processAfterDisturbance.checked) {
            controlActionFields.style.display = "none";
        }
    });

    processAfterControlAction.addEventListener("change", () => {
        if (processAfterControlAction.checked) {
            controlActionFields.style.display = "block";
        }
    });
});