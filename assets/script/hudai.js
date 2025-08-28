function updateCoursesTable() {
    const tableBody = document.getElementById("coursesTableBody");
    const coursesList = document.getElementById("coursesList");

    if (courses.length === 0) {
        coursesList.style.display = "none";
        tableBody.innerHTML = "";
        return;
    }

    coursesList.style.display = "block";
    tableBody.innerHTML = "";

    // Calculate total points for % contribution
    let totalCoursePoints = 0;
    courses.forEach(course => {
        totalCoursePoints += course.credit * gradePoints[course.grade];
    });

    // Get current CGPA to highlight low grades
    const currentCGPA = parseFloat(document.getElementById("currentCGPA").value) || 0;

    courses.forEach(course => {
        const gradePoint = gradePoints[course.grade];
        const points = course.credit * gradePoint;
        const percentImpact = ((points / totalCoursePoints) * 100).toFixed(1);

        // Determine note class based on grade point vs current CGPA
        let noteClass = "note-g1"; // default green
        if (gradePoint < currentCGPA) noteClass = "note-r1";
        else if (gradePoint === currentCGPA) noteClass = "note-b1";

        // === Main row ===
        const row = document.createElement("tr");

        const creditCell = document.createElement("td");
        creditCell.className = "text-xs py-2";
        creditCell.textContent = course.credit;

        const gradeCell = document.createElement("td");
        gradeCell.className = "text-xs py-2";
        gradeCell.textContent = course.grade;

        const gradePointCell = document.createElement("td");
        gradePointCell.className = "text-xs py-2 text-green-500 font-semibold";
        gradePointCell.textContent = gradePoint.toFixed(2);

        const actionCell = document.createElement("td");
        actionCell.className = "text-center py-2";
        const deleteButton = document.createElement("button");
        deleteButton.className = "btn-destructive btn-sm h-6 w-6 p-0";
        deleteButton.innerHTML = `<i class="fas fa-trash text-amber-500"></i>`;
        deleteButton.onclick = () => removeCourse(course.id);
        actionCell.appendChild(deleteButton);

        row.appendChild(creditCell);
        row.appendChild(gradeCell);
        row.appendChild(gradePointCell);
        row.appendChild(actionCell);
        tableBody.appendChild(row);

        // === Full-width note row ===
        const noteRow = document.createElement("tr");
        const noteCell = document.createElement("td");
        noteCell.colSpan = 4;
        noteCell.className = `text-xs p-3 ${noteClass}`;
        noteCell.innerHTML = `
            <div class="rounded-md p-2">
                <p>${course.credit} × ${gradePoint.toFixed(2)} = ${points.toFixed(2)}</p>
                <p style="color: #10b981; margin-top:0.3rem;"><i class="fa fa-chart-line"></i> Contribution to trimester GPA: <strong>${percentImpact}%</strong></p>
            </div>
        `;
        noteRow.appendChild(noteCell);
        tableBody.appendChild(noteRow);
    });
}








function updateRetakeCoursesTable() {
    const tableBody = document.getElementById("retakeCoursesTableBody");
    const retakeCoursesList = document.getElementById("retakeCoursesList");

    if (retakeCourses.length === 0) {
        retakeCoursesList.style.display = "none";
        tableBody.innerHTML = "";
        return;
    }

    retakeCoursesList.style.display = "block";
    tableBody.innerHTML = "";

    retakeCourses.forEach((course) => {
        const previousGradePoint = gradePoints[course.previousGrade];
        const newGradePoint = gradePoints[course.newGrade];

        const previousPoints = course.credit * previousGradePoint;
        const newPoints = course.credit * newGradePoint;
        const improvement = newPoints - previousPoints;

        let noteClass = "note-b"; // default same grade
        let message = "";

        if (newGradePoint > previousGradePoint) {
    noteClass = "note-g1";
    message = `<p class="text-xs text-green-500 mt-1" style="margin-top:0.3rem;"><i class="fa fa-arrow-up"></i> Your grade improved</p>`;
} else if (newGradePoint < previousGradePoint) {
    noteClass = "note-r1";
    message = `<p class="text-xs text-red-500 mt-1" style="margin-top:0.3rem;"><i class="fa fa-exclamation-triangle"></i> Your previous grade was higher and that will be counted</p>`;
} else {
    message = `<p class="text-xs text-gray-600 mt-1" style="margin-top:0.3rem;"><i class="fa fa-info-circle"></i> Your grade has not changed</p>`;
}


        // === Row with basic info ===
        const row = document.createElement("tr");

        const creditCell = document.createElement("td");
        creditCell.className = "text-xs py-2";
        creditCell.textContent = course.credit;

        const previousGradeCell = document.createElement("td");
        previousGradeCell.className = "text-xs py-2";
        previousGradeCell.textContent = course.previousGrade;

        const newGradeCell = document.createElement("td");
        newGradeCell.className = "text-xs py-2";
        newGradeCell.textContent = course.newGrade;

        const improvementCell = document.createElement("td");
        improvementCell.className = "text-xs py-2";
        const colorClass = improvement > 0 ? "text-green-500" : improvement < 0 ? "text-red-500" : "text-gray-500";
        improvementCell.innerHTML = `<span class="${colorClass} font-semibold">
            ${improvement >= 0 ? "+" : ""}${improvement.toFixed(2)}
        </span>`;

        const actionCell = document.createElement("td");
        actionCell.className = "text-center py-2";

        const deleteButton = document.createElement("button");
        deleteButton.className = "btn-destructive btn-sm h-6 w-6 p-0";
        deleteButton.innerHTML = `<i class="fas fa-trash text-amber-500"></i>`;
        deleteButton.onclick = () => removeRetakeCourse(course.id);

        actionCell.appendChild(deleteButton);

        row.appendChild(creditCell);
        row.appendChild(previousGradeCell);
        row.appendChild(newGradeCell);
        row.appendChild(improvementCell);
        row.appendChild(actionCell);

        tableBody.appendChild(row);

        // === Full-width note row ===
        const noteRow = document.createElement("tr");
        const noteCell = document.createElement("td");
        noteCell.colSpan = 5;
        noteCell.className = `text-xs p-2 ${noteClass}`;
        noteCell.innerHTML = `
            <p class="text-gray-700">
                ${course.credit} × ${previousGradePoint.toFixed(2)} = ${previousPoints.toFixed(2)} 
                → ${course.credit} × ${newGradePoint.toFixed(2)} = ${newPoints.toFixed(2)}
            </p>
            ${message}
        `;
        noteRow.appendChild(noteCell);

        tableBody.appendChild(noteRow);
    });
}
