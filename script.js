const startButton = document.getElementById('startButton');
const playHornButton = document.getElementById('playHornButton');
const stopButton = document.getElementById('stopButton');
const startingSecondsInput = document.getElementById('startingSeconds');
const intervalInput = document.getElementById('interval');
const totalTimeInput = document.getElementById('totalTime');
const elapsedTimeDiv = document.getElementById('elapsedTime');
const hornSoundSelect = document.getElementById('hornSoundSelect');

let hornSound = new Audio(); // Initialize the Audio object outside to allow dynamic source changes
let nextHornTimeoutId, elapsedTimeId, gameStartTime;

// Function to update elapsed time display
function updateElapsedTime() {
    const elapsedTimeInSeconds = (Date.now() - gameStartTime) / 1000;
    const totalMinutes = Math.floor(elapsedTimeInSeconds / 60);
    const totalSeconds = Math.floor(elapsedTimeInSeconds % 60).toString().padStart(2, '0');
    elapsedTimeDiv.textContent = `Elapsed Time: ${totalMinutes}:${totalSeconds}`;
}

// Function to play the selected horn sound
function playSelectedHornSound() {
    hornSound.src = hornSoundSelect.value; // Dynamically set the horn sound source based on selection
    hornSound.play();
}

// Function to schedule the next horn sound play
function scheduleNextHorn(intervalSeconds) {
    const currentTime = Date.now();
    const elapsedTimeInSeconds = (currentTime - gameStartTime) / 1000;
    const nextHornInSeconds = intervalSeconds - (elapsedTimeInSeconds % intervalSeconds);
    nextHornTimeoutId = setTimeout(() => {
        playSelectedHornSound();
        scheduleNextHorn(intervalSeconds); // Recursively schedule the next horn play
    }, nextHornInSeconds * 1000);
}

startButton.addEventListener('click', function() {
    const startingSeconds = parseInt(startingSecondsInput.value);
    const intervalSeconds = parseInt(intervalInput.value);
    const totalGameTimeSeconds = parseInt(totalTimeInput.value);

    gameStartTime = Date.now() - startingSeconds * 1000; // Adjust for starting seconds
    startButton.disabled = true;
    stopButton.disabled = false;

    updateElapsedTime(); // Initialize the elapsed time display
    elapsedTimeId = setInterval(updateElapsedTime, 1000); // Update elapsed time every second

    scheduleNextHorn(intervalSeconds); // Begin scheduling the horn sounds

    // Stop the timer and horn after the total game time expires
    setTimeout(() => {
        resetTimer();
    }, totalGameTimeSeconds * 1000);
});

stopButton.addEventListener('click', resetTimer);

// Reset timer function
function resetTimer() {
    clearTimeout(nextHornTimeoutId); // Cancel any scheduled horn sound
    clearInterval(elapsedTimeId); // Stop updating the elapsed time
    startButton.disabled = false;
    stopButton.disabled = true;
    elapsedTimeDiv.textContent = "Elapsed Time: 00:00"; // Reset the elapsed time display
}

playHornButton.addEventListener('click', playSelectedHornSound);
