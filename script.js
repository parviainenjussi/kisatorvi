const hornSound = new Audio('horn.wav'); // Path to the horn sound file, adjust as necessary
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const startingSecondsInput = document.getElementById('startingSeconds');
const intervalInput = document.getElementById('interval'); // Interval in seconds
const totalTimeInput = document.getElementById('totalTime'); // Total time in seconds
const elapsedTimeDiv = document.getElementById('elapsedTime');
const playHornButton = document.getElementById('playHornButton');

let nextHornTimeOutId, elapsedTimeId, gameStartTime, totalTimerId;

function updateElapsedTime() {
    const elapsedTimeInSeconds = (Date.now() - gameStartTime) / 1000;
    const totalMinutes = Math.floor(elapsedTimeInSeconds / 60);
    const totalSeconds = Math.floor(elapsedTimeInSeconds % 60).toString().padStart(2, '0');
    elapsedTimeDiv.textContent = `Elapsed Time: ${totalMinutes}:${totalSeconds}`;
}

function playHorn(intervalSeconds) {
    // Calculate time since game start
    const elapsedTimeInSeconds = (Date.now() - gameStartTime) / 1000;
    // Calculate time to next horn sound
    const timeToNextHorn = intervalSeconds - elapsedTimeInSeconds % intervalSeconds;

    nextHornTimeOutId = setTimeout(() => {
        hornSound.play();
        playHorn(intervalSeconds); // Schedule the next horn
    }, timeToNextHorn * 1000);
}

startButton.addEventListener('click', function() {
    const startingSeconds = parseInt(startingSecondsInput.value);
    const intervalSeconds = parseInt(intervalInput.value); // Interval already in seconds
    const totalGameTimeSeconds = parseInt(totalTimeInput.value);

    gameStartTime = Date.now() - startingSeconds * 1000; // Adjust start time based on input

    startButton.disabled = true; // Prevent re-triggering
    stopButton.disabled = false; // Enable stopping

    // Initialize elapsed time and start updating it every second
    updateElapsedTime();
    elapsedTimeId = setInterval(updateElapsedTime, 1000);

    // Start horn playing at the next correct interval
    playHorn(intervalSeconds);

    // Stop the program after the total game time
    totalTimerId = setTimeout(() => {
        resetTimer();
    }, totalGameTimeSeconds * 1000 - startingSeconds * 1000);
});

stopButton.addEventListener('click', resetTimer);

function resetTimer() {
    clearTimeout(nextHornTimeOutId); // Stop scheduled horn
    clearInterval(elapsedTimeId); // Stop the elapsed time update
    clearTimeout(totalTimerId); // Ensure total time stop is cleared

    startButton.disabled = false; // Allow the timer to be started again
    stopButton.disabled = true; // Disable stop button until next start

    elapsedTimeDiv.textContent = "Elapsed Time: 00:00"; // Reset elapsed time display
}

playHornButton.addEventListener('click', function() {
    if (hornSound.paused) {
        hornSound.play();
    } else {
        hornSound.currentTime = 0; // Rewind to the start if already playing
    }
});
