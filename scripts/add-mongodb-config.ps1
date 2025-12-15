# SlideBuddy - Add MongoDB Configuration

Write-Host "Adding MongoDB and JWT configuration to .env..." -ForegroundColor Cyan
Write-Host ""

# Read current .env
$envPath = "backend\.env"
$envContent = Get-Content $envPath -Raw

Write-Host "Step 1: MongoDB Connection String" -ForegroundColor Yellow
Write-Host "Get this from MongoDB Atlas after creating your cluster" -ForegroundColor Gray
Write-Host ""
Write-Host "Enter your MongoDB connection string:" -ForegroundColor Green
Write-Host "(Example: mongodb+srv://username:password@cluster.mongodb.net/slidebuddy)" -ForegroundColor Gray
$mongoUri = Read-Host "MongoDB URI"

Write-Host ""
Write-Host "Step 2: JWT Secret" -ForegroundColor Yellow
Write-Host "This is used to sign authentication tokens" -ForegroundColor Gray
Write-Host ""
Write-Host "Enter a random secret key (or press Enter to generate one):" -ForegroundColor Green
$jwtSecret = Read-Host "JWT Secret"

if ([string]::IsNullOrWhiteSpace($jwtSecret)) {
    # Generate random JWT secret
    $jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object { [char]$_ })
    Write-Host "Generated random JWT secret" -ForegroundColor Green
}

# Add to .env
$envContent += "`n`n# MongoDB Configuration`nMONGODB_URI=$mongoUri`n"
$envContent += "`n# JWT Secret`nJWT_SECRET=$jwtSecret`n"

# Write back to file
Set-Content -Path $envPath -Value $envContent

Write-Host ""
Write-Host "[OK] Configuration added successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Your .env file now includes:" -ForegroundColor Cyan
Write-Host "  - MONGODB_URI" -ForegroundColor White
Write-Host "  - JWT_SECRET" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Restart your backend server" -ForegroundColor White
Write-Host "  2. Test the authentication endpoints" -ForegroundColor White
Write-Host ""
