const startButton = document.getElementById('startButton');
const playHornButton = document.getElementById('playHornButton');
const stopButton = document.getElementById('stopButton');
const startingSecondsInput = document.getElementById('startingSeconds');
const intervalInput = document.getElementById('interval');
const totalTimeInput = document.getElementById('totalTime');
const elapsedTimeDiv = document.getElementById('elapsedTime');
const nextHornTimeDiv = document.getElementById('nextHornTime');
const hornSoundSelect = document.getElementById('hornSoundSelect');
const clockDirectionSelect = document.getElementById('clockDirection');

let hornSound = new Audio(); // Initialize the Audio object outside to allow dynamic source changes
let nextHornTimeoutId, elapsedTimeId, gameStartTime;

// Helper function to format time from seconds to MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}

function updateElapsedTime() {
    const currentTime = Date.now();
    const elapsedTimeInSeconds = (currentTime - gameStartTime) / 1000;
    const totalGameTimeSeconds = parseFloat(totalTimeInput.value) * 60;
    const clockDirection = clockDirectionSelect.value;

    let displayTimeSeconds;

    if (clockDirection === 'up') {
        displayTimeSeconds = elapsedTimeInSeconds;
    } else { // 'down'
        displayTimeSeconds = totalGameTimeSeconds - elapsedTimeInSeconds;
    }

    const formattedDisplayTime = formatTime(Math.abs(displayTimeSeconds));
    const formattedTotalTime = formatTime(totalGameTimeSeconds);
    elapsedTimeDiv.textContent = `${formattedDisplayTime}/${formattedTotalTime}`;
}


function playSelectedHornSound() {
    hornSound.src = hornSoundSelect.value; // Dynamically set the horn sound source based on selection
    hornSound.play();
}

function scheduleNextHorn(intervalSeconds) {
    clearTimeout(nextHornTimeoutId); // Clear existing timeout to prevent multiple instances

    const currentTime = Date.now();
    const elapsedTimeInSeconds = (currentTime - gameStartTime) / 1000; // Total elapsed time since the start
    let nextHornInSeconds;

    if (clockDirectionSelect.value === 'up') {
        // For 'up', schedule the next horn based on the interval minus the remainder of elapsed time
        nextHornInSeconds = intervalSeconds - (elapsedTimeInSeconds % intervalSeconds);
    } else {
        // For 'down', schedule based on the remainder of time until the next interval
        const remainingTime = parseFloat(totalTimeInput.value) * 60 - elapsedTimeInSeconds;
        nextHornInSeconds = remainingTime % intervalSeconds;
        if (nextHornInSeconds === 0 || remainingTime < intervalSeconds) {
            nextHornInSeconds = remainingTime > intervalSeconds ? intervalSeconds : remainingTime;
        }
    }

    // Schedule next horn sound
    nextHornTimeoutId = setTimeout(() => {
        playSelectedHornSound();
        scheduleNextHorn(intervalSeconds); // Reschedule after playing sound
    }, nextHornInSeconds * 1000); // Convert seconds to milliseconds

    // Update the display for next horn time
    let nextHornDisplayTime = clockDirectionSelect.value === 'up' ? elapsedTimeInSeconds + nextHornInSeconds : parseFloat(totalTimeInput.value) * 60 - elapsedTimeInSeconds - nextHornInSeconds;
    nextHornTimeDiv.textContent = `Next Horn Sound at: ${formatTime(Math.round(nextHornDisplayTime))}`;
}


startButton.addEventListener('click', function() {
    const startingSeconds = parseFloat(startingSecondsInput.value);
    const intervalSeconds = parseFloat(intervalInput.value);
    const totalGameTimeSeconds = parseFloat(totalTimeInput.value) * 60;

    gameStartTime = Date.now() - startingSeconds * 1000;
    startButton.disabled = true;
    stopButton.disabled = false;

    // Disable inputs while the timer is running
    startingSecondsInput.disabled = true;
    intervalInput.disabled = true;
    totalTimeInput.disabled = true;
    clockDirectionSelect.disabled = true;

    updateElapsedTime();
    elapsedTimeId = setInterval(updateElapsedTime, 1000);

    scheduleNextHorn(intervalSeconds);

    setTimeout(() => {
        resetTimer();
    }, totalGameTimeSeconds * 1000 - startingSeconds * 1000);
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
    clockDirectionSelect.disabled = false;

    elapsedTimeDiv.textContent = "00:00/--:--"; // Reset to default display
    nextHornTimeDiv.textContent = "Next Horn Sound at: --:--";
}

stopButton.addEventListener('click', resetTimer);

playHornButton.addEventListener('click', playSelectedHornSound);
