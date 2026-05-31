import json
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import google.generativeai as genai

from src.chat_with_semantic_search import chat_semantic_search_bp
from src.load_new_data import load_new_data

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-flash-latest")
else:
    model = None

DIST_DIR = os.path.join(os.path.dirname(__file__), "dist")
app = Flask(__name__, static_folder=DIST_DIR, static_url_path="")

if os.getenv("ENABLE_CORS", "0") == "1":
    CORS(app)

app.register_blueprint(chat_semantic_search_bp)

# Best-effort refresh; startup continues when bundled artifact fallback exists.
load_new_data()


def _require_model():
    if model is None:
        raise RuntimeError("GEMINI_API_KEY is not set. Configure it in Cloud Run secrets.")
    return model


def extract_vars(user_text):
    prompt = (
        f"Analyze this message: '{user_text}'. "
        "Identify the 'city' (must be in British Columbia) and the 'intent' (all other words). "
        'Return ONLY a JSON object: {"city": "string or null", "intent": "string"}'
    )

    response = _require_model().generate_content(prompt)
    json_str = response.text.strip().replace("```json", "").replace("```", "")
    return json.loads(json_str)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(silent=True) or {}
        user_message = data.get("message", "")
        result = extract_vars(user_message)
        return jsonify(result)
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 500
    except json.JSONDecodeError:
        return jsonify({"error": "Model returned invalid JSON."}), 502


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    full_path = os.path.join(DIST_DIR, path)
    if path and os.path.exists(full_path):
        return send_from_directory(DIST_DIR, path)
    index_path = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index_path):
        return send_from_directory(DIST_DIR, "index.html")
    return jsonify({"error": "Frontend assets are missing. Build frontend first."}), 503


def main():
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port, debug=False)


if __name__ == "__main__":
    main()
