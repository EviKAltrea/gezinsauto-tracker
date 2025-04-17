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
    let html = `<strong>${ride.user}</strong> — gestart om ${new Date(ride.start).toLocaleString()}`;
    if (ride.startLocation) {
      html += `<br />📍 Startlocatie: <a href="https://maps.google.com/?q=${ride.startLocation.lat},${ride.startLocation.lng}" target="_blank">${ride.startLocation.lat.toFixed(4)}, ${ride.startLocation.lng.toFixed(4)}</a>`;
    }
    if (ride.stop) {
      html += `<br />Gestopt om ${new Date(ride.stop).toLocaleString()}`;
      if (ride.stopLocation) {
        html += `<br />📍 Stoplocatie: <a href="https://maps.google.com/?q=${ride.stopLocation.lat},${ride.stopLocation.lng}" target="_blank">${ride.stopLocation.lat.toFixed(4)}, ${ride.stopLocation.lng.toFixed(4)}</a>`;
      }
    }
    const div = document.createElement('div');
    div.innerHTML = html;
    li.appendChild(div);
    logList.appendChild(li);
  });
}

async function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Locatie niet ondersteund.');
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject('Locatie niet beschikbaar.');
        }
      );
    }
  });
}

startBtn.onclick = async () => {
  const user = userSelect.value;
  if (!user || activeRide) return;
  try {
    const location = await getLocation();
    activeRide = { user, start: new Date().toISOString(), stop: null, startLocation: location, stopLocation: null };
    rides.push(activeRide);
    localStorage.setItem('rides', JSON.stringify(rides));
    renderLogs();
  } catch (error) {
    alert(error);
  }
};

stopBtn.onclick = async () => {
  if (!activeRide) return;
  try {
    const location = await getLocation();
    activeRide.stop = new Date().toISOString();
    activeRide.stopLocation = location;
    localStorage.setItem('rides', JSON.stringify(rides));
    activeRide = null;
    renderLogs();
  } catch (error) {
    alert(error);
  }
};

renderLogs();