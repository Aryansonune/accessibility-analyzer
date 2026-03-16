# backend/main.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import logging
from urllib.parse import urlparse
from analyzer import analyze_html

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("a11y-backend")

app = FastAPI(title="Accessibility Analyzer API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLRequest(BaseModel):
    url: str

def normalize_and_validate_url(raw: str) -> str:
    if not raw:
        raise ValueError("No URL provided")
    raw = raw.strip()
    # if user typed something like "example.com" add scheme
    parsed = urlparse(raw)
    if not parsed.scheme:
        raw = "https://" + raw
        parsed = urlparse(raw)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise ValueError("Invalid URL")
    return raw

@app.get("/")
def home():
    return {"message": "Accessibility Analyzer API running"}

@app.post("/analyze")
def analyze(request: URLRequest):
    try:
        url = normalize_and_validate_url(request.url)
    except ValueError as e:
        logger.info("Validation failed for input: %s (%s)", request.url, e)
        return {"error": f"Invalid URL: {e}"}

    logger.info("Received analyze request for URL: %s", url)

    try:
        resp = requests.get(url, timeout=10, headers={"User-Agent": "A11yAnalyzerBot/1.0"})
        resp.raise_for_status()
        html = resp.text
    except requests.exceptions.RequestException as e:
        logger.error("Failed to fetch URL %s: %s", url, e)
        return {"error": f"Failed to fetch website: {e}"}
    except Exception as e:
        logger.error("Unexpected fetch error for %s: %s", url, e)
        return {"error": f"Unexpected error: {e}"}

    # run analyzer; this returns dict with errors/warnings/suggestions/summary
    result = analyze_html(html)
    logger.info("Analysis complete for %s — total issues: %s", url, result.get("summary", {}).get("total"))
    return result