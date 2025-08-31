document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("commentButton").addEventListener("click", function () {
        document.getElementById("commentSection").scrollIntoView({ behavior: "smooth" });
    });
});