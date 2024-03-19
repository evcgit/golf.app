// JavaScript for Golf Scorecard App

// Sample data for demonstration
const courses = [
  { id: 11819, name: "Thanksgiving Point Golf Course" },
  { id: 18300, name: "Fox Hollow Golf Course" },
  { id: 19002, name: "Spanish Oaks Golf Course" }
];

const teeBoxes = [
  { teeType: "Black", totalYards: 7000 },
  { teeType: "Blue", totalYards: 6500 },
  { teeType: "White", totalYards: 6000 }
];

// Function to populate course select box
function populateCourseSelect() {
  let courseOptionsHtml = '';
  courses.forEach((course) => {
    courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
  });
  document.getElementById('course-select').innerHTML = courseOptionsHtml;
}

function getAvailableGolfCourses() {
  return fetch("https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json")
    .then(function (response) {
      return response.json();
    });
}


function populateTeeBoxSelect() {
  let teeBoxSelectHtml = '';
  teeBoxes.forEach(function (teeBox, index) {
    teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}, ${teeBox.totalYards} yards</option>`;
  });
  document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;
}


populateCourseSelect();
populateTeeBoxSelect();



// Function to update table header with selected course and tee
function updateTableHeader() {
  const selectedCourseIndex = document.getElementById('course-select').value;
  const selectedTeeIndex = document.getElementById('tee-box-select').value;

  const selectedCourseName = courses.find(course => course.id === parseInt(selectedCourseIndex)).name;
  const selectedTeeType = teeBoxes[selectedTeeIndex].teeType.toUpperCase();

  const tableHeaders = document.querySelectorAll('th');
  tableHeaders.forEach(header => {
    header.textContent = `${selectedCourseName} - ${selectedTeeType}`;
  });
}

document.getElementById('course-select').addEventListener('change', updateTableHeader);
document.getElementById('tee-box-select').addEventListener('change', updateTableHeader);


updateTableHeader();



// Function to populate the yardage for each color to each labeled hole
function populateYardage() {
  const selectedCourseIndex = document.getElementById('course-select').value;
  const selectedTeeIndex = document.getElementById('tee-box-select').value;

  // Retrieve the yardage data for the selected course and tee
  const selectedCourse = courses.find(course => course.id === parseInt(selectedCourseIndex));
  const selectedTee = teeBoxes[selectedTeeIndex];

  // Assuming you have hole yardage data available for each tee color
  const holeYardages = selectedCourse.holeYardages[selectedTee.teeType.toLowerCase()];

  // Iterate over the table cells for yardage and populate with the respective yardage data
  const yardageCells = document.querySelectorAll('td[data-label="Yardage"]');
  yardageCells.forEach((cell, index) => {
    cell.textContent = holeYardages[index]; // Assuming holeYardages is an array of yardages
  });
}

// Call populateYardage initially and whenever course or tee selection changes
document.getElementById('course-select').addEventListener('change', populateYardage);
document.getElementById('tee-box-select').addEventListener('change', populateYardage);

// Call populateYardage initially to set the yardage for the default course and tee
populateYardage();
