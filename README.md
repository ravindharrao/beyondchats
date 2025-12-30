# BeyondChats – Full Stack Developer Intern Assignment

This project is developed as part of the **BeyondChats Full Stack Developer Intern assignment**.  
It demonstrates article scraping, API development, AI-based content enhancement, and a React frontend for displaying articles.

---

## Project Overview

The project is divided into three phases:

- Phase 1: Backend APIs to scrape and manage blog articles  
- Phase 2: A Node.js script to enhance articles using Google search results and an LLM  
- Phase 3: A React frontend to display original and enhanced articles  

The system scrapes articles from BeyondChats blogs, enhances them using reference articles, and displays them in a professional UI.

---

## Features

- Scrapes the 5 oldest articles from BeyondChats blogs  
- Stores articles in a database  
- Provides CRUD APIs for articles  
- Enhances articles using:
  - Google Search results  
  - Content scraped from top-ranking blogs  
  - LLM-based content formatting and rewriting  
- Displays original and enhanced articles in a React UI  

---

## Tech Stack

### Backend (Phase 1)
- Laravel (PHP)
- MySQL
- REST APIs

### Enhancement Script (Phase 2)
- Node.js
- Axios
- Cheerio
- Google Custom Search API
- LLM API (OpenAI / Claude)

### Frontend (Phase 3)
- React.js
- Axios
- CSS

---

## Data Flow (Simple)

- Backend scrapes articles from BeyondChats blogs and stores them in the database  
- Node.js script:
  - Fetches articles from backend APIs  
  - Searches article titles on Google  
  - Scrapes top 2 reference articles  
  - Uses an LLM to enhance the original article  
  - Updates the article using backend APIs with citations  
- React frontend fetches and displays both original and enhanced articles  

---

## Project Structure

beyondchats/
├── backend/ # Laravel backend APIs
├── enhancement-script/ # Node.js enhancement script
├── frontend/ # React frontend
└── README.md

---

## Local Setup Instructions

### Prerequisites
- PHP >= 8.1
- Composer
- Node.js >= 18
- MySQL
- Git

---

### Phase 1: Backend Setup (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan migrate
php artisan scrape:articles
php artisan serve
http://localhost:8000/api/articles

cd enhancement-script
npm install
cp .env.example .env
npm start

cd frontend
npm install
cp .env.example .env
npm start

http://localhost:3000

### API Endpoints 

GET /api/articles – Get all articles

GET /api/articles/{id} – Get a single article

POST /api/articles – Create an article

PUT /api/articles/{id} – Update an article

DELETE /api/articles/{id} – Delete an article

### Live Demo

Frontend deployment is not available yet.
The complete project can be run locally using the setup instructions above.

