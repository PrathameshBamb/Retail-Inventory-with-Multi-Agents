console.log("⚙️ main.js loaded");  // confirm script is running

// Initialize socket.io client
const socket = io();
console.log("⚙️ Attempting socket.io connection…");

// Log on connection
socket.on('connect', () => {
  console.log("✅ Socket connected, id:", socket.id);
});

// Log any connection error
socket.on('connect_error', (err) => {
  console.error("❌ Socket connection error:", err);
});

// On initial history load
socket.on('history', (events) => {
  console.log("📜 Received history:", events);
  const log = document.getElementById('log');
  events.forEach(evt => {
    const li = document.createElement('li');
    li.textContent = `[${evt.type}] ${JSON.stringify(evt.payload)}`;
    log.appendChild(li);
  });
});

// On new real-time events
socket.on('agent_event', (evt) => {
  console.log("📨 Received agent_event:", evt);
  const log = document.getElementById('log');
  const li = document.createElement('li');
  li.textContent = `[${evt.type}] ${JSON.stringify(evt.payload)}`;
  log.appendChild(li);
});
