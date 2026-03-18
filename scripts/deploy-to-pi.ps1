param(
    [string]$PiHost = "ad123645.local",
    [string]$PiUser = "ad123645",
    [string]$TargetDir = "/var/www/html",
    [string]$BackupBase = "/home/ad123645/site-backups",
    [switch]$SkipBuild
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
Set-Location $ProjectRoot

$Remote = "$PiUser@$PiHost"
$DistDir = Join-Path $ProjectRoot "dist"
$TmpDir = Join-Path $ProjectRoot ".deploy_tmp"

New-Item -ItemType Directory -Force -Path $TmpDir | Out-Null

if (-not $SkipBuild) {
    Write-Host "==> Building site..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed."
    }
}

if (-not (Test-Path $DistDir)) {
    throw "dist folder not found. Run npm run build first."
}

$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$ArchiveName = "dist-$Stamp.tar.gz"
$ArchivePath = Join-Path $TmpDir $ArchiveName
$RemoteArchivePath = "/home/$PiUser/$ArchiveName"

if (Test-Path $ArchivePath) {
    Remove-Item $ArchivePath -Force
}

Write-Host "==> Creating archive..." -ForegroundColor Cyan
tar -czf $ArchivePath -C $DistDir .
if ($LASTEXITCODE -ne 0) {
    throw "Archive creation failed."
}

Write-Host "==> Uploading archive..." -ForegroundColor Cyan
scp $ArchivePath "${Remote}:$RemoteArchivePath"
if ($LASTEXITCODE -ne 0) {
    throw "Archive upload failed."
}

$RemoteScript = @'
set -euo pipefail

TAR_PATH="$1"
TARGET_DIR="$2"
BACKUP_BASE="$3"

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
STAGING_DIR="$(mktemp -d)"
BACKUP_DIR=""

cleanup() {
  rm -rf "$STAGING_DIR"
}
trap cleanup EXIT

mkdir -p "$BACKUP_BASE"

echo "==> Extracting archive..."
tar -xzf "$TAR_PATH" -C "$STAGING_DIR"

if [ -d "$TARGET_DIR" ] && [ -n "$(find "$TARGET_DIR" -mindepth 1 -maxdepth 1 -print -quit 2>/dev/null)" ]; then
  BACKUP_DIR="$BACKUP_BASE/site-$TIMESTAMP"
  mkdir -p "$BACKUP_DIR"
  echo "==> Backing up current site to $BACKUP_DIR"
  sudo rsync -a --ignore-errors "$TARGET_DIR"/ "$BACKUP_DIR"/ || echo "Backup had some missing files, continuing..."
fi

echo "==> Replacing site files..."
sudo mkdir -p "$TARGET_DIR"
sudo find "$TARGET_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +

echo "==> Copying new site..."
sudo rsync -a "$STAGING_DIR"/ "$TARGET_DIR"/
sudo chown -R www-data:www-data "$TARGET_DIR"

echo "==> Fixing permissions..."
sudo find "$TARGET_DIR" -type d -exec chmod 755 {} \;
sudo find "$TARGET_DIR" -type f -exec chmod 644 {} \;

echo "==> Reloading nginx..."
sudo systemctl reload nginx

echo "==> Cleaning up..."
rm -f "$TAR_PATH"

echo "Deployment complete."
if [ -n "$BACKUP_DIR" ]; then
  echo "Backup saved at: $BACKUP_DIR"
fi
'@

$RemoteScript = $RemoteScript -replace "`r`n", "`n"
$RemoteScriptB64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($RemoteScript))

Write-Host "==> Running remote deployment..." -ForegroundColor Cyan
ssh $Remote "printf '%s' '$RemoteScriptB64' | base64 -d | bash -s -- '$RemoteArchivePath' '$TargetDir' '$BackupBase'"
if ($LASTEXITCODE -ne 0) {
    throw "Remote deployment failed."
}

if (Test-Path $ArchivePath) {
    Remove-Item $ArchivePath -Force
}

Write-Host ""
Write-Host "Deployment succeeded." -ForegroundColor Green
Write-Host "Preview: http://$PiHost" -ForegroundColor Green