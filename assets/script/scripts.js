function downloadTableAsCSV() {
    const table = document.getElementById("grading-table");
    let csv = [];
    for (let row of table.rows) {
        let cols = [];
        for (let cell of row.cells) {
            cols.push(cell.innerText);
        }
        csv.push(cols.join(","));
    }
    const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(csvFile);
    link.download = "UIU-Grading-System-ProgNerds.csv";
    link.click();
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("commentButton").addEventListener("click", function () {
        document.getElementById("commentSection").scrollIntoView({ behavior: "smooth" });
    });
});

const toggle = document.querySelector('#commentSection .accordion-toggle');
const content = document.getElementById('commentContent');
toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    content.hidden = isOpen;
});

document.addEventListener('DOMContentLoaded', () => {
      const result = document.getElementById('cgpaResult');
      const placeholder = document.getElementById('rightPlaceholder');
      const resetBtn = document.getElementById('resetCGPABtn');

      const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
      const hasResult = () => result && result.textContent.trim().length > 0;

      function syncPlaceholder() {
        if (!placeholder) return;
        if (!isDesktop()) {
          placeholder.hidden = true;
          return;
        }
        placeholder.hidden = hasResult();
      }
      syncPlaceholder();
      if (result) {
        const obs = new MutationObserver(syncPlaceholder);
        obs.observe(result, { childList: true, subtree: true, characterData: true });
      }

      resetBtn?.addEventListener('click', () => {
        if (result) result.textContent = '';
        syncPlaceholder();
      });

      window.addEventListener('resize', syncPlaceholder);
    });


    document.addEventListener('DOMContentLoaded', () => {
      const tuitionResult = document.getElementById('tuitionResult'); 
      const displayResult = document.getElementById('cgpaResult');    
      const placeholder = document.getElementById('rightPlaceholder');
      const resetBtn = document.getElementById('resetFeeBtn');

      const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;

      function sync() {
        const hasContent = tuitionResult && tuitionResult.innerHTML.trim().length > 0;

        if (displayResult && tuitionResult) {
          displayResult.innerHTML = tuitionResult.innerHTML;
        } else if (displayResult && !tuitionResult) {
          displayResult.innerHTML = '';
        }

        if (placeholder) {
          placeholder.hidden = hasContent || !isDesktop();
        }
      }
      sync();

      if (tuitionResult) {
        const obs = new MutationObserver(sync);
        obs.observe(tuitionResult, { childList: true, subtree: true, characterData: true });
      }

      resetBtn?.addEventListener('click', () => {
        if (tuitionResult) tuitionResult.innerHTML = '';
        if (displayResult) displayResult.innerHTML = '';
        sync();
      });

      window.addEventListener('resize', sync);
    });