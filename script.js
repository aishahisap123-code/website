function updateClockAndGreeting() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementByIs('clock').textContent = `${hours}:${minutes}:${seconds}`;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', option);

    const currentHour = now.getHours();
    const greetingElement = document.getElementById('greeting');

    if (currentHour < 12) {
        greetingElement.textContent = "Good Morning! ";
    } else if (currentHour < 18) {
        greetingElement.textContent = "Good Afternoon! ";
    } else {
        greetingElement.textContent = "Good Evening! ";
    }
}

updateClockAndGreeting();
setInterval(updateClockAndGreeting, 1000);

let workDuration = 25 * 60;
let timeLeft = workDuration;
let timerInterval = null;
let isRunning = false;

const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            alert('Pomodoro session complete! Take a break.');
            timeLeft = workDuration;
            updateTimerDisplay();
        }
    }, 1000);
}

function pauseTime() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = workDuration;
    updateTimerDisplay();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTime);
resetBtn.addEventListener('click', resetTimer);

updateTimerDisplay();