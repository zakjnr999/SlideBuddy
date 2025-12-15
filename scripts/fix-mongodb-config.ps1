# Fix MongoDB configuration - add to root .env

$rootEnv = ".env"
$backendEnv = "backend\.env"

Write-Host "Copying MongoDB config from backend/.env to root .env..." -ForegroundColor Cyan

# Read backend .env
$backendContent = Get-Content $backendEnv -Raw

# Extract MongoDB URI and JWT Secret
if ($backendContent -match 'MONGODB_URI=([^\r\n]+)') {
    $mongoUri = $matches[1]
    Write-Host "Found MongoDB URI" -ForegroundColor Green
}

if ($backendContent -match 'JWT_SECRET=([^\r\n]+)') {
    $jwtSecret = $matches[1]
    Write-Host "Found JWT Secret" -ForegroundColor Green
}

# Read root .env
$rootContent = Get-Content $rootEnv -Raw

# Add MongoDB config if not already there
if ($rootContent -notmatch 'MONGODB_URI') {
    $rootContent += "`n`n# MongoDB Configuration`nMONGODB_URI=$mongoUri`n"
    Write-Host "Added MONGODB_URI to root .env" -ForegroundColor Green
}

if ($rootContent -notmatch 'JWT_SECRET') {
    $rootContent += "`n# JWT Secret`nJWT_SECRET=$jwtSecret`n"
    Write-Host "Added JWT_SECRET to root .env" -ForegroundColor Green
}

# Write back
Set-Content -Path $rootEnv -Value $rootContent

Write-Host ""
Write-Host "[OK] Configuration updated!" -ForegroundColor Green
Write-Host "Restart your server now." -ForegroundColor Yellow
