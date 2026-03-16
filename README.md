# Accessibility Analyzer

A full-stack web application that analyzes websites for accessibility issues based on WCAG guidelines.

## Tech Stack

Frontend:
- React
- Tailwind CSS
- Vite

Backend:
- Python
- FastAPI
- BeautifulSoup

## Features

- Detects missing image alt attributes
- Checks heading hierarchy
- Identifies accessibility warnings
- Generates downloadable reports
- Upload HTML for analysis

## Running the Project

### Backend

cd backend
source venv/bin/activate
uvicorn main:app --reload

### Frontend

cd frontend
npm install
npm run dev