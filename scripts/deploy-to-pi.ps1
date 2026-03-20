param(
    [string]$PiHost = "10.32.48.184",
    [string]$PiUser = "ad123645",
    [string]$TargetDir = "/var/www/html",
    [switch]$SkipBuild
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
Set-Location $ProjectRoot

$Remote = "$PiUser@$PiHost"
$DistDir = Join-Path $ProjectRoot "dist"
$TarPath = Join-Path $ProjectRoot "dist.tar"
$RemoteScriptLocal = Join-Path $ProjectRoot "remote-deploy.sh"

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

if (Test-Path $TarPath) {
    Remove-Item $TarPath -Force
}

Write-Host "==> Creating dist.tar..." -ForegroundColor Cyan
tar -cf $TarPath -C $DistDir .
if ($LASTEXITCODE -ne 0) {
    throw "Failed to create dist.tar"
}

$RemoteScript = @"
#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="$TargetDir"

echo "==> Checking free space..."
df -h /

echo "==> Preparing staging..."
mkdir -p ~/deploy-staging
rm -rf ~/deploy-staging/*

echo "==> Extracting tar to staging..."
tar -xf ~/dist.tar -C ~/deploy-staging

echo "==> Verifying staging content..."
find ~/deploy-staging | wc -l
du -sh ~/deploy-staging

echo "==> Syncing to target..."
sudo mkdir -p "$TargetDir"
sudo rsync -a --delete ~/deploy-staging/ "$TargetDir"/

echo "==> Fixing ownership..."
sudo chown -R www-data:www-data "$TargetDir"

echo "==> Reloading nginx..."
sudo systemctl reload nginx

echo "==> Cleaning up..."
rm -f ~/dist.tar
rm -rf ~/deploy-staging

echo "==> Done."
"@

# 关键：强制写成 Unix LF，避免 CRLF 把 bash 弄坏
$RemoteScript = $RemoteScript -replace "`r`n", "`n"
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($RemoteScriptLocal, $RemoteScript, $Utf8NoBom)

Write-Host "==> Uploading dist.tar..." -ForegroundColor Cyan
scp $TarPath "${Remote}:~/dist.tar"
if ($LASTEXITCODE -ne 0) {
    throw "Failed to upload dist.tar"
}

Write-Host "==> Uploading remote deploy script..." -ForegroundColor Cyan
scp $RemoteScriptLocal "${Remote}:~/remote-deploy.sh"
if ($LASTEXITCODE -ne 0) {
    throw "Failed to upload remote deploy script"
}

Write-Host "==> Deploying on Raspberry Pi..." -ForegroundColor Cyan
ssh $Remote "chmod +x ~/remote-deploy.sh && bash ~/remote-deploy.sh && rm -f ~/remote-deploy.sh"
if ($LASTEXITCODE -ne 0) {
    throw "Remote deployment failed."
}

if (Test-Path $TarPath) {
    Remove-Item $TarPath -Force
}
if (Test-Path $RemoteScriptLocal) {
    Remove-Item $RemoteScriptLocal -Force
}

Write-Host ""
Write-Host "Deployment succeeded." -ForegroundColor Green
Write-Host "Live URL: https://blog.zhehentiaohe.cn" -ForegroundColor Green