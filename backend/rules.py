# backend/rules.py

def check_images(soup):
    issues = []

    images = soup.find_all("img")

    for img in images:
        alt = img.get("alt")
        src = img.get("src") or "unknown image"

        if alt is None or alt.strip() == "":
            issues.append({
                "type": "error",
                "message": f"Image missing alt attribute: {src}",
                "wcag": "WCAG 1.1.1 Non-text Content",
                "fix": "Add descriptive alt text to the image element."
            })

    return issues


def check_headings(soup):
    issues = []

    headings = soup.find_all(["h1","h2","h3","h4","h5","h6"])

    last_level = 0

    for h in headings:
        level = int(h.name[1])

        if last_level and level > last_level + 1:
            issues.append({
                "type": "warning",
                "message": f"Skipped heading level: {h.name}",
                "wcag": "WCAG 1.3.1 Info and Relationships",
                "fix": "Use headings in sequential order (h1 → h2 → h3)."
            })

        last_level = level

    return issues


def check_viewport(soup):
    issues = []

    viewport = soup.find("meta", attrs={"name":"viewport"})

    if not viewport:
        issues.append({
            "type": "suggestion",
            "message": "Missing meta viewport tag",
            "wcag": "WCAG 1.4.10 Reflow",
            "fix": "Add <meta name='viewport' content='width=device-width, initial-scale=1'>"
        })

    return issues