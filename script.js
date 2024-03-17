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

let nextHornTime = 0; // Time (in seconds) when the next horn should sound
function checkAndPlayHorn() {
    const elapsedTimeInSeconds = (Date.now() - gameStartTime) / 1000;

    if (elapsedTimeInSeconds >= nextHornTime) {
        playSelectedHornSound();
        nextHornTime += parseFloat(intervalInput.value); // Schedule next horn
    }

    // Also, update your display regularly
    updateElapsedTime(); // Assumes this updates elapsed time on your page
}

startButton.addEventListener('click', function() {
    gameStartTime = Date.now();
    nextHornTime = parseFloat(intervalInput.value); // Set initial horn time based on the interval
    startButton.disabled = true;
    stopButton.disabled = false;

    // Disable inputs while the timer is running
    startingSecondsInput.disabled = true;
    intervalInput.disabled = true;
    totalTimeInput.disabled = true;
    clockDirectionSelect.disabled = true;

    // Add here program time length
    const programTIme = parseFloat(totalTimeInput.value) * 60 - parseFloat(startingSecondsInput.value)

    elapsedTimeId = setInterval(checkAndPlayHorn, 1000); // Check every second

    // Ensure that the timer stops at the total game time
    setTimeout(() => {
        resetTimer();
    }, pprogramTIme * 1000); // Convert minutes to milliseconds
});

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

function updateInitialTime() {
    const startingSeconds = parseFloat(startingSecondsInput.value);
    const totalGameTimeSeconds = parseFloat(totalTimeInput.value) * 60;
    const intervalSeconds = parseFloat(intervalInput.value);
    const clockDirection = clockDirectionSelect.value;

    let displayTimeSeconds;

    if (clockDirection === 'up') {
        displayTimeSeconds = startingSeconds;
    } else { // 'down'
        displayTimeSeconds = totalGameTimeSeconds - startingSeconds;
    }

    const formattedDisplayTime = formatTime(Math.abs(displayTimeSeconds));
    const formattedTotalTime = formatTime(totalGameTimeSeconds);
    elapsedTimeDiv.textContent = `${formattedDisplayTime}/${formattedTotalTime}`;

    // Update the display for next horn time
    const currentTime = Date.now();
    const elapsedTimeInSeconds = startingSeconds; // Total elapsed time since the start
    let nextHornInSeconds;

    if (clockDirectionSelect.value === 'up') {
        // For 'up', schedule the next horn based on the interval minus the remainder of elapsed time
        nextHornInSeconds = intervalSeconds - (elapsedTimeInSeconds % intervalSeconds);
    } else {
        // For 'down', schedule based on the remainder of time until the next interval
        const remainingTime = totalGameTimeSeconds - elapsedTimeInSeconds;
        nextHornInSeconds = remainingTime % intervalSeconds;
        if (nextHornInSeconds === 0 || remainingTime < intervalSeconds) {
            nextHornInSeconds = remainingTime > intervalSeconds ? intervalSeconds : remainingTime;
        }
    }


    // Update the display for next horn time
    let nextHornDisplayTime = clockDirectionSelect.value === 'up' ? elapsedTimeInSeconds + nextHornInSeconds : totalGameTimeSeconds - elapsedTimeInSeconds - nextHornInSeconds;
    nextHornTimeDiv.textContent = `Next Horn Sound at: ${formatTime(Math.round(nextHornDisplayTime))}`;
}


function playSelectedHornSound() {
    hornSound.src = hornSoundSelect.value; // Dynamically set the horn sound source based on selection
    hornSound.play();
}

function scheduleNextHorn(expectedNextHornTime) {
    clearTimeout(nextHornTimeoutId); // Clear any existing timeout

    const currentTime = Date.now();
    const elapsedTime = (currentTime - gameStartTime) / 1000; // in seconds
    let timeUntilNextHorn = expectedNextHornTime - elapsedTime; // Adjust based on actual elapsed time

    if (timeUntilNextHorn < 0) {
        timeUntilNextHorn = 0; // Correct any negative drift
    }

    nextHornTimeoutId = setTimeout(() => {
        playSelectedHornSound();
        // Schedule the next horn based on the original interval, not the adjusted one
        const newExpectedNextHornTime = expectedNextHornTime + parseFloat(intervalInput.value);
        scheduleNextHorn(newExpectedNextHornTime);
    }, timeUntilNextHorn * 1000); // Convert seconds to milliseconds for setTimeout

    // Update display for next horn time
    const nextHornDisplayTime = elapsedTime + timeUntilNextHorn; // Actual next horn time
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

    updateInitialTime();
    nextHornTimeDiv.textContent = "Next Horn Sound at: --:--";
}

stopButton.addEventListener('click', resetTimer);

playHornButton.addEventListener('click', playSelectedHornSound);

document.addEventListener('DOMContentLoaded', function() {
    // This code runs when the page is fully loaded
    updateInitialTime(); // Replace 'yourFunction' with the name of your function
    // Add more event listeners if you have more inputs
    // Set up change event listeners for each input box
    document.getElementById('startingSeconds').addEventListener('change', updateInitialTime);
    document.getElementById('interval').addEventListener('change', updateInitialTime);
    document.getElementById('totalTime').addEventListener('change', updateInitialTime);
    document.getElementById('clockDirection').addEventListener('change', updateInitialTime);
});


