// =====================
// Grade Points Mapping
// =====================
const gradePoints = {
  A: 4.0,
  "A-": 3.67,
  "B+": 3.33,
  B: 3.0,
  "B-": 2.67,
  "C+": 2.33,
  C: 2.0,
  "C-": 1.67,
  "D+": 1.33,
  D: 1.0,
  F: 0.0,
};

// =====================
// Helpers
// =====================
function getOrCreateErrorEl(id, afterElementId) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("small");
    el.id = id;
    el.style.display = "none";
    el.style.color = "#dc2626"; 
    el.style.fontSize = "12px";
    el.className = "form-error";
    const afterEl = document.getElementById(afterElementId);
    if (afterEl && afterEl.parentNode) {
      afterEl.parentNode.insertBefore(el, afterEl.nextSibling);
    } else {
      document.body.appendChild(el);
    }
  }
  return el;
}

function showError(id, msg, afterElementId) {
  const el = getOrCreateErrorEl(id, afterElementId);
  el.textContent = msg;
  el.style.display = "block";
}

function hideError(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

function clampToNonNegativeInput(inputEl, errorId, label) {
  const v = inputEl.value;
  if (v === "") {
    showError(errorId, `Please enter ${label}`, inputEl.id);
    return;
  }
  const n = parseFloat(v);
  if (isNaN(n)) {
    showError(errorId, "Please enter a valid number", inputEl.id);
  } else if (n < 0) {
    inputEl.value = 0;
    showError(errorId, `${label} cannot be negative`, inputEl.id);
  } else {
    hideError(errorId);
  }
}

// =====================
// Dropdown Population
// =====================
function populateGradeDropdowns() {
  const courseGrade = document.getElementById("courseGrade");
  const previousGrade = document.getElementById("previousGrade");
  const newGrade = document.getElementById("newGrade");

  if (!courseGrade || !previousGrade || !newGrade) return;

  courseGrade.innerHTML = "";
  previousGrade.innerHTML = "";
  newGrade.innerHTML = "";

  Object.keys(gradePoints).forEach((grade) => {
    const option = document.createElement("option");
    option.value = grade;
    option.textContent = `${grade} (${gradePoints[grade].toFixed(2)})`;
    courseGrade.appendChild(option.cloneNode(true));
    previousGrade.appendChild(option.cloneNode(true));
    newGrade.appendChild(option.cloneNode(true));
  });

  courseGrade.value = "A";
  previousGrade.value = "C";
  newGrade.value = "B";
}

// =====================
// State
// =====================
let courses = [];
let retakeCourses = [];

// =====================
// Course Add/Remove
// =====================
function addCourse() {
  const creditEl = document.getElementById("courseCredit");
  const gradeEl = document.getElementById("courseGrade");
  const credit = parseFloat(creditEl.value);
  const grade = gradeEl.value;

  // Basic guard: ignore if invalid credit
  if (isNaN(credit) || credit <= 0) {
    showError("courseCreditError", "Please enter a valid course credit (> 0)", "courseCredit");
    return;
  } else {
    hideError("courseCreditError");
  }

  courses.push({
    id: Date.now().toString(),
    credit: credit,
    grade: grade,
  });
  updateCoursesTable();
}

function addRetakeCourse() {
  const creditEl = document.getElementById("retakeCourseCredit");
  const previousGrade = document.getElementById("previousGrade").value;
  const newGrade = document.getElementById("newGrade").value;
  const credit = parseFloat(creditEl.value);

  // Basic guard: ignore if invalid credit
  if (isNaN(credit) || credit <= 0) {
    showError("retakeCourseCreditError", "Please enter a valid course credit (> 0)", "retakeCourseCredit");
    return;
  } else {
    hideError("retakeCourseCreditError");
  }

  retakeCourses.push({
    id: Date.now().toString(),
    credit: credit,
    previousGrade: previousGrade,
    newGrade: newGrade,
  });
  updateRetakeCoursesTable();
}

function removeCourse(id) {
  courses = courses.filter((course) => course.id !== id);
  updateCoursesTable();
}
function removeRetakeCourse(id) {
  retakeCourses = retakeCourses.filter((course) => course.id !== id);
  updateRetakeCoursesTable();
}

// =====================
// Tables
// =====================
function updateCoursesTable() {
  const tableBody = document.getElementById("coursesTableBody");
  const coursesList = document.getElementById("coursesList");
  if (!tableBody || !coursesList) return;

  if (courses.length === 0) {
    coursesList.style.display = "none";
    tableBody.innerHTML = "";
    return;
  }
  coursesList.style.display = "block";
  tableBody.innerHTML = "";

  let totalCoursePoints = 0;
  courses.forEach((course) => {
    totalCoursePoints += course.credit * gradePoints[course.grade];
  });

  const currentCGPA = parseFloat(document.getElementById("currentCGPA").value) || 0;

  courses.forEach((course) => {
    const gradePoint = gradePoints[course.grade];
    const points = course.credit * gradePoint;
    const percentImpact =
      totalCoursePoints > 0 ? ((points / totalCoursePoints) * 100).toFixed(1) : "0.0";

    let noteClass = "note-g1";
    if (gradePoint < currentCGPA) noteClass = "note-r1";
    else if (gradePoint === currentCGPA) noteClass = "note-b1";

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

    const noteRow = document.createElement("tr");
    const noteCell = document.createElement("td");
    noteCell.colSpan = 4;
    noteCell.className = `text-xs p-3 ${noteClass}`;
    noteCell.innerHTML = `
      <div class="rounded-md p-2">
        <p>${course.credit} × ${gradePoint.toFixed(2)} = ${points.toFixed(2)}</p>
        <p style="color: #10b981; margin-top:0.3rem;">
          <i class="fa fa-chart-line"></i> Contribution to trimester GPA: <strong>${percentImpact}%</strong>
        </p>
      </div>
    `;
    noteRow.appendChild(noteCell);
    tableBody.appendChild(noteRow);
  });
}

function updateRetakeCoursesTable() {
  const tableBody = document.getElementById("retakeCoursesTableBody");
  const retakeCoursesList = document.getElementById("retakeCoursesList");
  if (!tableBody || !retakeCoursesList) return;

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

    let noteClass = "note-b1";
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
    const colorClass =
      improvement > 0
        ? "text-green-500"
        : improvement < 0
        ? "text-red-500"
        : "text-gray-500";
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

// =====================
// CGPA Calculation
// =====================
function calculateCGPA() {
  const completedCreditEl = document.getElementById("completedCredit");
  const currentCGPAEl = document.getElementById("currentCGPA");

  const completedCredit = parseFloat(completedCreditEl.value);
  const currentCGPA = parseFloat(currentCGPAEl.value);

  let isValid = true;

  if (isNaN(completedCredit)) {
    const el = document.getElementById("completedCreditError") || getOrCreateErrorEl("completedCreditError", "completedCredit");
    el.style.display = "block";
    el.textContent = "Please enter your completed credits";
    isValid = false;
  } else if (completedCredit < 0) {
    completedCreditEl.value = 0;
    const el = document.getElementById("completedCreditError") || getOrCreateErrorEl("completedCreditError", "completedCredit");
    el.style.display = "block";
    el.textContent = "Completed credits cannot be negative";
    isValid = false;
  } else {
    const el = document.getElementById("completedCreditError");
    if (el) el.style.display = "none";
  }

  if (isNaN(currentCGPA)) {
    const el = document.getElementById("currentCGPAError") || getOrCreateErrorEl("currentCGPAError", "currentCGPA");
    el.style.display = "block";
    el.textContent = "Please enter your current CGPA";
    isValid = false;
  } else {
    const el = document.getElementById("currentCGPAError");
    if (el) el.style.display = "none";
  }

  if (!isValid) return;

  const currentQualityPoints = completedCredit * currentCGPA;

  let newCourseCredits = 0;
  let newCoursePoints = 0;
  courses.forEach((course) => {
    newCourseCredits += course.credit;
    newCoursePoints += course.credit * gradePoints[course.grade];
  });

  const currentTrimesterGPA = newCourseCredits > 0 ? newCoursePoints / newCourseCredits : 0;

  let retakeCourseCredits = 0;
  let retakeImprovementPoints = 0;
  retakeCourses.forEach((course) => {
    retakeCourseCredits += course.credit;
    const previousPoints = course.credit * gradePoints[course.previousGrade];
    const newPoints = course.credit * gradePoints[course.newGrade];
    retakeImprovementPoints += newPoints - previousPoints;
  });

  const totalQualityPoints = currentQualityPoints + newCoursePoints + retakeImprovementPoints;
  const totalCredits = completedCredit + newCourseCredits;

  const resultDiv = document.getElementById("cgpaResult");
  if (!resultDiv) return;

  if (totalCredits <= 0) {
    resultDiv.innerHTML = `
      <div class="card">
        <div class="card-header bg-red-500/10 py-3">
          <h3 class="card-title flex items-center gap-2 text-base">
            <i class="fas fa-circle-exclamation text-amber-500"></i>
            Invalid Input
          </h3>
        </div>
        <div class="card-content pt-4">
          <div class="flex flex-col items-center justify-center text-center">
            <i class="fas fa-triangle-exclamation text-amber-500" style="font-size: 3rem!important; margin-bottom: 1rem;"></i>
            <h4 class="text-xl font-bold text-amber-500 mb-3">Total credits cannot be 0</h4>
            <p class="mb-4" style="margin-top: 10px; text-align: justify;">
              Please enter completed credits or add at least one course to calculate CGPA.
            </p>
          </div>
        </div>
      </div>
    `;
    resultDiv.style.display = "block";
    try {
      document.getElementById("backToCalculatorBtn")?.addEventListener("click", hideResults);
      document.getElementById("backToCalculatorBtn2")?.addEventListener("click", hideResults);
      document.getElementById("resetCGPABtn2")?.addEventListener("click", resetCGPA);
    } catch (e) {}
    return;
  }

  const newCGPA = totalQualityPoints / totalCredits;

  if (newCGPA > 4.0) {
    resultDiv.innerHTML = `
      <div class="card">
        <div class="card-header bg-red-500/10 py-3">
          <h3 class="card-title flex items-center gap-2 text-base">
            <i class="fas fa-circle-exclamation text-amber-500"></i>
            Invalid Input Detected
          </h3>
        </div>
        <div class="card-content pt-4">
          <div class="flex flex-col items-center justify-center text-center">
            <i class="fas fa-triangle-exclamation text-amber-500" style="font-size: 3rem!important; margin-bottom: 1rem;"></i>
            <h4 class="text-xl font-bold text-amber-500 mb-3">CGPA Cannot Exceed 4.00</h4>
            <p class="mb-4" style="margin-top: 10px; text-align: justify;">
              The calculated CGPA (${newCGPA.toFixed(2)}) exceeds the maximum possible value of 4.00. 
              This indicates that you may have entered incorrect information.
            </p>
            <div class="note-r note-r-sp1">
              <strong>Possible reasons:</strong><br>
              - Too many retake courses with high grade improvements<br>
              - Incorrect current CGPA or completed credit hours<br>
              - Unrealistic expected grades for new courses<br>
              - Data entry errors in course information
            </div>
            <p class="text-sm mt-4" style="text-align: justify;">
              Please review and correct your input data, then try calculating again.
            </p>
          </div>
        </div>
      </div>
    `;
  } else {
    resultDiv.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div class="card">
          <div class="card-header bg-muted/30 py-3">
            <h3 class="card-title flex items-center gap-2 text-base">
              <i class="fas fa-star text-amber-500"></i>
              Projected Final CGPA
            </h3>
          </div>
          <div class="card-content pt-4">
            <div class="flex flex-col items-center justify-center">
              <div class="grad-txt">${newCGPA.toFixed(2)}</div>
              <div class="flex items-center gap-2 mt-1">
                <span class="${currentCGPA < newCGPA ? "text-green-500" : "text-amber-500"}">
                  ${currentCGPA < newCGPA ? "+" : ""}${(newCGPA - currentCGPA).toFixed(2)}
                </span>
                <span class="text-muted-foreground">from current trimester</span>
              </div>
              <div class="w-full mt-3">
                <div class="relative pt-1 w-full">
                  <div class="overflow-hidden h-2 mb-3 text-xs flex rounded bg-muted">
                    <div style="width: ${newCGPA * 25}%"
                      class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        ${newCourseCredits > 0 ? `
        <div class="card">
          <div class="card-header bg-green-500/10 py-3">
            <h3 class="card-title flex items-center gap-2 text-base">
              <i class="fas fa-chart-line text-green-500"></i>
              Projected Trimester GPA
            </h3>
          </div>
          <div class="card-content pt-4">
            <div class="flex flex-col items-center justify-center">
              <div class="grad-txt text-green-600">${currentTrimesterGPA.toFixed(2)}</div>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-muted-foreground">Based on ${courses.length} course${courses.length > 1 ? 's' : ''}</span>
              </div>
              <div class="w-full mt-3">
                <div class="relative pt-1 w-full">
                  <div class="overflow-hidden h-2 mb-3 text-xs flex rounded bg-muted">
                    <div style="width: ${currentTrimesterGPA * 25}%"
                      class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>` : ''}

        <div class="card">
          <div class="card-header py-3">
            <h3 class="card-title flex items-center gap-2 text-base">
              <i class="fas fa-table text-blue-500"></i>
              Result Summary
            </h3>
          </div>
          <div class="card-content space-y-3">
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span>Current CGPA</span>
                <span>${currentCGPA.toFixed(2)}</span>
              </div>
              <div class="flex justify-between items-center">
                <span>Completed Credits</span>
                <span>${completedCredit.toFixed(1)}</span>
              </div>
              <div class="separator"></div>
              ${courses.length > 0 ? `
              <div class="flex justify-between items-center">
                <span>New Courses</span>
                <span class="badge badge-outline">${courses.length}</span>
              </div>
              <div class="flex justify-between items-center">
                <span>New Course Credits</span>
                <span>${newCourseCredits.toFixed(1)}</span>
              </div>
              <div class="flex justify-between items-center">
                <span>Trimester GPA</span>
                <span class="text-green-600 font-semibold">${currentTrimesterGPA.toFixed(2)}</span>
              </div>
              <div class="separator"></div>
              ` : ""}

              ${retakeCourses.length > 0 ? `
              <div class="flex justify-between items-center">
                <span>Retake Courses</span>
                <span class="badge badge-outline">${retakeCourses.length}</span>
              </div>
              <div class="flex justify-between items-center">
                <span>Retake Course Credits</span>
                <span>${retakeCourseCredits.toFixed(1)}</span>
              </div>
              <div class="flex justify-between items-center">
                <span>Quality Point Improvement</span>
                <span>${retakeImprovementPoints.toFixed(2)}</span>
              </div>
              <div class="separator"></div>
              ` : ""}

              <div class="flex justify-between items-center">
                <span>Total Credits After Completion</span>
                <span>${totalCredits.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  resultDiv.style.display = "block";
  try {
    document.getElementById("backToCalculatorBtn")?.addEventListener("click", hideResults);
    document.getElementById("backToCalculatorBtn2")?.addEventListener("click", hideResults);
    document.getElementById("resetCGPABtn2")?.addEventListener("click", resetCGPA);
  } catch (e) {}
}

function hideResults() {
  const el = document.getElementById("cgpaResult");
  if (el) el.style.display = "none";
}

// =====================
// Tuition Fee Calculation
// =====================
function calculateTuitionFee() {
  const newCreditInput = document.getElementById("newCredit");
  const retakeCreditInput = document.getElementById("retakeCredit");

  const perCreditFee = parseFloat(document.getElementById("perCreditFee").value);
  const trimesterFee = parseFloat(document.getElementById("trimesterFee").value);

  const waiver = parseFloat(document.getElementById("waiver").value);
  const scholarship = parseFloat(document.getElementById("scholarship").value);
  const lateRegistration = document.getElementById("lateRegistration").checked;
  const waiverInFirstInstallment = document.getElementById("waiverInFirstInstallment").checked;
  const siblingSpouseWaiver = parseFloat(document.getElementById("siblingSpouseWaiver").value);
  const ethnicTribalWaiver = parseFloat(document.getElementById("ethnicTribalWaiver").value);
  const disabilityWaiver = parseFloat(document.getElementById("disabilityWaiver").value);

  // Create/resolve error slots for fee form
  const perCreditFeeErrorEl = document.getElementById("perCreditFeeError") || getOrCreateErrorEl("perCreditFeeError", "perCreditFee");
  const trimesterFeeErrorEl = document.getElementById("trimesterFeeError") || getOrCreateErrorEl("trimesterFeeError", "trimesterFee");
  const newCreditErrorEl = getOrCreateErrorEl("newCreditError", "newCredit");
  const retakeCreditErrorEl = getOrCreateErrorEl("retakeCreditError", "retakeCredit");
  const creditTotalErrorEl = getOrCreateErrorEl("creditTotalError", "retakeCredit");

  // Parse credits (empty -> 0)
  const newCreditStr = newCreditInput.value.trim();
  const retakeCreditStr = retakeCreditInput.value.trim();
  const newCredit = newCreditStr === "" ? 0 : parseFloat(newCreditStr);
  const retakeCredit = retakeCreditStr === "" ? 0 : parseFloat(retakeCreditStr);

  let isValid = true;

  // Reset error messages
  perCreditFeeErrorEl.style.display = "none";
  trimesterFeeErrorEl.style.display = "none";
  newCreditErrorEl.style.display = "none";
  retakeCreditErrorEl.style.display = "none";
  creditTotalErrorEl.style.display = "none";

  // Fee inputs validation
  if (isNaN(perCreditFee)) {
    perCreditFeeErrorEl.textContent = "Please enter per credit fee";
    perCreditFeeErrorEl.style.display = "block";
    isValid = false;
  }
  if (isNaN(trimesterFee)) {
    trimesterFeeErrorEl.textContent = "Please enter trimester fee";
    trimesterFeeErrorEl.style.display = "block";
    isValid = false;
  }

  // Credits validation: cannot be negative
  if (isNaN(newCredit)) {
    newCreditErrorEl.textContent = "Enter a valid number";
    newCreditErrorEl.style.display = "block";
    isValid = false;
  } else if (newCredit < 0) {
    newCreditInput.value = 0;
    newCreditErrorEl.textContent = "New credit cannot be negative";
    newCreditErrorEl.style.display = "block";
    isValid = false;
  }

  if (isNaN(retakeCredit)) {
    retakeCreditErrorEl.textContent = "Enter a valid number";
    retakeCreditErrorEl.style.display = "block";
    isValid = false;
  } else if (retakeCredit < 0) {
    retakeCreditInput.value = 0;
    retakeCreditErrorEl.textContent = "Retake credit cannot be negative";
    retakeCreditErrorEl.style.display = "block";
    isValid = false;
  }

  // Both cannot be 0 at the same time
  if (isValid && newCredit === 0 && retakeCredit === 0) {
    creditTotalErrorEl.textContent = "Both credits cannot be 0";
    creditTotalErrorEl.style.display = "block";
    return;
  }

  if (!isValid) return;

  // Proceed with calculation
  const totalCredit = newCredit + retakeCredit;
  const totalCreditFee = totalCredit * perCreditFee;

  const regularDiscount = Math.max(waiver || 0, scholarship || 0);
  const regularDiscountAmount = (totalCreditFee * regularDiscount) / 100;

  const totalSpecialWaivers =
    (siblingSpouseWaiver || 0) + (ethnicTribalWaiver || 0) + (disabilityWaiver || 0);
  const specialWaiverAmount = (totalCreditFee * totalSpecialWaivers) / 100;

  const totalDiscountAmount = regularDiscountAmount + specialWaiverAmount;

  const lateRegistrationFee = lateRegistration ? 500 : 0;
  const minimumPayable = trimesterFee + lateRegistrationFee;

  const creditFeeAfterDiscount = Math.max(0, totalCreditFee - totalDiscountAmount);
  const finalAmount = Math.max(minimumPayable, creditFeeAfterDiscount + trimesterFee + lateRegistrationFee);

  let firstInstallment, secondInstallment, thirdInstallment;
  let firstInstallmentDesc, secondInstallmentDesc, thirdInstallmentDesc;
  let installmentMethod = "";

  const isOnlyTrimesterFee = finalAmount === minimumPayable;

  if (isOnlyTrimesterFee) {
    firstInstallment = finalAmount;
    secondInstallment = 0;
    thirdInstallment = 0;
    installmentMethod = "100% discount: Only trimester fee payable";
    firstInstallmentDesc = "Full trimester fee";
    secondInstallmentDesc = "No payment required";
    thirdInstallmentDesc = "No payment required";
  } else {
    if (totalDiscountAmount === 0) {
      firstInstallment = Math.max(0, finalAmount * 0.4);
      secondInstallment = Math.max(0, finalAmount * 0.3);
      thirdInstallment = Math.max(0, finalAmount * 0.3);
      installmentMethod = "Standard 40-30-30 split (no discount applied)";
      firstInstallmentDesc = "40% of total";
      secondInstallmentDesc = "30% of total";
      thirdInstallmentDesc = "30% of total";
    } else if (waiverInFirstInstallment) {
      firstInstallment = Math.max(0, finalAmount * 0.4);
      secondInstallment = Math.max(0, finalAmount * 0.3);
      thirdInstallment = Math.max(0, finalAmount * 0.3);
      installmentMethod = "40-30-30 split of discounted total (discount applied to all installments)";
      firstInstallmentDesc = "40% of discounted total";
      secondInstallmentDesc = "30% of discounted total";
      thirdInstallmentDesc = "30% of discounted total";
    } else {
      const fullFeeBeforeDiscount = totalCreditFee + trimesterFee + lateRegistrationFee;
      firstInstallment = Math.max(0, fullFeeBeforeDiscount * 0.4);
      const remainingAfterDiscount = Math.max(0, finalAmount - firstInstallment);
      secondInstallment = Math.max(0, remainingAfterDiscount / 2);
      thirdInstallment = Math.max(0, remainingAfterDiscount / 2);
      installmentMethod =
        "40% of full fee for 1st installment, remaining discounted amount split equally";
      firstInstallmentDesc = "40% of full fee (before discount)";
      secondInstallmentDesc = "50% of remaining after discount";
      thirdInstallmentDesc = "50% of remaining after discount";
    }
  }

  function formatCurrency(amount) {
    const formattedNumber = new Intl.NumberFormat("en-BD", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `${formattedNumber}৳`;
  }

  const resultDiv = document.getElementById("tuitionResult");
  if (!resultDiv) return;

  resultDiv.innerHTML = `
<div class="card">
  <div class="card-header">
    <h3 class="card-title flex items-center gap-2">
      <i class="fas fa-book-open text-purple-500"></i>
      Taken Credits
    </h3>
  </div>
  <div class="card-content">
    <div class="space-y-6">
      <div>
        <div class="flex justify-between items-center">
          <span>New Credits:</span>
          <span>${newCredit}</span>
        </div>
        <div class="flex justify-between items-center">
          <span>Retake Credits:</span>
          <span>${retakeCredit}</span>
        </div>
        <div class="separator"></div>
        <div class="flex justify-between items-center">
          <span>Total Credits:</span>
          <span class="badge badge-outline">${newCredit + retakeCredit}</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="card">
  <div class="card-header">
    <h3 class="card-title flex items-center gap-2">
      <i class="fas fa-calculator text-blue-500"></i>
      Fee Calculation
    </h3>
  </div>
  <div class="card-content">
    <div class="space-y-6">
      <div>
        <table class="custom-table">
          <tbody>
            <tr>
              <td>Tuition Fee</td>
              <td>${newCredit + retakeCredit} credits × ${formatCurrency(perCreditFee)}</td>
              <td class="text-right">${formatCurrency(totalCreditFee)}</td>
            </tr>
            <tr>
              <td>Trimester Fee</td>
              <td>Fixed fee (not affected by discounts)</td>
              <td class="text-right">${formatCurrency(trimesterFee)}</td>
            </tr>
            ${Math.max(waiver || 0, scholarship || 0) > 0 ? `
            <tr>
              <td>${(waiver || 0) >= (scholarship || 0) ? "Waiver" : "Scholarship"}</td>
              <td>
                ${Math.max(waiver || 0, scholarship || 0)}% of Tuition fee
                ${(waiver || 0) > 0 && (scholarship || 0) > 0
                  ? '<span class="text-xs text-muted-foreground ml-2">(Higher discount applied)</span>'
                  : ""}
              </td>
              <td class="text-right text-amber-500">-${formatCurrency(regularDiscountAmount)}</td>
            </tr>` : ""}

            ${(siblingSpouseWaiver || 0) > 0 ? `
            <tr>
              <td>Sibling/Spouse Waiver</td>
              <td>${siblingSpouseWaiver}% of Tuition fee (Special waiver)</td>
              <td class="text-right text-amber-500">-${formatCurrency((totalCreditFee * siblingSpouseWaiver) / 100)}</td>
            </tr>` : ""}

            ${(ethnicTribalWaiver || 0) > 0 ? `
            <tr>
              <td>Ethnic Groups/Tribal Waiver</td>
              <td>${ethnicTribalWaiver}% of Tuition fee (Special waiver)</td>
              <td class="text-right text-amber-500">-${formatCurrency((totalCreditFee * ethnicTribalWaiver) / 100)}</td>
            </tr>` : ""}

            ${(disabilityWaiver || 0) > 0 ? `
            <tr>
              <td>Disability Waiver</td>
              <td>${disabilityWaiver}% of Tuition fee (Special waiver)</td>
              <td class="text-right text-amber-500">-${formatCurrency((totalCreditFee * disabilityWaiver) / 100)}</td>
            </tr>` : ""}

            ${lateRegistration ? `
            <tr>
              <td>Late Registration Fee</td>
              <td>Additional charge</td>
              <td class="text-right">${formatCurrency(lateRegistrationFee)}</td>
            </tr>` : ""}

            <tr class="border-t-2">
              <td class="font-bold text-lg">Total</td>
              <td>${isOnlyTrimesterFee ? '<span class="text-xs text-blue-600">(Minimum: Trimester fee only)</span>' : ''}</td>
              <td class="text-right font-bold text-lg">${formatCurrency(finalAmount)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2">
  <div class="card">
    <div class="card-header bg-muted/30 py-3">
      <h3 class="card-title flex items-center gap-2 text-base">
        <i class="fas fa-coins text-amber-500"></i>
        Total Payable Fee
      </h3>
    </div>
    <div class="card-content pt-4">
      <div class="flex flex-col items-center justify-center">
        <div class="grad-txt">${formatCurrency(finalAmount)}</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3 class="card-title flex items-center gap-2">
        <i class="fas fa-money-bill-wave text-green-500"></i>
        Installment Calculation
      </h3>
      <div class="card-description">${installmentMethod}</div>
    </div>
    <div class="card-content">
      <div class="space-y-6">
        <div>
          <div class="overflow-hidden border rounded-lg">
            ${isOnlyTrimesterFee ? `
            <p class="text-xs note-g">
              Since you only need to pay the trimester fee, you can pay the full amount in the 1st installment. No additional installments required.
            </p>` : ""}
            <table class="custom-table">
              <thead class="bg-muted">
                <tr>
                  <th>Installment</th>
                  <th>Calculation</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr ${isOnlyTrimesterFee ? 'class="bg-blue-50"' : ''}>
                  <td>1st Installment</td>
                  <td>${firstInstallmentDesc}</td>
                  <td class="text-right font-semibold">${formatCurrency(firstInstallment)}</td>
                </tr>
                <tr ${secondInstallment === 0 ? 'class="text-muted-foreground"' : ''}>
                  <td>2nd Installment</td>
                  <td>${secondInstallmentDesc}</td>
                  <td class="text-right ${secondInstallment === 0 ? 'text-muted-foreground' : ''}">${formatCurrency(secondInstallment)}</td>
                </tr>
                <tr ${thirdInstallment === 0 ? 'class="text-muted-foreground"' : ''}>
                  <td>3rd Installment</td>
                  <td>${thirdInstallmentDesc}</td>
                  <td class="text-right ${thirdInstallment === 0 ? 'text-muted-foreground' : ''}">${formatCurrency(thirdInstallment)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<p class="note-r">
  Installment due dates are announced in UIU official notices. You can also find the last date for each installment in the academic calendar. Always check the latest notice for confirmation.
  ${isOnlyTrimesterFee ? 'Students paying only trimester fee can complete payment in the first installment.' : ''}
</p>
  `;
  resultDiv.style.display = "block";

  try {
    document.getElementById("backToFeeCalculatorBtn")?.addEventListener("click", hideFeeResults);
    document.getElementById("backToFeeCalculatorBtn2")?.addEventListener("click", hideFeeResults);
    document.getElementById("resetFeeBtn2")?.addEventListener("click", resetTuitionFee);
  } catch (e) {}
}

function hideFeeResults() {
  const el = document.getElementById("tuitionResult");
  if (el) el.style.display = "none";
}

// =====================
// Resets
// =====================
function resetCGPA() {
  const completedCreditEl = document.getElementById("completedCredit");
  const currentCGPAEl = document.getElementById("currentCGPA");

  if (completedCreditEl) completedCreditEl.value = "";
  if (currentCGPAEl) currentCGPAEl.value = "";

  courses = [];
  retakeCourses = [];
  updateCoursesTable();
  updateRetakeCoursesTable();

  const res = document.getElementById("cgpaResult");
  if (res) res.style.display = "none";

  hideError("completedCreditError");
  hideError("currentCGPAError");
}

function resetTuitionFee() {
  const ids = [
    ["newCredit", ""],
    ["retakeCredit", ""],
    ["perCreditFee", "6500"],
    ["trimesterFee", "6500"],
    ["waiver", "0"],
    ["scholarship", "0"],
    ["siblingSpouseWaiver", "0"],
    ["ethnicTribalWaiver", "0"],
    ["disabilityWaiver", "0"],
  ];
  ids.forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });

  const late = document.getElementById("lateRegistration");
  if (late) late.checked = false;

  const waiveFirst = document.getElementById("waiverInFirstInstallment");
  if (waiveFirst) waiveFirst.checked = false;

  const res = document.getElementById("tuitionResult");
  if (res) res.style.display = "none";

  hideError("perCreditFeeError");
  hideError("trimesterFeeError");
  hideError("newCreditError");
  hideError("retakeCreditError");
  hideError("creditTotalError");
}

// =====================
// Tabs
// =====================
function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName("tabs-content");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    tabcontent[i].classList.remove("active");
  }
  const tablinks = document.getElementsByClassName("tabs-trigger");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }
  const target = document.getElementById(tabName);
  if (target) {
    target.style.display = "block";
    target.classList.add("active");
  }
  evt.currentTarget.classList.add("active");
}

