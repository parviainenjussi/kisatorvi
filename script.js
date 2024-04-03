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
let nextHornTimeoutId, elapsedTimeId, gameStartTimeMsec, clockDirectionValue;
let totalGameTimeSeconds, intervalSeconds, startingSeconds;
let nextHornTimeSeconds;

// Helper function to format time from seconds to MM:SS format
function formatTime(seconds) {
    if (clockDirectionValue === 'down') {
        seconds = totalGameTimeSeconds - seconds;
    }
    return formatElapsedTime(seconds);
}

function formatTotalTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}

function formatElapsedTime(seconds) {
    let minutes;
    let secs;
    if (clockDirectionValue === 'up'){
		minutes = Math.floor(seconds / 60);
        secs = Math.floor(seconds % 60);
    }else{
		minutes = Math.floor(seconds / 60);
        secs = Math.ceil(seconds % 60);
    }
	   if (secs >= 60) {
		minutes += 1; // Increase minute
		secs -= 60; // Decrease seconds by 60 to start from 0
    }

    // Formatting minutes and seconds to ensure two digits
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = secs.toString().padStart(2, '0');
	
    return `${formattedMinutes}:${formattedSeconds}`;
}


function updateElapsedTime(elapsedTimeInSeconds) {
    const formattedElapsedTime = formatTime(elapsedTimeInSeconds);
    const formattedTotalTime = formatTotalTime(totalGameTimeSeconds);
    // Now displays only the formatted times without "Elapsed Time:" text
    elapsedTimeDiv.textContent = `${formattedElapsedTime}/${formattedTotalTime}`;
}

function playSelectedHornSound() {
    hornSound.src = hornSoundSelect.value; // Dynamically set the horn sound source based on selection
    hornSound.play();
}

startButton.addEventListener('click', function() {
    startingSeconds = parseFloat(startingSecondsInput.value);
    intervalSeconds = parseFloat(intervalInput.value);
    totalGameTimeSeconds = parseFloat(totalTimeInput.value) * 60;
    clockDirectionValue = clockDirectionSelect.value;

    nextHornTimeSeconds = startingSeconds > 0 ? Math.ceil(startingSeconds / intervalSeconds) * intervalSeconds : intervalSeconds;

    gameStartTimeMsec = Date.now() - startingSeconds * 1000;

    stopButton.disabled = false;
    startButton.disabled = true;
    startingSecondsInput.disabled = true;
    intervalInput.disabled = true;
    totalTimeInput.disabled = true;
    clockDirectionSelect.disabled = true;

    // Start the repeating timer
    elapsedTimeId = setInterval(checkAndPlayHorn, 100);
});

function checkAndPlayHorn() {
    const elapsedTimeInSeconds = (Date.now() - gameStartTimeMsec) / 1000;
    
    // Update elapsed time display
    updateElapsedTime(elapsedTimeInSeconds); // Implement this function to update your UI with the elapsed time

    if (totalGameTimeSeconds == nextHornTimeSeconds) {
        nextHornTimeDiv.textContent = `Next Horn Sound at: --:--`;

    // Check if it's time to play the horn
    }else if (elapsedTimeInSeconds >= nextHornTimeSeconds) {
        playSelectedHornSound();
        nextHornTimeSeconds += intervalSeconds; // Schedule next horn time
        updateNextHornTimeDisplay(nextHornTimeSeconds); // Update your UI with the new next horn time
    }

    if (elapsedTimeInSeconds >= totalGameTimeSeconds){
        resetTimer();
    }
}

function updateNextHornTimeDisplay(nextHornTime){
    const formattedNextHornTime = formatTime(nextHornTime);
    nextHornTimeDiv.textContent = `Next Horn Sound at: ${formattedNextHornTime}`;
}

function resetTimer() {
    clearInterval(elapsedTimeId);
    startButton.disabled = false;
    stopButton.disabled = true;

    // Re-enable inputs when the timer is stopped
    startingSecondsInput.disabled = false;
    intervalInput.disabled = false;
    totalTimeInput.disabled = false;
    clockDirectionSelect.disabled = false;

    updateVisualizedTimes();
}

function updateVisualizedTimes() {
    startingSeconds = parseFloat(startingSecondsInput.value);
    intervalSeconds = parseFloat(intervalInput.value);
    totalGameTimeSeconds = parseFloat(totalTimeInput.value) * 60;
    clockDirectionValue = clockDirectionSelect.value;

    const elapsedTimeInSeconds =  startingSeconds;
    const formattedElapsedTime = formatTime(elapsedTimeInSeconds);
    const formattedTotalTime = formatTotalTime(totalGameTimeSeconds);
    
    // Now displays elapsed/total tme
    elapsedTimeDiv.textContent = `${formattedElapsedTime}/${formattedTotalTime}`;

    nextHornTimeSeconds = startingSeconds > 0 ? Math.ceil(startingSeconds / intervalSeconds) * intervalSeconds : intervalSeconds;
    const formattedNextHornTime = formatTime(nextHornTimeSeconds);

    nextHornTimeDiv.textContent = `Next Horn Sound at: ${formattedNextHornTime}`;
}

document.addEventListener('DOMContentLoaded', function() {
    // This code runs when the page is fully loaded
    updateVisualizedTimes(); // Replace 'yourFunction' with the name of your function
    // Add more event listeners if you have more inputs
    // Set up change event listeners for each input box
    document.getElementById('startingSeconds').addEventListener('change', updateVisualizedTimes);
    document.getElementById('interval').addEventListener('change', updateVisualizedTimes);
    document.getElementById('totalTime').addEventListener('change', updateVisualizedTimes);
    document.getElementById('clockDirection').addEventListener('change', updateVisualizedTimes);
});
    

stopButton.addEventListener('click', resetTimer);

playHornButton.addEventListener('click', playSelectedHornSound);
