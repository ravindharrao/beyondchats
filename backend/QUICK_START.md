# Quick Start Guide

## ✅ Fixed Issues:
1. **Syntax Error:** Fixed unmatched brace in `Article.php`
2. **MongoDB Extension Check:** Added graceful handling when extension is missing

## Current Status:

### ✅ Ready:
- Dependencies installed
- Environment files created
- Code syntax fixed

### ⚠️ Required:
- **MongoDB PHP Extension** - Must be installed to use MongoDB

## Next Steps:

### 1. Install MongoDB PHP Extension

**Your PHP Info:**
- Version: PHP 8.5.1
- Architecture: 64-bit
- Thread Safety: Enabled (TS)
- php.ini: `C:\php\php.ini`

**Download & Install:**
1. Go to: https://windows.php.net/downloads/pecl/releases/mongodb/
2. Download: `php_mongodb-1.21.x-8.5-ts-vs17-x64.zip` (or latest)
3. Extract `php_mongodb.dll`
4. Copy to: `C:\php\ext\`
5. Edit `C:\php\php.ini` and add: `extension=mongodb`
6. Restart terminal
7. Verify: `php -m | Select-String mongodb`

### 2. Configure MongoDB

Edit `backend/.env`:

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://127.0.0.1:27017/beyondchats
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beyondchats?retryWrites=true&w=majority
```

### 3. Run Setup Commands

```powershell
cd backend

# Setup database (creates indexes)
php artisan migrate

# Scrape articles
php artisan scrape:articles

# Start server
php -S localhost:8000 -t . index.php
```

### 4. Test API

Open in browser: http://localhost:8000/api/articles

## Troubleshooting:

**"MongoDB extension not installed"**
- Install the extension (see step 1 above)
- Restart terminal after installation

**"Class MongoDB\Driver\Manager not found"**
- Extension not loaded
- Check `php.ini` has `extension=mongodb`
- Restart terminal/web server

**"Connection refused"**
- MongoDB not running (if using local)
- Check connection string in `.env`
- For Atlas: Check IP whitelist

## Summary:

Everything is fixed and ready! Just install the MongoDB PHP extension and you're good to go! 🚀

