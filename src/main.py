import threading
import asyncio

from src.web.app import app, socketio
from src.agents.store_agent     import StoreAgent
from src.agents.warehouse_agent import WarehouseAgent
from src.agents.supplier_agent  import SupplierAgent
from src.agents.customer_agent  import CustomerAgent

def start_dashboard():
    """Starts the Flask-SocketIO dashboard."""
    socketio.run(app, host="0.0.0.0", port=5000)

async def main():
    # Credentials against ejabberd’s 'localhost' vhost
    creds = {
        "store@localhost":     "store_pwd",
        "warehouse@localhost": "wh_pwd",
        "supplier@localhost":  "sup_pwd",
        "customer@localhost":  "cust_pwd",
    }

    # Instantiate agents (connecting to localhost:5222 inside the container)
    store     = StoreAgent("store@localhost",     creds["store@localhost"])
    warehouse = WarehouseAgent("warehouse@localhost", creds["warehouse@localhost"])
    supplier  = SupplierAgent("supplier@localhost",  creds["supplier@localhost"])
    customer  = CustomerAgent("customer@localhost",  creds["customer@localhost"])

    # Start all agents
    await store.start()
    await warehouse.start()
    await supplier.start()
    await customer.start()

    print("🤖 All agents running. Press Ctrl+C to stop.")
    try:
        # Keep the loop alive
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping agents…")
        await store.stop()
        await warehouse.stop()
        await supplier.stop()
        await customer.stop()
        print("✅ Agents stopped.")

if __name__ == "__main__":
    # 1) Launch the dashboard in a background thread
    dashboard_thread = threading.Thread(target=start_dashboard, daemon=True)
    dashboard_thread.start()
    print("📊 Dashboard running at http://localhost:5000")

    # 2) Run the SPADE agent event loop
    asyncio.run(main())
