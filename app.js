const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const userSelect = document.getElementById('userSelect');
const logList = document.getElementById('logList');

let activeRide = null;
let rides = JSON.parse(localStorage.getItem('rides') || '[]');

function renderLogs() {
  logList.innerHTML = '';
  rides.forEach((ride) => {
    const li = document.createElement('li');
    let text = `${ride.user} — gestart om ${new Date(ride.start).toLocaleString()}`;
    if (ride.stop) {
      text += `, gestopt om ${new Date(ride.stop).toLocaleString()}`;
    }
    li.textContent = text;
    logList.appendChild(li);
  });
}

startBtn.onclick = () => {
  const user = userSelect.value;
  if (!user || activeRide) return;
  activeRide = { user, start: new Date().toISOString(), stop: null };
  rides.push(activeRide);
  localStorage.setItem('rides', JSON.stringify(rides));
  renderLogs();
};

stopBtn.onclick = () => {
  if (!activeRide) return;
  activeRide.stop = new Date().toISOString();
  localStorage.setItem('rides', JSON.stringify(rides));
  activeRide = null;
  renderLogs();
};

renderLogs();