# MongoDB Setup Guide

## Quick MongoDB Connection Setup

### Option 1: Local MongoDB (Recommended for Development)

1. **Install MongoDB:**
   - **Windows:** Download from [mongodb.com/download](https://www.mongodb.com/try/download/community)
   - **macOS:** `brew install mongodb-community`
   - **Linux:** `sudo apt-get install mongodb` or use Docker

2. **Start MongoDB:**
   ```bash
   # Windows: Usually starts as a service automatically
   # macOS/Linux:
   mongod
   # or with Docker:
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

3. **Configure `.env` in backend folder:**
   ```env
   DB_CONNECTION=mongodb
   DB_HOST=127.0.0.1
   DB_PORT=27017
   DB_DATABASE=beyondchats
   DB_USERNAME=
   DB_PASSWORD=
   MONGODB_URI=
   ```

### Option 2: MongoDB Atlas (Cloud - Free Tier Available)

1. **Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)**

2. **Create a free cluster** (M0 - Free tier)

3. **Create a database user:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Save username and password

4. **Whitelist your IP:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Add `0.0.0.0/0` for all IPs (or your specific IP)

5. **Get connection string:**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Configure `.env` in backend folder:**
   ```env
   DB_CONNECTION=mongodb
   DB_HOST=cluster0.xxxxx.mongodb.net
   DB_PORT=27017
   DB_DATABASE=beyondchats
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/beyondchats?retryWrites=true&w=majority
   ```

## Install MongoDB PHP Extension

### Windows

1. Download PHP MongoDB extension DLL from [pecl.php.net/package/mongodb](https://pecl.php.net/package/mongodb)
2. Copy `php_mongodb.dll` to your PHP `ext` folder
3. Add to `php.ini`:
   ```ini
   extension=mongodb
   ```
4. Restart web server

### Linux (Ubuntu/Debian)

```bash
sudo apt-get install php-mongodb
sudo systemctl restart apache2  # or nginx, php-fpm
```

### macOS

```bash
brew install php-mongodb
# or
pecl install mongodb
```

### Verify Installation

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

Should output: `mongodb`

## Test MongoDB Connection

```bash
# Test with mongosh (MongoDB Shell)
mongosh
# or
mongo

# In MongoDB shell:
use beyondchats
db.articles.find()
```

## Troubleshooting

### "Class 'MongoDB\Client' not found"
- MongoDB PHP extension is not installed
- Run: `php -m | grep mongodb` to verify
- Install extension (see above)

### "Connection refused"
- MongoDB is not running
- Check: `mongosh` or `mongo` to verify connection
- Start MongoDB service

### "Authentication failed" (Atlas)
- Check username/password in connection string
- Verify IP is whitelisted in Atlas
- Check database user has correct permissions

### Connection String Format

**Local:**
```
mongodb://127.0.0.1:27017/beyondchats
```

**Atlas:**
```
mongodb+srv://username:password@cluster.mongodb.net/beyondchats?retryWrites=true&w=majority
```

## Next Steps

After MongoDB is configured:

1. Run: `cd backend && php artisan migrate` (creates indexes)
2. Run: `php artisan scrape:articles` (scrapes initial articles)
3. Start backend: `php -S localhost:8000 -t . index.php`

Your MongoDB is now ready! 🎉

