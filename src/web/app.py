import os
import json
import sqlite3
from datetime import datetime
from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO

# — Flask + Socket.IO setup —
app = Flask(__name__)
app.config['SECRET_KEY'] = 'replace-with-secure-key'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# In-memory event log
EVENT_LOG = []

# — SQLite setup —
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                        '..','..','data','interactions.db'))
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT,
  event_type TEXT,
  source TEXT,
  target TEXT,
  payload TEXT
)
""")
conn.commit()

# Map event_type → inferred target agent
TARGET_MAP = {
  "REQUEST_STOCK":           "warehouse",
  "STORE_RECEIVED_ORDER":    "store",
  "STORE_CONFIRMED_ORDER":   None,  # payload has "to"
  "WAREHOUSE_RECEIVED":      "warehouse",
  "WAREHOUSE_FORWARDED":     "supplier",
  "SUPPLIER_RECEIVED":       "supplier",
  "SUPPLIER_SUPPLIED":       "warehouse",
  "WAREHOUSE_SUPPLIED":      "warehouse",
  "ALERT_SENT":              None,
  "FORECAST":                None,
  "REORDER_ADJUSTED":        None,
  "CUSTOMER_ORDER":          "store",
}

def push_event(event_type, payload):
    # 1) In‐memory broadcast
    data = {"type": event_type, "payload": payload}
    EVENT_LOG.append(data)
    socketio.emit('agent_event', data)

    # 2) Persist to SQLite
    src = payload.get('from') or ''
    # explicit "to" wins
    tgt = payload.get('to')
    if not tgt:
        # strip “@…” from inferred targets
        inf = TARGET_MAP.get(event_type)
        tgt = inf
    # normalize agent names
    if isinstance(tgt, str) and '@' in tgt:
        tgt = tgt.split('@')[0]

    ts = datetime.utcnow().isoformat()
    cursor.execute(
      "INSERT INTO interactions(timestamp,event_type,source,target,payload) VALUES(?,?,?,?,?)",
      (ts, event_type, src, tgt or '', json.dumps(payload))
    )
    conn.commit()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/interactions")
def api_interactions():
    rows = cursor.execute(
      "SELECT source,target,event_type FROM interactions WHERE target!=''"
    ).fetchall()
    interactions = [
      {"source":r[0].split('@')[0], "target":r[1], "type":r[2]}
      for r in rows
    ]
    return jsonify(interactions)

@app.route("/visualizer")
def visualizer():
    return render_template("visualizer.html")

@socketio.on('connect')
def on_connect():
    socketio.emit('history', EVENT_LOG)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
