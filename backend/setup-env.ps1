# PowerShell script to create .env file from .env.example

$envExample = ".env.example"
$envFile = ".env"

# Create .env.example if it doesn't exist
if (-not (Test-Path $envExample)) {
    @"
APP_NAME=BeyondChats
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# MongoDB Configuration
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=beyondchats
DB_USERNAME=
DB_PASSWORD=

# MongoDB Connection URI (for Atlas or custom connections)
# Local: mongodb://127.0.0.1:27017/beyondchats
# Atlas: mongodb+srv://username:password@cluster.mongodb.net/beyondchats?retryWrites=true&w=majority
MONGODB_URI=
"@ | Out-File -FilePath $envExample -Encoding utf8
    Write-Host "Created $envExample" -ForegroundColor Green
}

# Create .env from .env.example
if (Test-Path $envExample) {
    Copy-Item $envExample $envFile -Force
    Write-Host "Created $envFile from $envExample" -ForegroundColor Green
    Write-Host "`nPlease edit $envFile with your MongoDB connection details!" -ForegroundColor Yellow
} else {
    Write-Host "Error: $envExample not found!" -ForegroundColor Red
}

