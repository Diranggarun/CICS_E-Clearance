# CICS E-Clearance — one-shot local bootstrap.
# Usage:  powershell -ExecutionPolicy Bypass -File .\setup.ps1
#
# Skips prompts for any URI/secret already set in backend\.env.
# Re-run safely; it's idempotent.

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'

function Fail($msg) { Write-Host "ERROR: $msg" -ForegroundColor Red; exit 1 }
function Info($msg) { Write-Host $msg -ForegroundColor Cyan }
function Ok($msg)   { Write-Host $msg -ForegroundColor Green }

# --- 1. Tool versions ---
Info '==> Checking Node.js and npm versions'
try { $nodeRaw = (node --version) } catch { Fail 'Node.js is not installed or not on PATH. Install Node 18+ from https://nodejs.org' }
try { $npmRaw  = (npm --version)  } catch { Fail 'npm is not on PATH (should ship with Node).' }

$nodeMajor = [int]($nodeRaw.TrimStart('v').Split('.')[0])
$npmMajor  = [int]($npmRaw.Split('.')[0])
if ($nodeMajor -lt 18) { Fail "Node $nodeRaw detected. Need >= 18." }
if ($npmMajor  -lt 9)  { Fail "npm $npmRaw detected. Need >= 9." }
Ok "Node $nodeRaw, npm $npmRaw"

# --- 2. backend\.env ---
$envPath = Join-Path $backend '.env'
$existing = @{}
if (Test-Path $envPath) {
    Info "==> Found existing backend\.env — will keep any values already set"
    foreach ($line in Get-Content $envPath) {
        if ($line -match '^\s*([A-Z_]+)\s*=\s*"?([^"]*)"?\s*$') {
            $existing[$Matches[1]] = $Matches[2]
        }
    }
}

function PromptIfMissing($key, $label, $placeholderHint) {
    $val = $existing[$key]
    $isPlaceholder = $val -and ($val -match '\[PROJECT-REF\]|\[YOUR-PASSWORD\]|change-me')
    if (-not $val -or $isPlaceholder) {
        Write-Host ""
        Write-Host "  $label" -ForegroundColor Yellow
        if ($placeholderHint) { Write-Host "  Hint: $placeholderHint" -ForegroundColor DarkGray }
        $val = Read-Host "  $key"
        if (-not $val) { Fail "$key is required." }
    } else {
        Ok "  $key already set — keeping"
    }
    return $val
}

Info '==> Configuring backend\.env'
Write-Host "Open Supabase Dashboard -> Project Settings -> Database -> Connection string."
Write-Host "Copy the 'Transaction pooler' (port 6543) URI for DATABASE_URL, and the 'Session/direct' (port 5432) URI for DIRECT_URL."

$dbUrl    = PromptIfMissing 'DATABASE_URL' 'Supabase Transaction pooler URI (port 6543)' 'postgresql://postgres.xxx:PASSWORD@aws-0-xxx.pooler.supabase.com:6543/postgres?pgbouncer=true'
$directUrl= PromptIfMissing 'DIRECT_URL'   'Supabase direct URI (port 5432)'             'postgresql://postgres.xxx:PASSWORD@aws-0-xxx.pooler.supabase.com:5432/postgres'

$jwtSecret = $existing['JWT_SECRET']
if (-not $jwtSecret -or $jwtSecret -match 'change-me') {
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $jwtSecret = -join ($bytes | ForEach-Object { '{0:x2}' -f $_ })
    Ok "  JWT_SECRET generated"
} else {
    Ok "  JWT_SECRET already set — keeping"
}

$envContent = @"
DATABASE_URL="$dbUrl"
DIRECT_URL="$directUrl"

JWT_SECRET="$jwtSecret"
JWT_EXPIRES_IN="7d"

PORT=5000
CORS_ORIGIN="http://localhost:5173"
"@
Set-Content -Path $envPath -Value $envContent -Encoding utf8
Ok "Wrote backend\.env"

# --- 3. frontend\.env.local ---
$feEnv = Join-Path $frontend '.env.local'
if (-not (Test-Path $feEnv)) {
    Set-Content -Path $feEnv -Value "# Backend is proxied via vite.config.js — no value needed unless overriding.`n" -Encoding utf8
    Ok "Wrote frontend\.env.local (empty placeholder)"
} else {
    Ok "frontend\.env.local already exists — keeping"
}

# --- 4. Backend install + migrate + seed ---
Info '==> Installing backend dependencies'
Push-Location $backend
try {
    npm install
    if ($LASTEXITCODE -ne 0) { Fail 'backend npm install failed' }

    Info '==> Applying Prisma migrations'
    npx prisma migrate deploy
    if ($LASTEXITCODE -ne 0) { Fail 'prisma migrate deploy failed — check DIRECT_URL (must be port 5432, not 6543)' }

    Info '==> Generating Prisma client'
    npx prisma generate
    if ($LASTEXITCODE -ne 0) { Write-Host 'WARN: prisma generate failed (often a stale dev-server lock on Windows). Re-run after closing any running backend.' -ForegroundColor Yellow }

    Info '==> Seeding team + role-tester accounts'
    npm run seed
    if ($LASTEXITCODE -ne 0) { Fail 'seed failed' }
} finally { Pop-Location }

# --- 5. Frontend install ---
Info '==> Installing frontend dependencies'
Push-Location $frontend
try {
    npm install
    if ($LASTEXITCODE -ne 0) { Fail 'frontend npm install failed' }
} finally { Pop-Location }

# --- Done ---
Write-Host ""
Ok '============================================================'
Ok ' Setup complete.'
Ok '============================================================'
Write-Host ""
Write-Host 'Start the system:' -ForegroundColor Cyan
Write-Host '  Terminal 1:  cd backend  ; npm run dev'
Write-Host '  Terminal 2:  cd frontend ; npm run dev'
Write-Host ''
Write-Host 'Then open  http://localhost:5173'
Write-Host ''
Write-Host 'Test accounts are listed in RUN.md (default password Cics#2026).'
