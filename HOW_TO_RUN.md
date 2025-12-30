# How to Run the BeyondChats Project

This guide will walk you through setting up and running all three phases of the project.

## Prerequisites

Before starting, make sure you have installed:

- ✅ **PHP** >= 8.1
- ✅ **Composer** (PHP package manager)
- ✅ **Node.js** >= 18.x
- ✅ **npm** or **yarn**
- ✅ **MongoDB** (Community Server or Atlas)
- ✅ **MongoDB PHP Extension** (php_mongodb)

### Installing MongoDB PHP Extension

**Windows:**
```bash
# Download from PECL or use precompiled DLL
# Add extension=mongodb.dll to php.ini
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install php-mongodb
```

**macOS:**
```bash
brew install php-mongodb
# or
pecl install mongodb
```

**Verify installation:**

**Windows PowerShell:**
```powershell
php -m | Select-String mongodb
# or
php -m | findstr mongodb
```

**Linux/macOS:**
```bash
php -m | grep mongodb
```

---

## MongoDB Setup

### Option 1: Local MongoDB

1. **Install MongoDB:**
   - Download from [mongodb.com/download](https://www.mongodb.com/try/download/community)
   - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

2. **Start MongoDB:**
   ```bash
   # Windows (if installed as service, it starts automatically)
   # Linux/macOS
   sudo systemctl start mongod
   # or
   mongod
   ```

3. **Verify MongoDB is running:**
   ```bash
   mongosh
   # or
   mongo
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

---

## Step-by-Step Setup

### Step 1: Backend Setup (Laravel API with MongoDB)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with MongoDB connection:**
   
   **For Local MongoDB:**
   ```env
   DB_CONNECTION=mongodb
   DB_HOST=127.0.0.1
   DB_PORT=27017
   DB_DATABASE=beyondchats
   DB_USERNAME=
   DB_PASSWORD=
   MONGODB_URI=mongodb://127.0.0.1:27017/beyondchats
   ```
   
   **For MongoDB Atlas:**
   ```env
   DB_CONNECTION=mongodb
   DB_HOST=cluster0.xxxxx.mongodb.net
   DB_PORT=27017
   DB_DATABASE=beyondchats
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/beyondchats?retryWrites=true&w=majority
   ```

5. **Run database setup (creates collections):**
   ```bash
   php artisan migrate
   ```

6. **Scrape initial articles:**
   ```bash
   php artisan scrape:articles
   ```

7. **Start the PHP server:**
   ```bash
   php -S localhost:8000 -t . index.php
   ```

   ✅ Backend API is now running at: `http://localhost:8000`

   **Test the API:**
   ```bash
   curl http://localhost:8000/api/articles
   ```

---

### Step 2: Enhancement Script Setup (NodeJS)

1. **Navigate to enhancement script directory:**
   ```bash
   cd enhancement-script
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file:**
   ```env
   LARAVEL_API_URL=http://localhost:8000/api
   GOOGLE_API_KEY=your_google_api_key_here
   GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
   LLM_API_KEY=your_openai_api_key_here
   LLM_PROVIDER=openai
   ```

   > **Note:** API keys are optional. The script will work with fallback search if Google API is not configured.

5. **Run the enhancement script:**
   ```bash
   npm start
   ```

   The script will:
   - Fetch articles from the API
   - Search Google for each article
   - Scrape reference articles
   - Enhance articles using LLM
   - Update articles via API

---

### Step 3: Frontend Setup (React)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file:**
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   ```

5. **Start the development server:**
   ```bash
   npm start
   ```

   ✅ Frontend is now running at: `http://localhost:3000`

   The browser should open automatically. If not, navigate to `http://localhost:3000`

---

## Running All Services

### Terminal 1 - Backend:
```bash
cd backend
php -S localhost:8000 -t . index.php
```

### Terminal 2 - Enhancement Script (Optional):
```bash
cd enhancement-script
npm start
```

### Terminal 3 - Frontend:
```bash
cd frontend
npm start
```

---

## 🔍 Testing the Setup

### 1. Test Backend API

```bash
# Get all articles
curl http://localhost:8000/api/articles

# Get specific article
curl http://localhost:8000/api/articles/1

# Scrape new articles
curl -X POST http://localhost:8000/api/articles/scrape
```

### 2. Test Frontend

1. Open browser: `http://localhost:3000`
2. You should see the article list
3. Click on an article to view details
4. Toggle between original and enhanced versions

### 3. Test Enhancement Script

1. Make sure backend is running
2. Run: `cd enhancement-script && npm start`
3. Check console for progress
4. Refresh frontend to see enhanced articles

---

## Troubleshooting

### Backend Issues

**Problem: MongoDB connection failed**
```bash
# Check if MongoDB is running
mongosh
# or check connection string in .env
```

**Problem: Composer dependencies not installing**
```bash
# Clear cache
composer clear-cache
composer install --no-cache
```

**Problem: Port 8000 already in use**
```bash
# Use different port
php -S localhost:8001 -t . index.php
# Update frontend .env: REACT_APP_API_URL=http://localhost:8001/api
```

### Frontend Issues

**Problem: Cannot connect to API**
- Check if backend is running
- Verify `REACT_APP_API_URL` in `.env`
- Check browser console for CORS errors

**Problem: npm install fails**
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### MongoDB Issues

**Problem: MongoDB extension not found**

**Windows PowerShell:**
```powershell
php -m | Select-String mongodb
# or
php -m | findstr mongodb
```

**Linux/macOS:**
```bash
php -m | grep mongodb
```

# If not found, install it (see Prerequisites section)

**Problem: Authentication failed (Atlas)**
- Check username/password in connection string
- Verify IP whitelist in Atlas dashboard
- Check network access settings

---

## Common Commands

### Backend
```bash
# Run migrations
php artisan migrate

# Scrape articles
php artisan scrape:articles

# Start server
php -S localhost:8000 -t . index.php
```

### Enhancement Script
```bash
# Run once
npm start

# Run with auto-reload (development)
npm run dev
```

### Frontend
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## Deployment

### Backend Deployment
1. Deploy to server (DigitalOcean, AWS, Heroku)
2. Set environment variables
3. Point domain to server
4. Use process manager (PM2, Supervisor)

### Frontend Deployment
1. Build: `npm run build`
2. Deploy to Vercel, Netlify, or your hosting
3. Update API URL in environment variables

---

## ✅ Checklist

- [ ] MongoDB installed and running
- [ ] MongoDB PHP extension installed
- [ ] Backend dependencies installed (`composer install`)
- [ ] Backend `.env` configured
- [ ] Backend database setup complete (`php artisan migrate`)
- [ ] Backend server running (`php -S localhost:8000`)
- [ ] Enhancement script dependencies installed (`npm install`)
- [ ] Enhancement script `.env` configured (optional)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend `.env` configured
- [ ] Frontend running (`npm start`)
- [ ] Articles scraped (`php artisan scrape:articles`)

---

## Need Help?

If you encounter issues:
1. Check the error messages in terminal
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check that all ports (8000, 3000) are available
5. Review the troubleshooting section above

For more details, see the main [README.md](README.md) file.

