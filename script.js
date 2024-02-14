const startButton = document.getElementById('startButton');
const playHornButton = document.getElementById('playHornButton');
const stopButton = document.getElementById('stopButton');
const startingSecondsInput = document.getElementById('startingSeconds');
const intervalInput = document.getElementById('interval');
const totalTimeInput = document.getElementById('totalTime');
const elapsedTimeDiv = document.getElementById('elapsedTime');
const nextHornTimeDiv = document.getElementById('nextHornTime');
const hornSoundSelect = document.getElementById('hornSoundSelect');

let hornSound = new Audio(); // Initialize the Audio object outside to allow dynamic source changes
let nextHornTimeoutId, elapsedTimeId, gameStartTime;

// Helper function to format time from seconds to MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}

function updateElapsedTime() {
    const elapsedTimeInSeconds = (Date.now() - gameStartTime) / 1000;
    const formattedElapsedTime = formatTime(elapsedTimeInSeconds);
    const totalGameTimeSeconds = parseInt(totalTimeInput.value);
    const formattedTotalTime = formatTime(totalGameTimeSeconds);
    
    // Now displays only the formatted times without "Elapsed Time:" text
    elapsedTimeDiv.textContent = `${formattedElapsedTime}/${formattedTotalTime}`;
}

function playSelectedHornSound() {
    hornSound.src = hornSoundSelect.value; // Dynamically set the horn sound source based on selection
    hornSound.play();
}

function scheduleNextHorn(intervalSeconds) {
    const currentTime = Date.now();
    const elapsedTimeInSeconds = (currentTime - gameStartTime) / 1000;
    const nextHornInSeconds = intervalSeconds - (elapsedTimeInSeconds % intervalSeconds);
    const nextHornElapsedTime = elapsedTimeInSeconds + nextHornInSeconds;
    const formattedNextHornTime = formatTime(nextHornElapsedTime);

    nextHornTimeDiv.textContent = `Next Horn Sound at: ${formattedNextHornTime}`;

    nextHornTimeoutId = setTimeout(() => {
        playSelectedHornSound();
        scheduleNextHorn(intervalSeconds);
    }, nextHornInSeconds * 1000);
}

startButton.addEventListener('click', function() {
    const startingSeconds = parseInt(startingSecondsInput.value);
    const intervalSeconds = parseInt(intervalInput.value);
    // Total time the timer should run from the start point
    const totalGameTimeSeconds = parseInt(totalTimeInput.value) - startingSeconds;

    gameStartTime = Date.now();
    startButton.disabled = true;
    stopButton.disabled = false;

    // Disable inputs while the timer is running
    startingSecondsInput.disabled = true;
    intervalInput.disabled = true;
    totalTimeInput.disabled = true;

    updateElapsedTime();
    elapsedTimeId = setInterval(updateElapsedTime, 1000);

    scheduleNextHorn(intervalSeconds);

    // Schedule the timer to stop after the adjusted total time
    setTimeout(() => {
        resetTimer();
    }, totalGameTimeSeconds * 1000); // Adjusted to consider the starting time
});

function resetTimer() {
    clearTimeout(nextHornTimeoutId);
    clearInterval(elapsedTimeId);
    startButton.disabled = false;
    stopButton.disabled = true;

    // Re-enable inputs when the timer is stopped
    startingSecondsInput.disabled = false;
    intervalInput.disabled = false;
    totalTimeInput.disabled = false;

    elapsedTimeDiv.textContent = "00:00/--:--"; // Reset to default display
    nextHornTimeDiv.textContent = "Next Horn Sound at: --:--";
}

stopButton.addEventListener('click', resetTimer);

playHornButton.addEventListener('click', playSelectedHornSound);
