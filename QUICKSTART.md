# Quick Start Guide

Follow these steps to get the project running quickly.

## Prerequisites Check

Make sure you have installed:
- ✅ PHP >= 8.1
- ✅ Composer
- ✅ Node.js >= 18.x
- ✅ MySQL >= 8.0

## Step-by-Step Setup

### 1. Database Setup

```sql
CREATE DATABASE beyondchats;
```

### 2. Backend Setup (5 minutes)

```bash
cd backend
composer install
cp .env.example .env
# Edit .env with your database credentials
php artisan migrate
php artisan scrape:articles
php -S localhost:8000 -t . index.php
```

### 3. Enhancement Script Setup (Optional - requires API keys)

```bash
cd enhancement-script
npm install
cp .env.example .env
# Edit .env with your API keys (Google, OpenAI)
npm start
```

### 4. Frontend Setup (2 minutes)

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with API URL: REACT_APP_API_URL=http://localhost:8000/api
npm start
```

## Access Points

- **Backend API**: http://localhost:8000/api/articles
- **Frontend**: http://localhost:3000

## Troubleshooting

### Backend Issues
- Make sure MySQL is running
- Check database credentials in `.env`
- Ensure port 8000 is not in use

### Frontend Issues
- Make sure backend is running first
- Check CORS settings if API calls fail
- Verify `REACT_APP_API_URL` in `.env`

### Enhancement Script Issues
- API keys are optional - script will work with fallback search
- Google API has rate limits - add delays if needed
- LLM API key required for actual enhancement

## Next Steps

1. Scrape articles: `php artisan scrape:articles`
2. View articles in frontend: http://localhost:3000
3. Run enhancement script: `npm start` (in enhancement-script folder)
4. View enhanced articles in frontend

