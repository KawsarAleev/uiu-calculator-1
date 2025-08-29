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