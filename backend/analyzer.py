# backend/analyzer.py

from bs4 import BeautifulSoup
from rules import check_images, check_headings, check_viewport


def analyze_html(html):

    soup = BeautifulSoup(html, "html.parser")

    issues = []

    issues.extend(check_images(soup))
    issues.extend(check_headings(soup))
    issues.extend(check_viewport(soup))

    errors = [i for i in issues if i["type"] == "error"]
    warnings = [i for i in issues if i["type"] == "warning"]
    suggestions = [i for i in issues if i["type"] == "suggestion"]

    total = len(issues)

    score = max(0, 100 - total * 8)

    return {
        "errors": errors,
        "warnings": warnings,
        "suggestions": suggestions,
        "summary": {
            "total": total,
            "score": score
        }
    }