function updateClockAndGreeting() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);

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

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    todoList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('completed');
        }

        const span = document.createElement('span');
        span.textContent = task.text;

        span.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'x';
        deleteBtn.classList.add('delete-btn');

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();

    if (taskText !== '') {
        tasks.push({ text: taskText, completed: false });
        todoInput.value = '';
        saveTasks();
        renderTasks();
    }
});

renderTasks();

const notesInput = document.getElementById('notes-input');

notesInput.value = localStorage.getItem('quickNotes') || '';

notesInput.addEventListener('input', () => {
    localStorage.setItem('quickNotes', notesInput.value);
});


const tempElement = document.querySelector('.temp');
const cityElement = document.querySelector('.city');

async function fetchWeather(lat, lon) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await response.json();

        const temp = Math.round(data.current_weather.temperature);
        tempElement.textContent = `${temp}°C`;
        cityElement.textContent = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
    } catch (error) {
        tempElement.textContent = "--°C";
        cityElement.textContent = "Unable to fetch weather";
        console.error("Weather error:", error);
    }
}

function getLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeather(lat, lon);
            },
            () => {

                fetchWeather(53.76, -2.70);
            }
        );
    } else {
        fetchWeather(53.76, -2.70);
    }
}

getLocationAndWeather();

const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');

async function fetchQuote() {
    quoteText.textContent = "Loading quote..."
    quoteAuthor.textContent = "";
    try {
        const response = await fetch('https://dummyjson.com/quotes/random');
        const data = await response.json();
        quoteText.textContent = `"${data.quote}"`;
        quoteAuthor.textContent = `-${data.author}`;
    } catch (error) {
        quoteText.textContent = '"Believe you can and you\'re halfway there."';
        quoteAuthor.textContent = '- Theodore Roosevelt';
    }
}

newQuoteBtn.addEventListener('click', fetchQuote);

fetchQuote();