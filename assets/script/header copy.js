class globalHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
  <div id="greeting" style="font-weight: 600;"></div>
  <header>
    <a href="index.html" class="logo">
      <img src="./assets/image/uiuCalculatorLogo.png" alt="UIU Calculator Logo">
    </a>
    <button class="hamburger-btn" id="hamburgerBtn">
      <i class="fas fa-bars"></i>
    </button>
  </header>
  <div class="off-canvas-menu" id="offCanvasMenu">
    <div class="menu-header">
      <div class="menu-title">
        Menu
      </div>
      <button class="close-btn" id="closeBtn">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="menu-content">
      <div class="input-group">
        <label>Enter your name for greeting 🙌</label>
        <input type="text" id="usernameInput" placeholder="Enter your name">
      </div>
      <a href="index.html" class="offcanvas-btn">Return Home</a>
      <a href="cgpa.html" class="offcanvas-btn">CGPA Calculator</a>
      <a href="installment.html" class="offcanvas-btn">Installment Calculator</a>
    </div>


<div class="menu-footer-f1">
  <span>
    <i class="fas fa-sync-alt" style="margin-right: 3px; font-size: 11px!important;"></i> 
    Last Updated: <span id="lastUpdated">24 August, 2025</span><br>
    (<span id="timeAgo">Calculating...</span>)
  </span>
</div>





    <div class="menu-footer">
      <div class="developer-info">
        <div class="developer-avatar">
          <img src="./assets/image/img.dev.webp" alt="Developer Photo">
        </div>
        <div class="developer-content">
          <div class="developer-name">Kawsar Ahmed</div>
          <div class="social-links">
            <a href="https://github.com/prognerds" class="social-link" title="GitHub" target="_blank"><i
                class="fab fa-github"></i></a>
            <a href="https://dev.prognerds.com" class="social-link" title="Portfolio" target="_blank"><i
                class="fas fa-globe"></i></a>
            <a href="https://www.youtube.com/@prognerds" class="social-link" title="YouTube" target="_blank"><i
                class="fab fa-youtube"></i></a>
            <a href="https://www.facebook.com/kawsarshaikat" class="social-link" title="Facebook" target="_blank"><i
                class="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/kawsarshaikat" class="social-link" title="Instagram" target="_blank"><i
                class="fab fa-instagram"></i></a>
            <a href="https://twitter.com/kawsarshaikat" class="social-link" title="Twitter" target="_blank"><i
                class="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>
      <a href="https://github.com/prognerds/uiucalculator" class="source-link"><i class="fab fa-github"></i> View Source Code</a>
    </div>



  </div>
`;
  }
}
customElements.define("header-x", globalHeader);
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




const lastUpdatedDate = new Date("2025-08-24T00:00:00");
const timeAgoEl = document.getElementById("timeAgo");

function updateTimeAgo() {
    const now = new Date();

    let years = now.getFullYear() - lastUpdatedDate.getFullYear();
    let months = now.getMonth() - lastUpdatedDate.getMonth();
    let days = now.getDate() - lastUpdatedDate.getDate();
    let hours = now.getHours() - lastUpdatedDate.getHours();
    let minutes = now.getMinutes() - lastUpdatedDate.getMinutes();
    let seconds = now.getSeconds() - lastUpdatedDate.getSeconds();

    // Adjust negative values
    if (seconds < 0) { seconds += 60; minutes -= 1; }
    if (minutes < 0) { minutes += 60; hours -= 1; }
    if (hours < 0) { hours += 24; days -= 1; }
    if (days < 0) { 
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonth; 
        months -= 1; 
    }
    if (months < 0) { months += 12; years -= 1; }

    let result = "";
    if (years > 0) result += years + "y ";
    if (months > 0) result += months + "mo ";
    if (days > 0) result += days + "d ";
    if (hours > 0) result += hours + "h ";
    if (minutes > 0) result += minutes + "m ";
    result += seconds + "s ago";

    timeAgoEl.textContent = result;
}

updateTimeAgo();
setInterval(updateTimeAgo, 1000);

