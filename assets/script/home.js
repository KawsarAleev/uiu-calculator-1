document.addEventListener("DOMContentLoaded", () => {
    const heroTitle = document.getElementById("heroTitle");
    const usernameInput = document.getElementById("usernameInput");

    function updateHero() {
        const name = localStorage.getItem("username") || "UIUian";
        heroTitle.innerHTML = `Hi, ${name}!<br>Welcome to UIU Calculator`;
    }
    updateHero();

    if (usernameInput) {
        usernameInput.addEventListener("input", () => {
            localStorage.setItem("username", usernameInput.value || "UIUian");
            updateHero();
        });
    }
    
    window.addEventListener("storage", (e) => {
        if (e.key === "username") updateHero();
    });
});