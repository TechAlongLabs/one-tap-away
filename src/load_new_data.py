import os
from io import StringIO
from urllib.request import urlopen

import pandas as pd


SHEET_ID = "1hMsYgDQj3ymqwxUXA7R-ITITnw3HzeVZBxaXAjiJwAE"
TARGET_GID = 0

OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), "artifacts", "spreadsheet_data.json"
)


def _load_sheet():
    csv_url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={TARGET_GID}"
    with urlopen(csv_url, timeout=12) as response:
        csv_bytes = response.read()
    return pd.read_csv(StringIO(csv_bytes.decode("utf-8")))


def _save_to_json(df):
    df.to_json(OUTPUT_PATH, orient="records", indent=2)


def load_new_data():
    print("Loading New Data...")
    try:
        df = _load_sheet()
        _save_to_json(df)
        print("Spreadsheet data refreshed successfully.")
        return True
    except Exception as exc:
        if os.path.exists(OUTPUT_PATH):
            print(
                "Could not refresh Google Sheets data; using bundled fallback "
                f"at {OUTPUT_PATH}. Error: {exc}"
            )
            return False
        raise RuntimeError(
            "Startup aborted: no fallback spreadsheet_data.json is available."
        ) from exc
