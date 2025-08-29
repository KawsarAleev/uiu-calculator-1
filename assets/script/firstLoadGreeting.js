document.addEventListener("DOMContentLoaded", () => {
    const welcomeOverlay = document.getElementById("welcomeOverlay");
    const firstTimeInput = document.getElementById("firstTimeInput");
    const saveNameBtn = document.getElementById("saveNameBtn");
    const welcomeMsg = document.getElementById("welcomeMsg");
    const overlayTitle = document.getElementById("overlayTitle");

    const saveName = () => {
        const name = firstTimeInput.value.trim() || "UIUian";
        localStorage.setItem("username", name);

        firstTimeInput.style.display = "none";
        saveNameBtn.style.display = "none";
        overlayTitle.style.display = "none";

        welcomeMsg.textContent = `Welcome to UIU Calculator, ${name}! 👋`;
        welcomeMsg.style.display = "block";
        setTimeout(() => {
            welcomeMsg.style.opacity = 1;
            welcomeMsg.style.transform = "translateY(-10px)";
        }, 50);

        if (typeof updateGreeting === "function") updateGreeting();

        setTimeout(() => location.reload(), 2000);
    };

    if (!localStorage.getItem("username")) {
        welcomeOverlay.style.display = "flex";
    } else {
        if (typeof updateGreeting === "function") updateGreeting();
    }

    saveNameBtn.addEventListener("click", saveName);
    firstTimeInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") saveName();
    });
});