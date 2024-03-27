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


// Function to calculate and display the total score for each player
function calculateTotalScore(playerName) {
  let totalScore = 0;
  for (let i = 1; i <= 18; i++) {
    const score = parseInt(document.getElementById(`hole-${i}-${playerName}`).value) || 0;
    totalScore += score;
  }
  document.getElementById(`total-${playerName}`).textContent = totalScore;
}




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
      newRowFront.innerHTML += `<td><input class="border border-gray-400 text-center w-full player-score-input" type="number" min="0" id="hole-${i}-${playerName}" /></td>`;
  }
  frontTableBody.appendChild(newRowFront);
  
  

  // Back nine table
  const backTableBody = document.getElementById('scorecard-back').querySelector('table tbody');
  const newRowBack = document.createElement('tr');
  newRowBack.innerHTML = `<td class="border border-gray-400 text-center">${playerName}</td>`;
  for (let i = 10; i <= 18; i++) {
      newRowBack.innerHTML += `<td><input class="border border-gray-400 text-center w-full player-score-input" type="number" min="0" id="hole-${i}-${playerName}" /></td>`;
  }
  backTableBody.appendChild(newRowBack);
  document.getElementById('player-name-input').value = '';


  const totalsTableBody = document.getElementById('scoreTotals').querySelector('tbody');
  const playerRow = document.createElement('tr');
  playerRow.innerHTML = `<td class="border border-gray-400 text-center">${playerName}</td><td class="border border-gray-400 text-center" id="total-${playerName}">0</td>`;
  totalsTableBody.appendChild(playerRow);
  
  document.getElementById('player-name-input').value = '';

  // Select all input fields with the class 'player-score-input'
  const scoreInputs = document.querySelectorAll('.player-score-input');
  scoreInputs.forEach(input => {
    input.addEventListener('input', function(event) {
      const playerName = event.target.id.split('-')[2];
      calculateTotalScore(playerName);
    });
  });

  }
  
  document.getElementById('add-player-button').addEventListener('click', addPlayerRow);
