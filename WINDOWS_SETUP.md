# Windows PowerShell Setup Guide

This guide provides Windows PowerShell-specific commands for the BeyondChats project.

## PowerShell vs Bash Commands

### Checking MongoDB Extension

**❌ This won't work in PowerShell:**
```bash
php -m | grep mongodb
```

**✅ Use this in PowerShell instead:**
```powershell
php -m | Select-String mongodb
# or
php -m | findstr mongodb
```

### Copying Files

**❌ Linux/macOS:**
```bash
cp .env.example .env
```

**✅ Windows PowerShell:**
```powershell
Copy-Item .env.example .env
# or use the alias
cp .env.example .env
```

### Creating Directories

**✅ PowerShell:**
```powershell
New-Item -ItemType Directory -Path "backend"
# or
mkdir backend
```

### Checking if MongoDB is Running

**✅ PowerShell:**
```powershell
# Check MongoDB service
Get-Service MongoDB
# or
net start | findstr MongoDB

# Test connection
mongosh
# or
mongo
```

### Testing API Endpoints

**✅ PowerShell (using Invoke-WebRequest):**
```powershell
# Get all articles
Invoke-WebRequest -Uri http://localhost:8000/api/articles | Select-Object -ExpandProperty Content

# Or use curl (if installed)
curl http://localhost:8000/api/articles
```

### Environment Variables

**✅ PowerShell:**
```powershell
# Set environment variable for current session
$env:REACT_APP_API_URL = "http://localhost:8000/api"

# Check environment variable
$env:REACT_APP_API_URL
```

### Checking Ports

**✅ PowerShell:**
```powershell
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Check if port 3000 is in use
netstat -ano | findstr :3000
```

### Installing MongoDB PHP Extension on Windows

1. **Download PHP MongoDB Extension:**
   - Go to [pecl.php.net/package/mongodb](https://pecl.php.net/package/mongodb)
   - Download the DLL for your PHP version and architecture (x86 or x64)
   - Or use: `pecl download mongodb` (if PECL is installed)

2. **Find your PHP installation:**
   ```powershell
   php --ini
   # This shows the path to php.ini
   ```

3. **Copy DLL to PHP ext folder:**
   ```powershell
   # Usually located at: C:\php\ext\
   # Copy php_mongodb.dll to this folder
   ```

4. **Edit php.ini:**
   ```powershell
   # Open php.ini in notepad
   notepad C:\php\php.ini
   
   # Add this line:
   extension=mongodb
   ```

5. **Restart web server or PHP-FPM**

6. **Verify:**
   ```powershell
   php -m | Select-String mongodb
   ```

### Common PowerShell Aliases

PowerShell has some aliases that work like bash:
- `ls` → `Get-ChildItem`
- `cd` → `Set-Location`
- `cp` → `Copy-Item`
- `rm` → `Remove-Item`
- `mkdir` → `New-Item -ItemType Directory`

### Running Multiple Terminals

**Option 1: Use Windows Terminal (Recommended)**
- Install from Microsoft Store
- Can split panes and have multiple tabs

**Option 2: Use PowerShell ISE or VS Code**
- Open multiple integrated terminals

**Option 3: Use separate PowerShell windows**
- Open multiple PowerShell windows manually

### MongoDB Installation on Windows

1. **Download MongoDB Community Server:**
   - Visit [mongodb.com/download](https://www.mongodb.com/try/download/community)
   - Download Windows installer (.msi)

2. **Install MongoDB:**
   - Run the installer
   - Choose "Complete" installation
   - Install as Windows Service (recommended)

3. **Verify Installation:**
   ```powershell
   # Check MongoDB service
   Get-Service MongoDB
   
   # Connect to MongoDB
   mongosh
   ```

4. **If MongoDB service is not running:**
   ```powershell
   # Start MongoDB service
   Start-Service MongoDB
   
   # Or manually start
   net start MongoDB
   ```

### Troubleshooting Windows-Specific Issues

**Problem: "php" is not recognized**
- Add PHP to PATH environment variable
- Or use full path: `C:\php\php.exe`

**Problem: "composer" is not recognized**
- Install Composer for Windows
- Or use: `php composer.phar` instead

**Problem: "npm" is not recognized**
- Install Node.js (which includes npm)
- Restart PowerShell after installation

**Problem: MongoDB connection refused**
- Check if MongoDB service is running: `Get-Service MongoDB`
- Start service: `Start-Service MongoDB`
- Check firewall settings

**Problem: Port already in use**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Quick Reference

| Task | PowerShell Command |
|------|-------------------|
| Check MongoDB extension | `php -m \| Select-String mongodb` |
| Copy file | `Copy-Item .env.example .env` |
| Check MongoDB service | `Get-Service MongoDB` |
| Start MongoDB | `Start-Service MongoDB` |
| Check port | `netstat -ano \| findstr :8000` |
| Test API | `Invoke-WebRequest http://localhost:8000/api/articles` |

For more details, see [HOW_TO_RUN.md](HOW_TO_RUN.md) and [SETUP_MONGODB.md](SETUP_MONGODB.md)

