import pandas as pd
from sklearn.linear_model import LinearRegression

def load_sales_data(path: str) -> pd.DataFrame:
    return pd.read_csv(path)

def forecast_next_month(df: pd.DataFrame) -> pd.DataFrame:
    # simplistic example: linear regression on monthly totals
    df["month"] = pd.to_datetime(df.date).dt.month
    X = df[["month"]]
    y = df.sales
    model = LinearRegression().fit(X, y)
    df["predicted"] = model.predict(X)
    return df
