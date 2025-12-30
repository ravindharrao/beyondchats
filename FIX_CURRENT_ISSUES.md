# Fix Current Issues - Step by Step

## Current Problems:
1.  MongoDB PHP extension not installed
2.  `.env.example` file missing
3.  Composer dependencies not installed
4.  Server started but won't work without dependencies

---

## Quick Fix Steps

### Step 1: Create .env Files

**Option A: Run the setup script (Recommended)**
```powershell
cd backend
.\setup-env.ps1
```

**Option B: Manual creation**
```powershell
cd backend
@"
APP_NAME=BeyondChats
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=beyondchats
DB_USERNAME=
DB_PASSWORD=
MONGODB_URI=
"@ | Out-File -FilePath .env.example -Encoding utf8

Copy-Item .env.example .env
```

### Step 2: Install Dependencies (Temporary Workaround)

Since MongoDB extension isn't installed yet, install other dependencies first:

```powershell
cd backend
composer install --ignore-platform-req=ext-mongodb
```

This will install all packages except MongoDB. You'll need the extension before running the app.

### Step 3: Install MongoDB PHP Extension

**See detailed guide:** [INSTALL_MONGODB_EXTENSION_WINDOWS.md](INSTALL_MONGODB_EXTENSION_WINDOWS.md)

**Quick summary:**
1. Find your PHP version: `php -v`
2. Check architecture: `php -r "echo PHP_INT_SIZE * 8 . '-bit';"`
3. Download MongoDB DLL from: https://pecl.php.net/package/mongodb
4. Copy `php_mongodb.dll` to PHP `ext` folder (usually `C:\php\ext\`)
5. Edit `php.ini` and add: `extension=mongodb`
6. Verify: `php -m | Select-String mongodb`

### Step 4: Install MongoDB Extension Package

After installing the PHP extension:

```powershell
cd backend
composer require mongodb/mongodb
```

### Step 5: Configure MongoDB Connection

Edit `backend\.env` with your MongoDB connection:

**For Local MongoDB:**
```env
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=beyondchats
MONGODB_URI=
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beyondchats?retryWrites=true&w=majority
```

### Step 6: Setup Database

```powershell
cd backend
php artisan migrate
php artisan scrape:articles
```

### Step 7: Start Server

```powershell
php -S localhost:8000 -t . index.php
```

---

## Alternative: Use MongoDB Atlas (Cloud) - No Local Installation Needed

If you don't want to install MongoDB locally:

1. **Sign up for free MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
2. **Create a free cluster**
3. **Get connection string**
4. **Update `backend\.env`:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beyondchats?retryWrites=true&w=majority
   ```
5. **Still need MongoDB PHP extension** (but don't need local MongoDB server)

---

## Current Status Checklist

- [ ] Created `.env.example` file
- [ ] Created `.env` file
- [ ] Installed dependencies with workaround: `composer install --ignore-platform-req=ext-mongodb`
- [ ] Installed MongoDB PHP extension
- [ ] Verified extension: `php -m | Select-String mongodb`
- [ ] Installed MongoDB package: `composer require mongodb/mongodb`
- [ ] Configured MongoDB connection in `.env`
- [ ] Ran migrations: `php artisan migrate`
- [ ] Scraped articles: `php artisan scrape:articles`
- [ ] Started server: `php -S localhost:8000 -t . index.php`

---

## Need Help?

- **MongoDB Extension Installation:** See [INSTALL_MONGODB_EXTENSION_WINDOWS.md](INSTALL_MONGODB_EXTENSION_WINDOWS.md)
- **Windows PowerShell Commands:** See [WINDOWS_SETUP.md](WINDOWS_SETUP.md)
- **General Setup:** See [HOW_TO_RUN.md](HOW_TO_RUN.md)

