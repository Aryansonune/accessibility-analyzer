# backend/main.py
import asyncio
import logging
from urllib.parse import urlparse

import requests
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool

from analyzer import analyze_html
from selenium_fetch import fetch_rendered_html  # make sure this file exists in backend/

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

# Semaphore to limit concurrent Selenium usage (adjust to your machine)
SELENIUM_CONCURRENCY = 2
selenium_semaphore = asyncio.BoundedSemaphore(SELENIUM_CONCURRENCY)

@app.get("/")
def home():
    return {"message": "Accessibility Analyzer API running"}

@app.post("/analyze")
async def analyze(request: URLRequest):
    """
    Analyze endpoint:
    - try fast requests.get first
    - if HTML seems too small or missing content, fall back to Selenium (render JS)
    - run analyzer on resulting HTML
    """
    try:
        url = normalize_and_validate_url(request.url)
    except ValueError as e:
        logger.info("Validation failed for input: %s (%s)", request.url, e)
        return {"error": f"Invalid URL: {e}"}

    logger.info("Received analyze request for URL: %s", url)

    html = ""
    # 1) Fast, cheap attempt with requests
    try:
        resp = requests.get(url, timeout=10, headers={"User-Agent": "A11yAnalyzerBot/1.0"})
        resp.raise_for_status()
        html = resp.text or ""
        logger.info("Fetched HTML via requests; length=%d", len(html))
    except requests.exceptions.RequestException as e:
        logger.warning("requests.get failed (%s). Will attempt Selenium fallback. Error: %s", url, e)
        html = ""

    # 2) Heuristic: fallback to Selenium if html is too small or looks like a skeleton
    #    Adjust threshold as needed (1500-3000 chars is a common heuristic)
    need_selenium = False
    try:
        if not html or len(html) < 1500:
            need_selenium = True
        # also check for single-page-app skeleton markers (very simple heuristics)
        if "<div id=\"root\"" in html.lower() or "<div id=\"__next\"" in html.lower() or "<app-root" in html.lower():
            # often initial HTML is a small container for client-side frameworks
            need_selenium = True
    except Exception:
        need_selenium = True

    if need_selenium:
        logger.info("Falling back to Selenium to render JavaScript for %s", url)
        try:
            # run Selenium in a threadpool and limit concurrency to avoid resource exhaustion
            async with selenium_semaphore:
                html = await run_in_threadpool(fetch_rendered_html, url)
            logger.info("Fetched HTML via Selenium; length=%d", len(html) if html else 0)
        except Exception as e:
            logger.error("Selenium fetch failed for %s: %s", url, e)
            return {"error": f"Failed to fetch website (Selenium): {e}"}

    if not html:
        logger.error("Failed to fetch HTML for %s by both requests and Selenium", url)
        return {"error": "Could not fetch page HTML from the target site."}

    # run analyzer; this returns dict with errors/warnings/suggestions/summary
    try:
        result = analyze_html(html)
    except Exception as e:
        logger.exception("Analyzer failed for %s: %s", url, e)
        return {"error": f"Analysis failed: {e}"}

    logger.info("Analysis complete for %s — total issues: %s", url, result.get("summary", {}).get("total"))
    return result