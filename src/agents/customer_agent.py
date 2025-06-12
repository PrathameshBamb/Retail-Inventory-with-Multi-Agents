import random
from spade.agent import Agent
from spade.behaviour import OneShotBehaviour
from spade.message import Message

from src.web.app import push_event

class CustomerAgent(Agent):
    class PlaceOrder(OneShotBehaviour):
        async def run(self):
            item_id = random.choice([101, 102, 103])
            qty = random.randint(1, 5)
            msg = Message(to="store@localhost")
            msg.body = f"ORDER:{item_id};{qty}"
            await self.send(msg)
            print(f"[CUSTOMER] Placed → {msg.body}")
            push_event("CUSTOMER_ORDER", {"body": msg.body})

    async def setup(self):
        print(f"[CUSTOMER] {self.name} joining.")
        self.add_behaviour(self.PlaceOrder())
