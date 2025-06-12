# import asyncio
# from spade.agent import Agent
# from spade.behaviour import CyclicBehaviour
# from spade.message import Message

# from src.web.app import push_event

# class SupplierAgent(Agent):
#     class SupplyStock(CyclicBehaviour):
#         async def run(self):
#             msg = await self.receive(timeout=10)
#             if msg and msg.body.startswith("FORWARD_ORDER"):
#                 print(f"[SUPPLIER] Received → {msg.body}")
#                 push_event("SUPPLIER_RECEIVED", {"body": msg.body})

#                 await asyncio.sleep(5)
#                 reply = Message(to="warehouse@localhost")
#                 reply.body = msg.body.replace("FORWARD_ORDER", "STOCK_SUPPLIED")
#                 await self.send(reply)
#                 print(f"[SUPPLIER] Sent → {reply.body}")
#                 push_event("SUPPLIER_SUPPLIED", {"body": reply.body})

#     async def setup(self):
#         print(f"[SUPPLIER] {self.name} ready.")
#         self.add_behaviour(self.SupplyStock())


import asyncio
from spade.agent import Agent
from spade.behaviour import CyclicBehaviour
from spade.message import Message

from src.web.app import push_event

class SupplierAgent(Agent):
    class SupplyStock(CyclicBehaviour):
        async def run(self):
            msg = await self.receive(timeout=10)
            if msg and msg.body.startswith("FORWARD_ORDER"):
                print(f"[SUPPLIER] Received → {msg.body}")
                push_event("SUPPLIER_RECEIVED", {"body": msg.body})

                # simulate a short delay
                await asyncio.sleep(2)

                # force a low supply qty for testing alerts
                low_qty = 10  # below your threshold of 20
                reply = Message(to="warehouse@localhost")
                reply.body = f"STOCK_SUPPLIED: item_id=123; qty={low_qty}"
                await self.send(reply)
                print(f"[SUPPLIER] Sent → {reply.body}")
                push_event("SUPPLIER_SUPPLIED", {"body": reply.body})

    async def setup(self):
        print(f"[SUPPLIER] {self.name} ready.")
        self.add_behaviour(self.SupplyStock())
