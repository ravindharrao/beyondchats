# Installing MongoDB PHP Extension on Windows

## Quick Fix for Composer Install

You have two options:

### Option 1: Install MongoDB Extension First (Recommended)

Follow the steps below to install the MongoDB PHP extension, then run `composer install` again.

### Option 2: Temporarily Skip MongoDB Requirement

If you want to install other dependencies first and add MongoDB later:

```powershell
cd backend
composer install --ignore-platform-req=ext-mongodb
```

**Note:** You'll still need to install the MongoDB extension before running the application.

---

## Step-by-Step: Install MongoDB PHP Extension on Windows

### Step 1: Find Your PHP Version and Architecture

```powershell
# Check PHP version
php -v

# Check if you're using x86 (32-bit) or x64 (64-bit)
php -r "echo PHP_INT_SIZE * 8 . '-bit';"
```

### Step 2: Find Your PHP Installation Path

```powershell
# Find php.ini location
php --ini

# This will show something like:
# Configuration File (php.ini) Path: C:\php
# Loaded Configuration File: C:\php\php.ini
```

### Step 3: Download MongoDB Extension DLL

1. **Go to PECL MongoDB page:**
   - Visit: https://pecl.php.net/package/mongodb
   - Click on "DLL" link

2. **Or use direct download:**
   - Visit: https://windows.php.net/downloads/pecl/releases/mongodb/
   - Download the version matching your PHP version
   - Choose the correct architecture (x86 or x64)
   - Choose Thread Safe (TS) or Non-Thread Safe (NTS) - check your PHP installation

3. **Check your PHP build:**
   ```powershell
   php -i | Select-String "Thread Safety"
   # If it says "enabled" = Thread Safe (TS)
   # If it says "disabled" = Non-Thread Safe (NTS)
   ```

### Step 4: Extract and Copy DLL

1. Extract the downloaded ZIP file
2. Find `php_mongodb.dll` inside
3. Copy it to your PHP `ext` folder (usually `C:\php\ext\`)

```powershell
# Example: Copy DLL to ext folder
Copy-Item php_mongodb.dll C:\php\ext\
```

### Step 5: Enable Extension in php.ini

1. **Open php.ini:**
   ```powershell
   notepad C:\php\php.ini
   ```

2. **Find the extensions section** (look for lines like `;extension=...`)

3. **Add this line:**
   ```ini
   extension=mongodb
   ```

4. **Save and close**

### Step 6: Verify Installation

```powershell
# Restart your terminal/PowerShell, then:
php -m | Select-String mongodb

# Should output: mongodb
```

### Step 7: Install Composer Dependencies

```powershell
cd backend
composer install
```

---

## Alternative: Use Precompiled Extension

### Using XAMPP/WAMP

If you're using XAMPP or WAMP:

1. **XAMPP:** Extensions are in `C:\xampp\php\ext\`
2. **WAMP:** Extensions are in `C:\wamp\bin\php\php[version]\ext\`

Download the DLL matching your PHP version and architecture, then:
1. Copy to the `ext` folder
2. Edit `php.ini` in the same directory
3. Add `extension=mongodb`
4. Restart Apache/your web server

---

## Troubleshooting

### "php_mongodb.dll not found"
- Make sure the DLL is in the correct `ext` folder
- Check the path in `php.ini` matches your PHP installation

### "Unable to load dynamic library"
- DLL architecture (x86/x64) doesn't match PHP
- DLL is Thread Safe but PHP is NTS (or vice versa)
- Download the correct version

### "Class 'MongoDB\Client' not found"
- Extension not enabled in php.ini
- Restart your web server or terminal
- Run `php -m | Select-String mongodb` to verify

### Finding the Right DLL Version

Match these exactly:
- PHP version (e.g., 8.1, 8.2, 8.5)
- Architecture: x86 (32-bit) or x64 (64-bit)
- Thread Safety: TS or NTS

Check with:
```powershell
php -v                    # PHP version
php -r "echo PHP_INT_SIZE * 8 . '-bit';"  # Architecture
php -i | Select-String "Thread Safety"   # TS or NTS
```

---

## Quick Test After Installation

```powershell
# Test MongoDB connection (if MongoDB is running)
php -r "try { \$client = new MongoDB\Client('mongodb://127.0.0.1:27017'); echo 'MongoDB connection successful!'; } catch (Exception \$e) { echo 'Error: ' . \$e->getMessage(); }"
```

---

## Need Help?

If you're still having issues:
1. Check PHP error logs
2. Verify DLL is in the correct location
3. Ensure php.ini has `extension=mongodb` (no semicolon)
4. Restart your terminal/web server after changes

For more help, see [WINDOWS_SETUP.md](WINDOWS_SETUP.md)