// =====================
// Live Validation for Installments
// =====================
function validateInstallmentCredits() {
  const newCreditInput = document.getElementById("newCredit");
  const retakeCreditInput = document.getElementById("retakeCredit");
  if (!newCreditInput || !retakeCreditInput) return;

  const newCreditError = getOrCreateErrorEl("newCreditError", "newCredit");
  const retakeCreditError = getOrCreateErrorEl("retakeCreditError", "retakeCredit");
  const creditTotalError = getOrCreateErrorEl("creditTotalError", "retakeCredit");

  newCreditError.style.display = "none";
  retakeCreditError.style.display = "none";
  creditTotalError.style.display = "none";

  const newVal = parseFloat(newCreditInput.value);
  const retVal = parseFloat(retakeCreditInput.value);

  if (!isNaN(newVal) && newVal < 0) {
    newCreditInput.value = 0;
    newCreditError.textContent = "New credit cannot be negative";
    newCreditError.style.display = "block";
  }
  if (!isNaN(retVal) && retVal < 0) {
    retakeCreditInput.value = 0;
    retakeCreditError.textContent = "Retake credit cannot be negative";
    retakeCreditError.style.display = "block";
  }

  const safeNew = isNaN(newVal) ? 0 : newVal;
  const safeRet = isNaN(retVal) ? 0 : retVal;
  if (safeNew === 0 && safeRet === 0) {
    creditTotalError.textContent = "Both credits cannot be 0";
    creditTotalError.style.display = "block";
  }
}

