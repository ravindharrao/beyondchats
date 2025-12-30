# Quick MongoDB Extension Install for Windows

## Your PHP Info:
- **Version:** PHP 8.5.1
- **Architecture:** 64-bit
- **Thread Safety:** Enabled (TS)
- **php.ini:** `C:\php\php.ini`

## Quick Steps:

### 1. Download MongoDB Extension

**Direct Download Link:**
https://windows.php.net/downloads/pecl/releases/mongodb/

**What to Download:**
- Look for: `php_mongodb-1.21.x-8.5-ts-vs17-x64.zip`
- Or any version matching: `8.5`, `ts` (Thread Safe), `x64`

### 2. Extract and Copy DLL

1. Extract the ZIP file
2. Find `php_mongodb.dll` inside
3. Copy it to: `C:\php\ext\`

### 3. Enable in php.ini

1. Open: `C:\php\php.ini` in Notepad (as Administrator)
2. Find the section with `;extension=...`
3. Add this line:
   ```ini
   extension=mongodb
   ```
4. Save the file

### 4. Verify Installation

Open a NEW PowerShell window and run:
```powershell
php -m | Select-String mongodb
```

Should output: `mongodb`

### 5. Test the Setup

```powershell
cd backend
php artisan migrate
```

## Alternative: Use MongoDB Atlas (Cloud)

If installing the extension is difficult, use MongoDB Atlas instead:

1. Sign up: https://www.mongodb.com/cloud/atlas (Free tier available)
2. Create a cluster
3. Get connection string
4. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beyondchats?retryWrites=true&w=majority
   ```

**Note:** You still need the PHP extension even for Atlas!

## Troubleshooting

**"extension=mongodb" not working?**
- Make sure DLL is in `C:\php\ext\`
- Check php.ini path: `php --ini`
- Restart terminal after changes

**"Unable to load dynamic library"?**
- Wrong DLL version (check TS vs NTS, x86 vs x64)
- Download correct version for PHP 8.5 TS x64

**Still having issues?**
- See full guide: `INSTALL_MONGODB_EXTENSION_WINDOWS.md`
- Or use MongoDB Atlas cloud service

