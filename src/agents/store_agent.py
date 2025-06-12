# import asyncio
# from spade.agent import Agent
# from spade.behaviour import CyclicBehaviour, PeriodicBehaviour
# from spade.message import Message

# from src.web.app import push_event
# from src.utils.helpers import load_sales_data, forecast_next_month

# class StoreAgent(Agent):
#     class MonitorStock(CyclicBehaviour):
#         async def run(self):
#             msg = Message(to="warehouse@localhost")
#             msg.body = "REQUEST_STOCK: item_id=123; qty=50"
#             await self.send(msg)
#             print(f"[STORE] Sent → {msg.body}")
#             push_event("REQUEST_STOCK", {"from": self.agent.name, "body": msg.body})
#             await asyncio.sleep(60)

#     class HandleOrder(CyclicBehaviour):
#         async def run(self):
#             msg = await self.receive(timeout=10)
#             if msg and msg.body.startswith("ORDER"):
#                 print(f"[STORE] Received order → {msg.body}")
#                 push_event("STORE_RECEIVED_ORDER", {"from": str(msg.sender), "body": msg.body})

#                 reply = Message(to=str(msg.sender))
#                 reply.body = f"CONFIRM_ORDER: {msg.body}"
#                 await self.send(reply)
#                 print(f"[STORE] Confirmed → {reply.body}")
#                 push_event("STORE_CONFIRMED_ORDER", {"to": str(msg.sender), "body": reply.body})

#                 stock_msg = Message(to="warehouse@localhost")
#                 stock_msg.body = f"REQUEST_STOCK for {msg.body}"
#                 await self.send(stock_msg)
#                 print(f"[STORE] Sent → {stock_msg.body}")
#                 push_event("REQUEST_STOCK", {"from": self.agent.name, "body": stock_msg.body})

#     class ForecastBehaviour(PeriodicBehaviour):
#         async def run(self):
#             # Load sales history and forecast
#             df = load_sales_data("data/sales.csv")
#             forecast_df = forecast_next_month(df)

#             # For simplicity, take last predicted value
#             next_pred = float(forecast_df["predicted"].iloc[-1])
#             print(f"[STORE] Forecast next-month sales ≈ {next_pred:.2f}")
#             push_event("FORECAST", {"next_month_predicted": next_pred})

#             # TODO: adjust your reorder threshold here based on next_pred

#     async def setup(self):
#         print(f"[STORE] {self.name} starting…")
#         self.add_behaviour(self.MonitorStock())
#         self.add_behaviour(self.HandleOrder())

#         # Run forecasting every 7 days (604800 seconds)
#         forecast_beh = self.ForecastBehaviour(period=604800)
#         self.add_behaviour(forecast_beh)


import asyncio
from spade.agent import Agent
from spade.behaviour import CyclicBehaviour, PeriodicBehaviour
from spade.message import Message

from src.web.app import push_event
from src.utils.helpers import load_sales_data, forecast_next_month

class StoreAgent(Agent):
    class MonitorStock(CyclicBehaviour):
        async def run(self):
            # Send a stock request using the current dynamic reorder quantity
            msg = Message(to="warehouse@localhost")
            qty = self.agent.reorder_qty
            msg.body = f"REQUEST_STOCK: item_id=123; qty={qty}"
            await self.send(msg)
            print(f"[STORE] Sent → {msg.body}")
            push_event("REQUEST_STOCK", {"from": self.agent.name, "body": msg.body})
            await asyncio.sleep(60)

    class HandleOrder(CyclicBehaviour):
        async def run(self):
            msg = await self.receive(timeout=10)
            if msg and msg.body.startswith("ORDER"):
                print(f"[STORE] Received order → {msg.body}")
                push_event("STORE_RECEIVED_ORDER", {"from": str(msg.sender), "body": msg.body})

                # Confirm back to customer
                reply = Message(to=str(msg.sender))
                reply.body = f"CONFIRM_ORDER: {msg.body}"
                await self.send(reply)
                print(f"[STORE] Confirmed → {reply.body}")
                push_event("STORE_CONFIRMED_ORDER", {"to": str(msg.sender), "body": reply.body})

                # Also trigger warehouse replenishment based on the order
                stock_msg = Message(to="warehouse@localhost")
                stock_msg.body = f"REQUEST_STOCK for {msg.body}"
                await self.send(stock_msg)
                print(f"[STORE] Sent → {stock_msg.body}")
                push_event("REQUEST_STOCK", {"from": self.agent.name, "body": stock_msg.body})

    class ForecastBehaviour(PeriodicBehaviour):
        async def run(self):
            # Load historical sales and forecast next month
            df = load_sales_data("data/sales.csv")
            forecast_df = forecast_next_month(df)
            next_pred = float(forecast_df["predicted"].iloc[-1])
            print(f"[STORE] Forecast next-month sales ≈ {next_pred:.2f}")
            push_event("FORECAST", {"next_month_predicted": next_pred})

            # Adjust reorder quantity to 120% of the forecast
            new_qty = int(next_pred * 1.2)
            self.agent.reorder_qty = new_qty
            print(f"[STORE] Updated reorder_qty → {new_qty}")
            push_event("REORDER_ADJUSTED", {"new_reorder_qty": new_qty})

    async def setup(self):
        print(f"[STORE] {self.name} starting…")
        # initialize with a default reorder quantity
        self.reorder_qty = 50

        # behaviour: periodically check & request stock
        self.add_behaviour(self.MonitorStock())
        # behaviour: handle incoming customer orders
        self.add_behaviour(self.HandleOrder())
        # behaviour: forecast weekly and adjust reorder_qty
        forecast_beh = self.ForecastBehaviour(period=604800)  # 7 days in seconds
        self.add_behaviour(forecast_beh)
