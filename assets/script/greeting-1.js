function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 15) return "Good Noon";
    if (hour >= 15 && hour < 18) return "Good Afternoon";
    if (hour >= 18 && hour < 24) return "Good Evening";
    return "Good Night";
}
function updateGreeting() {
    const name = localStorage.getItem('username') || "UIUian";
    const greeting = getGreeting();
    const greetingEl = document.getElementById("greeting");
    if (window.innerWidth >= 768) {
        greetingEl.textContent = `${greeting}, ${name} !! 🙌`;
    } else {
        greetingEl.innerHTML = `${greeting}, ${name} !! 🙌`;
    }
}
updateGreeting();
setInterval(updateGreeting, 60000);
window.addEventListener('resize', updateGreeting);
const usernameInput = document.getElementById('usernameInput');
if (usernameInput) {
    usernameInput.value = localStorage.getItem('username') || 'UIUian';
    usernameInput.addEventListener('input', () => {
        localStorage.setItem('username', usernameInput.value || 'UIUian');
        updateGreeting();
    });
}
const hamburgerBtn = document.getElementById('hamburgerBtn');
const offCanvasMenu = document.getElementById('offCanvasMenu');
const closeBtn = document.getElementById('closeBtn');
if (hamburgerBtn && offCanvasMenu && closeBtn) {
    hamburgerBtn.addEventListener('click', () => {
        offCanvasMenu.classList.add('active');
    });
    closeBtn.addEventListener('click', () => {
        offCanvasMenu.classList.remove('active');
    });
    document.addEventListener('click', (e) => {
        if (!offCanvasMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            offCanvasMenu.classList.remove('active');
        }
    });
}