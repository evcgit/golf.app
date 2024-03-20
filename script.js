let selectedCourseId = null;

// Function to fetch available golf courses
function getAvailableGolfCourses() {
  return fetch("https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json")
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to fetch golf courses');
          }
          return response.json();
      });
}

// Function to populate course select dropdown
function populateCourseSelect() {
  getAvailableGolfCourses()
      .then(data => {
          let courseOptionsHtml = '';
          data.forEach(course => {
              courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
          });
          document.getElementById('course-select').innerHTML = courseOptionsHtml;
      })
      .catch(error => console.error('Error fetching golf courses:', error));

  // Event listener for course select dropdown
  document.getElementById('course-select').addEventListener('change', function() {
    selectedCourseId = this.value;
    // Fetch tee box options for the selected course
    fetch(`https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${selectedCourseId}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch tee box options');
        }
        return response.json();
      })
      .then(data => {
        let teeOptionsHtml = '';
        data.holes[0].teeBoxes.forEach(tee => {
          teeOptionsHtml += `<option>${tee.teeType}</option>`;
        });
        // Populate the tee box select dropdown with options
        document.getElementById('tee-box-select').innerHTML = teeOptionsHtml;
      })
      .catch(error => console.error('Error fetching tee box options:', error));
  });
}

populateCourseSelect();


