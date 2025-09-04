class globalHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
  <div id="greeting" style="font-weight: 600;"></div>
  <!-- <header>
    <a href="index.html" class="logo">
      <img src="./assets/image/uiuCalculatorLogo.png" alt="UIU Calculator Logo">
    </a>
    <button>
      CGPA Calculator
    </button>
    <button>
      Tuition Fee Calculator
    </button>
    <button class="hamburger-btn" id="hamburgerBtn">
      <i class="fas fa-bars"></i>
    </button>
  </header>-->

  <header>
  <a href="index.html" class="logo">
    <img src="./assets/image/uiuCalculatorLogo.png" alt="UIU Calculator Logo">
  </a>

  <nav class="header-links">
    <button class="hamburger-btn" id="hamburgerBtn">
      <i class="fas fa-bars"></i>
    </button>
  </nav>
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
<div class="card" style="background: rgba(0, 0, 0, 0.2);     border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 10px;">
    <div class="card-header padding2">
        <h3 class="card-title flex itemsC gap1 text-base">
            <i class="fas fa-user textA" style="margin-right: 3px;"></i>
            Enter your name
        </h3>
        </div>
        <div class="card-content">
        <input type="text" id="usernameInput" placeholder="Enter your name" style="    border: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
        <label style="text-align: center; font-size: 11px!important;">[For personalized greeting 🙌]</label>
    </div>
</div>
      <a href="index.html" class="item" style="text-decoration: none; color: inherit; display: block; margin-bottom: 10px; border: 1px solid rgb(255, 255, 255, 0.1);">Return Home</a>
      <a href="cgpa.html" class="item" style="text-decoration: none; color: inherit; display: block; margin-bottom: 10px; border: 1px solid rgb(255, 255, 255, 0.1);">CGPA Calculator</a>
      <a href="tuitionfee.html" class="item" style="text-decoration: none; color: inherit; display: block; margin-bottom: 10px; border: 1px solid rgb(255, 255, 255, 0.1);">Tuition Fee Calculator</a>
    </div>
<div class="menu-footer-f1">
<div class="uiu-badge">
  <span class="uiu-badge-left">Version</span>
  <span class="uiu-badge-right">1 . 0 . 0</span>
</div>

<div class="uiu-license-badge">
  <span class="uiu-license-left">License</span>
  <span class="uiu-license-right">M I T</span>
</div>
  </span>
</div>
<div class="menu-footer-f1">
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
      <a href="https://github.com/prognerds/uiucalculator" class="item" style="text-decoration: none; color: inherit; display: block; margin-top: 10px; margin-bottom: 0; width: 100%; border: 1px solid rgb(255, 255, 255, 0.1);"><i class="fab fa-github"></i> View Source Code</a>
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

