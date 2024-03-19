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
  return fetch(
    "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json",
  { mode: "no-cors" }
  ).then(function (response) {
    return response.json();
  });
}

// Function to populate tee box select box
function populateTeeBoxSelect() {
  let teeBoxSelectHtml = '';
  teeBoxes.forEach(function (teeBox, index) {
    teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}, ${teeBox.totalYards} yards</option>`;
  });
  document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;
}

// Call functions to populate select boxes
populateCourseSelect();
populateTeeBoxSelect();
