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

function updateElapsedTime() {
    const elapsedTimeInSeconds = (Date.now() - gameStartTime) / 1000;
    const totalMinutes = Math.floor(elapsedTimeInSeconds / 60);
    const totalSeconds = Math.floor(elapsedTimeInSeconds % 60).toString().padStart(2, '0');
    elapsedTimeDiv.textContent = `Elapsed Time: ${totalMinutes}:${totalSeconds}`;
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
    const nextHornMinutes = Math.floor(nextHornElapsedTime / 60);
    const nextHornSecs = Math.floor(nextHornElapsedTime % 60).toString().padStart(2, '0');
    const formattedNextHornTime = `${nextHornMinutes}:${nextHornSecs}`;

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

    updateElapsedTime();
    elapsedTimeId = setInterval(updateElapsedTime, 1000);

    scheduleNextHorn(intervalSeconds);

    setTimeout(() => {
        resetTimer();
    }, totalGameTimeSeconds * 1000);
});

function resetTimer() {
    clearTimeout(nextHornTimeoutId);
    clearInterval(elapsedTimeId);
    startButton.disabled = false;
    stopButton.disabled = true;
    elapsedTimeDiv.textContent = "Elapsed Time: 00:00";
    nextHornTimeDiv.textContent = "Next Horn Sound at: --:--";
}

stopButton.addEventListener('click', resetTimer);

playHornButton.addEventListener('click', playSelectedHornSound);
