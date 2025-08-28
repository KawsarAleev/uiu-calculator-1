class globalNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `

<div class="navbar">
    <a href="index.html" style="text-decoration: none;">
        <button>
            <i class="fa-solid fa-home"></i><span>Home</span>
        </button>
    </a>
    <a href="cgpa.html" style="text-decoration: none;">
        <button>
            <i class="fa-solid fa-graduation-cap"></i><span>CGPA</span>
        </button>
    </a>
    <a href="installment.html" style="text-decoration: none;">
        <button>
            <i class="fa-solid fa-money-bill-wave"></i><span>Installment</span>
        </button>
    </a>
    <button id="reloadButton">
        <i class="fas fa-refresh"></i><span>Reset</span>
    </button>
    <button id="shareButton">    
        <i class="fas fa-share-alt"></i><span>Share</span>
    </button>
</div>
<div class="overlay" id="overlay"></div>
<div class="modal-share" id="shareModal">
    <button class="close" id="closeModal">&times;</button>
    <h2 class="grad-txt"  style="text-align: left!important">Share</h2>
    <div class="share-buttons">
        <a href="#" id="facebookShare" target="_blank"><i class="fab fa-facebook"></i>Facebook</a>
        <a href="#" id="messengerShare" target="_blank"><i class="fab fa-facebook-messenger"></i>Messenger</a>
        <a href="#" id="instagramShare" target="_blank"><i class="fab fa-instagram"></i>Instagram</a>
        <a href="#" id="twitterShare" target="_blank"><i class="fab fa-twitter"></i>Twitter</a>
        <a href="#" id="linkedinShare" target="_blank"><i class="fab fa-linkedin"></i>LinkedIn</a>
        <a href="#" id="redditShare" target="_blank"><i class="fab fa-reddit"></i>Reddit</a>
        <a href="#" id="pinterestShare" target="_blank"><i class="fab fa-pinterest"></i>Pinterest</a>
        <a href="#" id="discordShare" target="_blank"><i class="fab fa-discord"></i>Discord</a>
        <a href="#" id="telegramShare" target="_blank"><i class="fab fa-telegram"></i>Telegram</a>
        <a href="#" id="whatsappShare" target="_blank"><i class="fab fa-whatsapp"></i>WhatsApp</a>
        <a href="#" id="viberShare" target="_blank"><i class="fab fa-viber"></i>Viber</a>
        <a href="#" id="tumblrShare" target="_blank"><i class="fab fa-tumblr"></i>Tumblr</a>
        <a href="#" id="emailShare" target="_blank"><i class="fas fa-envelope"></i>Email</a>
    </div>
    <div class="copy-link">
        <input type="text" id="shareLink" readonly>
        <button id="copyButton">Copy Link</button>
    </div>
</div>
`;
  }
}
customElements.define("nav-x", globalNav);


const shareButton = document.getElementById("shareButton");
const shareModal = document.getElementById("shareModal");
const overlay = document.getElementById("overlay");
const closeModal = document.getElementById("closeModal");
const copyButton = document.getElementById("copyButton");
const shareLink = document.getElementById("shareLink");
const currentPageUrl = window.location.href;
shareLink.value = currentPageUrl;
document
  .getElementById("facebookShare")
  .setAttribute(
    "href",
    `https://facebook.com/sharer/sharer.php?u=${currentPageUrl}`
  );
document
  .getElementById("messengerShare")
  .setAttribute(
    "href",
    `https://www.facebook.com/dialog/send?app_id=YOUR_APP_ID&link=${currentPageUrl}&redirect_uri=${currentPageUrl}`
  );
document
  .getElementById("twitterShare")
  .setAttribute("href", `https://twitter.com/share?url=${currentPageUrl}`);
document
  .getElementById("linkedinShare")
  .setAttribute(
    "href",
    `https://www.linkedin.com/shareArticle?mini=true&url=${currentPageUrl}`
  );
document
  .getElementById("redditShare")
  .setAttribute("href", `https://www.reddit.com/submit?url=${currentPageUrl}`);
document
  .getElementById("pinterestShare")
  .setAttribute(
    "href",
    `https://pinterest.com/pin/create/button/?url=${currentPageUrl}`
  );
document
  .getElementById("whatsappShare")
  .setAttribute("href", `https://wa.me/?text=${currentPageUrl}`);
document
  .getElementById("telegramShare")
  .setAttribute("href", `https://t.me/share/url?url=${currentPageUrl}`);
document
  .getElementById("tumblrShare")
  .setAttribute(
    "href",
    `https://www.tumblr.com/widgets/share/tool?url=${currentPageUrl}`
  );
document
  .getElementById("viberShare")
  .setAttribute("href", `https://www.viber.com/en/share?url=${currentPageUrl}`);
document
  .getElementById("discordShare")
  .setAttribute("href", `https://discord.com/share?url=${currentPageUrl}`);
document
  .getElementById("instagramShare")
  .setAttribute("href", `https://www.instagram.com/?url=${currentPageUrl}`);
document
  .getElementById("emailShare")
  .setAttribute(
    "href",
    `mailto:?subject=Check%20this%20out&body=${encodeURIComponent(
      currentPageUrl
    )}`
  );
shareButton.addEventListener("click", () => {
  shareModal.style.display = "block";
  overlay.style.display = "block";
});
closeModal.addEventListener("click", () => {
  shareModal.style.display = "none";
  overlay.style.display = "none";
});
overlay.addEventListener("click", () => {
  shareModal.style.display = "none";
  overlay.style.display = "none";
});
copyButton.addEventListener("click", () => {
  shareLink.select();
  document.execCommand("copy");
  alert("Link copied to clipboard!");
});
document.getElementById("reloadButton").addEventListener("click", function () {
  location.reload();
});
