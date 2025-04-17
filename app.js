const userSelect = document.getElementById('userSelect');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const logList = document.getElementById('logList');

let activeRide = null;
let rides = JSON.parse(localStorage.getItem('rides') || '[]');

function renderLogs() {
  logList.innerHTML = '';
  rides.forEach((ride) => {
    const li = document.createElement('li');
    let text = `${ride.user} — gestart om ${new Date(ride.start).toLocaleString()}`;
    if (ride.startLat && ride.startLng) {
      text += ` — 📍 Start: ${ride.startLat.toFixed(4)}, ${ride.startLng.toFixed(4)}`;
    }
    if (ride.stop) {
      text += ` — gestopt om ${new Date(ride.stop).toLocaleString()}`;
      if (ride.stopLat && ride.stopLng) {
        text += ` — 📍 Stop: ${ride.stopLat.toFixed(4)}, ${ride.stopLng.toFixed(4)}`;
      }
    }
    li.textContent = text;
    logList.appendChild(li);
  });
}

async function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Locatie niet ondersteund.");
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject("Locatie niet beschikbaar.")
      );
    }
  });
}

const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSdhnddumqSs_YvP7o3Cb1_QyqKlzEe7vitZz7DnXvZwd4FwAw/formResponse";

function sendToGoogleSheet(data) {
  const formData = new FormData();
  formData.append("entry.1525461618", data.user); // Naam
  formData.append("entry.1045846172", data.start); // Starttijd
  formData.append("entry.1851793238", `${data.startLat}, ${data.startLng}`); // Startlocatie
  formData.append("entry.1490586052", data.stop); // Stoptijd
  formData.append("entry.667201192", `${data.stopLat}, ${data.stopLng}`); // Stoplocatie
  fetch(formURL, { method: "POST", mode: "no-cors", body: formData });
}

startBtn.onclick = async () => {
  const user = userSelect.value;
  if (!user || activeRide) return;
  try {
    const loc = await getLocation();
    const ride = {
      user,
      start: new Date().toISOString(),
      startLat: loc.lat,
      startLng: loc.lng,
      stop: null,
      stopLat: null,
      stopLng: null,
    };
    activeRide = ride;
    rides.push(ride);
    localStorage.setItem('rides', JSON.stringify(rides));
    renderLogs();
  } catch (err) {
    alert(err);
  }
};

stopBtn.onclick = async () => {
  if (!activeRide) return;
  try {
    const loc = await getLocation();
    activeRide.stop = new Date().toISOString();
    activeRide.stopLat = loc.lat;
    activeRide.stopLng = loc.lng;
    localStorage.setItem('rides', JSON.stringify(rides));
    sendToGoogleSheet(activeRide);
    activeRide = null;
    renderLogs();
  } catch (err) {
    alert(err);
  }
};

renderLogs();