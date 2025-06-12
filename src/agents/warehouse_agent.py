import os
import asyncio
from dotenv import load_dotenv
from twilio.rest import Client

from spade.agent import Agent
from spade.behaviour import CyclicBehaviour
from spade.message import Message

from src.web.app import push_event

# Load environment variables
load_dotenv()

TWILIO_SID   = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_FROM  = os.getenv("TWILIO_FROM_PHONE")
ALERT_TO     = os.getenv("ALERT_TO_PHONE")
THRESHOLD    = int(os.getenv("LOW_STOCK_THRESHOLD", "20"))

# Initialize Twilio client
twilio_client = Client(TWILIO_SID, TWILIO_TOKEN)

class WarehouseAgent(Agent):
    class ProcessRequests(CyclicBehaviour):
        async def run(self):
            msg = await self.receive(timeout=10)
            if not msg:
                return

            body = msg.body
            # Handle stock requests
            if body.startswith("REQUEST_STOCK"):
                print(f"[WAREHOUSE] Received → {body}")
                push_event("WAREHOUSE_RECEIVED", {"from": str(msg.sender), "body": body})

                # Forward to supplier
                forward = Message(to="supplier@localhost")
                forward.body = body.replace("REQUEST_STOCK", "FORWARD_ORDER")
                await self.send(forward)
                print(f"[WAREHOUSE] Forwarded → {forward.body}")
                push_event("WAREHOUSE_FORWARDED", {"from": self.agent.name, "body": forward.body})

            # Handle supply notifications
            if body.startswith("STOCK_SUPPLIED"):
                print(f"[WAREHOUSE] Stock supplied → {body}")
                push_event("WAREHOUSE_SUPPLIED", {"body": body})

                # Parse supplied quantity
                parts = body.split("qty=")
                if len(parts) == 2:
                    try:
                        qty = int(parts[1])
                        if qty < THRESHOLD:
                            alert = f"⚠️ Low stock alert: only {qty} units supplied!"
                            print(alert)
                            # Send SMS alert
                            twilio_client.messages.create(
                                body=alert,
                                from_=TWILIO_FROM,
                                to=ALERT_TO
                            )
                            push_event("ALERT_SENT", {"alert": alert})
                    except ValueError:
                        print(f"[WAREHOUSE] Could not parse quantity from: {body}")

    async def setup(self):
        print(f"[WAREHOUSE] {self.name} up.")
        self.add_behaviour(self.ProcessRequests())
