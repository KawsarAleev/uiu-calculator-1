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