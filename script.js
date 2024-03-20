let selectedCourseId = null;
let selectedTeeType = null;

function getAvailableGolfCourses() {
  return fetch("https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json")
      .then(response => {
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

  document.getElementById('course-select').addEventListener('change', function() {
    selectedCourseId = this.value;
    populateTeeBoxSelect(selectedCourseId);
  });
}

// Function to populate tee box select dropdown based on the selected course
function populateTeeBoxSelect(courseId) {
  fetch(`https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${courseId}.json`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      let teeOptionsHtml = '';
      data.holes[0].teeBoxes.forEach(tee => {
        teeOptionsHtml += `<option value="${tee.teeType}">${tee.teeType}</option>`;
      });
      document.getElementById('tee-box-select').innerHTML = teeOptionsHtml;
    })
    .catch(error => console.error('Error fetching tee box options:', error));
}

document.getElementById('tee-box-select').addEventListener('change', function() {
  selectedTeeType = this.value;
  if (selectedCourseId && selectedTeeType) {
    populateScorecard(selectedCourseId, selectedTeeType);
  }
});

// Function to populate the scorecard table with data for the selected course and tee type
function populateScorecard(courseId, teeType) {
  fetch(`https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${courseId}.json`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      data.holes.forEach((hole, index) => {
        const holeNumber = index + 1;
        const teeBoxData = hole.teeBoxes.find(tee => tee.teeType === teeType);
        document.getElementById(`yardage-hole-${holeNumber}`).textContent = teeBoxData ? teeBoxData.yards : '-';
        if (teeBoxData) {
          document.getElementById(`par-hole-${holeNumber}`).textContent = teeBoxData.par || '-';
          document.getElementById(`handicap-hole-${holeNumber}`).textContent = teeBoxData.hcp || '-';
        } else {
          document.getElementById(`par-hole-${holeNumber}`).textContent = '-';
          document.getElementById(`handicap-hole-${holeNumber}`).textContent = '-';
        }
        
      });
    })
    .catch(error => console.error('Error fetching course data:', error));
}

populateCourseSelect();




// Function to add a new player row to both front and back tables
function addPlayerRow() {
  const playerName = document.getElementById('player-name-input').value.trim();
  if (playerName === '') {
      alert('Please enter a player name.');
      return;
  }

  // Front nine table
  const frontTableBody = document.getElementById('scorecard-front').querySelector('table tbody');
  const newRowFront = document.createElement('tr');
  newRowFront.innerHTML = `<td class="border border-gray-400 text-center">${playerName}</td>`;
  for (let i = 1; i <= 9; i++) {
      newRowFront.innerHTML += `<td><input class="border border-gray-400 text-center" type="number" min="0" id="front-${i}-player-${playerName}" /></td>`;
  }
  frontTableBody.appendChild(newRowFront);

  // Back nine table
  const backTableBody = document.getElementById('scorecard-back').querySelector('table tbody');
  const newRowBack = document.createElement('tr');
  newRowBack.innerHTML = `<td class="border border-gray-400 text-center">${playerName}</td>`;
  for (let i = 1; i <= 9; i++) {
      newRowBack.innerHTML += `<td><input class="border border-gray-400 text-center" type="number" min="0" id="back-${i}-player-${playerName}" /></td>`;
  }
  backTableBody.appendChild(newRowBack);
  document.getElementById('player-name-input').value = '';
}

document.getElementById('add-player-button').addEventListener('click', addPlayerRow);


