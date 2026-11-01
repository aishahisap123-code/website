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


const linkForm = document.getElementById('link-form');
const linkNameInput = document.getElementById('link-name');
const linkUrlInput = document.getElementById('link-url');
const linksGrid = document.getElementById('links-grid');

let links = JSON.parse(localStorage.getItem('quickLinks')) || [
    { name: 'Google', url: 'https://www.google.com'},
    { name: 'Github', url: 'https://github.com'},
    { name: 'Youtube', url: 'https://www.youtude.com'}
];

function saveLinks() {
    localStorage.setItem('quickLinks', JSON.stringify(links));
}

function renderLinks() {
    linksGrid.innerHTML = '';

    links.forEach((link, index) => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.className = 'link-chip';
        a.textContent = link.name;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'x';
        deleteBtn.className = 'link-delete';

        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            links.splice(index, 1);
            saveLinks();
            renderLinks();
        });

        a.appendChild(deleteBtn);
        linksGrid.appendChild(a);
        
    });
}

linkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = linkNameInput.value.trim();
    let url = linkUrlInput.value.trim();

    if (name && url) {

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        links.push({ name, url });
        linkNameInput.value = '';
        linkUrlInput.value = '';
        saveLinks();
        renderLinks();
    }
});

renderLinks();


const rainBtn = document.getElementById('rain-btn');
const wavesBtn = document.getElementById('waves-btn');
const stopAudioBtn = document.getElementById('stop-audio-btn');

let currentAudio = null;

function playSound(url) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = new Audio(url);
    currentAudio.loop = true;

    currentAudio.play().then(() => {
        console.log("Audio playing successfully!");
    }).catch(error => {
        console.error("Audio playback failed:", error);
        alert("Audio playback was blocked or failed to load.");

        });
    }

rainBtn.addEventListener('click', () => {
    playSound('https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg');
});

wavesBtn.addEventListener('click', () => {
    playSound('https://orangefreesounds.com/wp-content/uploads/2022/07/Ocean-waves-sound-effect.mp3');
});

stopAudioBtn.addEventListener('click', () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
});


const themeToggleBtn = document.getElementById('theme-toggle-btn');
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'cyberpunk');
        themeToggleBtn.textContent = isLight ? '☀️ Theme' : '🌙 Theme';
    });
}

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    if (themeToggleBtn) themeToggleBtn.textContent = '☀️ Theme';
} 


let focusStats = JSON.parse(localStorage.getItem('focusStats')) || { completed: 0, minutes: 0, streak: 0};

function updateStatusUI() {
    const pomoCount = document.getElementById('pomo-counts');
    const focusMins = document.getElementById('focus-mins');
    const streakCounter = document.getElementById('streak-counter');

    if (pomoCount) pomoCount.textContent = focusStats.completed;
    if (focusMins) focusMins.textContent = `${focusStats.minutes} mins`;
    if (streakCounter) streakCounter.textContent = `STREAK: ${focusStats.streak} DAYS`;

}

updateStatusUI;

function addFocusSession() {
    focusStats.completed += 1;
    focusStats.minutes += 25;

    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('lastFocusDate');
    if (lastDate !== today) {
        focusStats.streak += 1;
        localStorage.setItem('lastFocusDate', today);
    }

    localStorage.setItem('focusStats', JSON.stringify(focusStats));
    updateStatusUI();
}

const bgBtns = document.querySelectorAll('.bg-btn');
bgBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.body.classList.remove('bg-matrix', 'bg-void');
        const mode = btn.dataset.bg;
        if (mode !== 'default') {
            document.body.classList.add(`bg-${mode}`);
        }
        localStorage.setItem('bgMode', mode)
    });
});

const savedBg = localStorage.getItem('bgMode');
if (savedBg && savedBg !== 'default') {
    document.body.classList.add(`bg-${savedBg}`);
}

const eventForm = document.getElementById('event-form');
const eventInput = document.getElementById('event-form');
const eventDate = document.getElementById('event-date');
const eventList = document.getElementById('event-list');

let events = JSON.parse(localStorage.getItem('cyberEvents')) || [];

function renderEvents() {
    if (!eventList) return;
    eventList.innerHTML = '';
    events.forEach((ev, idx) => {
        
        if (!ev || !ev.text) return;

        const li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = `${ev.text} ${ev.date ? `(${ev.date})` : ''}`;

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.textContent = '✖';
        delBtn.addEventListener('click', () => removeEventListener(idx));

        li.appendChild(span);
        li.appendChild(delBtn);
        eventList.appendChild(li);
    });
}

if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
       const textVal = eventInput ? eventInput.value.trim() : '';
       const dateVal = eventDate ? eventDate.value : '';

       if (!textVal) return;

       events.push({ text: textVal, date: dateVal });
       localStorage.setItem('cyberEvents', JSON.stringify(events));

       if (eventInput) eventInput.value = '';
       if (eventDAte) eventDate.value = '';

       renderEvents();
       
    });
}

function removeEvents(index) {
    events.splice(index, 1);
    localStorage.setItem('cyberEvents', JSON.stringify(events));
    renderEvents();
}

renderEvents();

const habitChecks = document.querySelectorAll('.habit-check');
const savedHabits = JSON.parse(localStorage.getItem('habitStates')) || [];

habitChecks.forEach((check, index) => {
    if (savedHabits[index]) check.checked = true;
    check.addEventListener('change', () => {
        const states = Array.from(habitChecks).map(c => c.checked);
        localStorage.setItem('habitStates', JSON.stringify(states));
    });
});


const globalSearch = document.getElementById('global-search');
const searchBtn = document.getElementById('search-btn');

function executeSearch() {
    const query = globalSearch.value.trim();
    if (query) {
        if (query.startsWith('https://') || query.startsWith('https://')) {
            window.open(query, '_blank');
        } else {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');

        }
        globalSearch.value = '';
    }
}

if (searchBtn) searchBtn.addEventListener('click', executeSearch);
if (globalSearch) {
    globalSearch.addEventListener('keypress', (e) => {
        if (e.key == 'Enter') executeSearch();
    });
}

