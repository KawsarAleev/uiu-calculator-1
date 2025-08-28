const scrollUp = document.getElementById('scrollUp');
const scrollDown = document.getElementById('scrollDown');
const scrollButtons = document.getElementById('scrollButtons');
let scrollTimeout;
const updateScrollButtons = () => {
    const scrollPosition = window.scrollY;
    const contentHeight = document.body.scrollHeight;
    const visibleHeight = window.innerHeight;
    clearTimeout(scrollTimeout);
    if (scrollPosition === 0) {
        scrollButtons.classList.add('fade-out');
        return; 
    }
    scrollButtons.classList.remove('fade-out');
    scrollTimeout = setTimeout(() => {
        scrollButtons.classList.add('fade-out');
    }, 2000);
    if (scrollPosition + visibleHeight >= contentHeight - 1) {
        scrollDown.style.display = 'none';
    } else {
        scrollDown.style.display = 'inline-block';
    }
};
const addButtonEffect = (button) => {
    button.classList.add('active');
    setTimeout(() => {
        button.classList.remove('active');
    }, 200);
};
scrollUp.addEventListener('click', () => {
    addButtonEffect(scrollUp);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
scrollDown.addEventListener('click', () => {
    addButtonEffect(scrollDown);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});
window.addEventListener('scroll', updateScrollButtons);
updateScrollButtons();