// =====================
// DOM Ready
// =====================
document.addEventListener("DOMContentLoaded", function () {
  populateGradeDropdowns();

  // Button bindings
  document.getElementById("addCourseBtn")?.addEventListener("click", addCourse);
  document.getElementById("addRetakeCourseBtn")?.addEventListener("click", addRetakeCourse);
  document.getElementById("calculateCGPABtn")?.addEventListener("click", calculateCGPA);
  document.getElementById("resetCGPABtn")?.addEventListener("click", resetCGPA);
  document.getElementById("calculateFeeBtn")?.addEventListener("click", calculateTuitionFee);
  document.getElementById("resetFeeBtn")?.addEventListener("click", resetTuitionFee);

  // Tabs toggle (new vs retake courses)
  document.getElementById("new-courses-tab")?.addEventListener("click", function (evt) {
    openTab(evt, "new-courses");
  });
  document.getElementById("retake-courses-tab")?.addEventListener("click", function (evt) {
    openTab(evt, "retake-courses");
  });

  // Current CGPA live validation (0.00 - 4.00)
  const cgpaInput = document.getElementById("currentCGPA");
  if (cgpaInput) {
    cgpaInput.addEventListener("input", () => {
      const value = cgpaInput.value;
      const cgpaError = document.getElementById("currentCGPAError") || getOrCreateErrorEl("currentCGPAError", "currentCGPA");
      if (value === "") {
        cgpaError.style.display = "block";
        cgpaError.textContent = "Please enter your current CGPA";
        return;
      }
      const num = parseFloat(value);
      if (num > 4) {
        cgpaInput.value = 4;
        cgpaError.style.display = "block";
        cgpaError.textContent = "CGPA cannot be more than 4.00";
      } else if (num < 0) {
        cgpaInput.value = 0;
        cgpaError.style.display = "block";
        cgpaError.textContent = "CGPA cannot be less than 0.00";
      } else {
        cgpaError.style.display = "none";
      }
    });
  }

  // Completed Credit live validation (>= 0)
  const completedCreditInput = document.getElementById("completedCredit");
  if (completedCreditInput) {
    completedCreditInput.addEventListener("input", () => {
      clampToNonNegativeInput(
        completedCreditInput,
        "completedCreditError",
        "Your completed credits"
      );
    });
  }

  // Installment live validation (new/retake credits)
  document.getElementById("newCredit")?.addEventListener("input", validateInstallmentCredits);
  document.getElementById("retakeCredit")?.addEventListener("input", validateInstallmentCredits);
});