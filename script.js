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