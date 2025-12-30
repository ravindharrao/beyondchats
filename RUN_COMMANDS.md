# Quick Run Commands

## Quick Start (Copy & Paste)

### 1. Install MongoDB PHP Extension
```bash
# Windows: Download DLL and add to php.ini
# Linux: sudo apt-get install php-mongodb
# macOS: brew install php-mongodb

# Verify (Windows PowerShell):
php -m | Select-String mongodb
# or
php -m | findstr mongodb

# Verify (Linux/macOS):
php -m | grep mongodb
```

### 2. Setup Backend
```bash
cd backend
composer install
cp .env.example .env
# Edit .env with MongoDB connection (see SETUP_MONGODB.md)
php artisan migrate
php artisan scrape:articles
php -S localhost:8000 -t . index.php
```

### 3. Setup Enhancement Script (Optional)
```bash
cd enhancement-script
npm install
cp .env.example .env
# Edit .env with API keys (optional)
npm start
```

### 4. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env: REACT_APP_API_URL=http://localhost:8000/api
npm start
```

## MongoDB .env Configuration

### Local MongoDB:
```env
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=beyondchats
MONGODB_URI=
```

### MongoDB Atlas:
```env
DB_CONNECTION=mongodb
DB_HOST=cluster0.xxxxx.mongodb.net
DB_PORT=27017
DB_DATABASE=beyondchats
DB_USERNAME=your_username
DB_PASSWORD=your_password
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/beyondchats?retryWrites=true&w=majority
```

## Verify Everything Works

1. **Backend:** Open http://localhost:8000/api/articles
2. **Frontend:** Open http://localhost:3000
3. **MongoDB:** Run `mongosh` and `use beyondchats; db.articles.find()`

For detailed instructions, see [HOW_TO_RUN.md](HOW_TO_RUN.md) and [SETUP_MONGODB.md](SETUP_MONGODB.md)

