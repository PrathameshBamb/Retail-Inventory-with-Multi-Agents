# Retail Inventory with Multi Agents

Retail Inventory with Multi Agents is a Python-based, multi-agent AI system for proactive inventory management in retail chains. Four SPADE agents (Store, Warehouse, Supplier, Customer) collaborate via XMPP to forecast demand, place replenishment orders, and handle customer purchases. A real-time web dashboard, dynamic demand forecasting, SMS alerts, and an interactive network visualizer complete the solution.

## Overview

Traditional inventory workflows rely on manual forecasting, stock checks, and ad-hoc pricing adjustments. This project automates:

1. **Demand Forecasting**  
   – Uses historical sales (`data/sales.csv`) and a simple regression model to predict next-month demand.  
2. **Multi-Agent Collaboration**  
   – **StoreAgent** monitors stock & customer orders.  
   – **WarehouseAgent** processes stock requests and notifies suppliers.  
   – **SupplierAgent** fulfills orders with configurable delays.  
   – **CustomerAgent** generates synthetic purchase events.  
3. **Real-Time Dashboard**  
   – Flask + Flask-SocketIO backend at `src/web/app.py`.  
   – React + TypeScript + Ant Design frontend (Vite) at `ui/`.  
   – Live charts (Recharts), event feed, and alerts panel.  
4. **Interaction Visualizer**  
   – Logs ACL messages to SQLite, exposes `/api/interactions`.  
   – D3 force-directed network graph at `/visualizer`.  
5. **Alerts & Notifications**  
   – Low-stock SMS alerts via Twilio when replenishment `qty < LOW_STOCK_THRESHOLD`.  
6. **Dockerization**  
   – `docker-compose.yml` to spin up an ejabberd broker and the unified app container.

---

## Features

- **Multi-Agent Architecture**: Asynchronous SPADE agents communicating over XMPP.  
- **Dynamic Reorder Threshold**: Weekly forecasting auto-adjusts your reorder quantity.  
- **Web Dashboard**:  
  - KPI cards for stock levels, forecasts, reorder quantities  
  - Live time-series chart with zoom, pan, brush  
  - Real-time event feed with filters  
  - Alerts panel with acknowledge/historic view  
- **Network Graph**: Visualize agent interactions in real time.  
- **SMS Alerts**: Twilio integration for critical low-stock notifications.  
- **Extensible Helpers**: Add new forecasting algorithms in `src/utils/helpers.py`.

---

## Technology Stack

- **Backend**  
  - Python 3.11  
  - [SPADE](https://github.com/javipalanca/spade) (multi-agent framework)  
  - [Flask](https://flask.palletsprojects.com/) + [Flask-SocketIO](https://flask-socketio.readthedocs.io/)  
  - [python-dotenv](https://github.com/theskumar/python-dotenv) for config  
  - [Twilio](https://www.twilio.com/) SMS API  
  - [SQLite](https://sqlite.org/) for interaction logs  
- **Frontend**  
  - React + TypeScript (Vite)  
  - [Ant Design](https://ant.design/) UI library  
  - [Recharts](https://recharts.org/) for time-series charts  
  - [D3.js](https://d3js.org/) for network graph  
  - [Socket.IO Client](https://socket.io/) for real-time updates  
- **Dev & Deployment**  
  - Docker & Docker-Compose (ejabberd XMPP broker + app)  
  - Git, npm, venv

---

## Getting Started

### Prerequisites

- Python 3.11+ & pip  
- Node.js 16+ & npm  
- Docker & docker-compose

---

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/retail-inventory-multiagents.git

