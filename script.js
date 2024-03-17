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
    const totalGameTimeSeconds = parseInt(totalTimeInput.value);
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
    const currentTime = Date.now();
    const elapsedTimeInSeconds = (currentTime - gameStartTime) / 1000;
    const clockDirection = clockDirectionSelect.value;
    let nextHornInSeconds;

    if (clockDirection === 'up') {
        nextHornInSeconds = intervalSeconds - (elapsedTimeInSeconds % intervalSeconds);
    }
    if (clockDirection === 'down') {
        // Assuming the game started with a total time and counts down.
        const totalGameTimeSeconds = parseInt(totalTimeInput.value);
        const elapsedTimeInSeconds = (Date.now() - gameStartTime) / 1000;
        // This is the time since the game started (including the initial offset).
        const remainingTime = totalGameTimeSeconds - elapsedTimeInSeconds;
        // Calculate when the next horn should sound based on the remaining time and the interval.
        nextHornInSeconds = remainingTime % intervalSeconds;
        if (nextHornInSeconds === 0) nextHornInSeconds = intervalSeconds; // This ensures the horn plays at the interval boundary.
    }


    const nextHornElapsedTime = clockDirection === 'up' ? elapsedTimeInSeconds + nextHornInSeconds : parseInt(totalTimeInput.value) - nextHornInSeconds - elapsedTimeInSeconds % intervalSeconds;
    const formattedNextHornTime = formatTime(Math.floor(nextHornElapsedTime));

    nextHornTimeDiv.textContent = `Next Horn Sound at: ${formattedNextHornTime}`;

    nextHornTimeoutId = setTimeout(() => {
        playSelectedHornSound();
        scheduleNextHorn(intervalSeconds);
    }, nextHornInSeconds * 1000);
}

startButton.addEventListener('click', function() {
    const startingSeconds = parseInt(startingSecondsInput.value);
    const intervalSeconds = parseInt(intervalInput.value);
    const totalGameTimeSeconds = parseInt(totalTimeInput.value);

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
