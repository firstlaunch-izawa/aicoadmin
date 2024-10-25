# Windows Defenderの除外設定を追加
$appPath = (Get-Location).Path
$uploadPath = Join-Path $appPath "uploads"
$dataPath = Join-Path $appPath "data"

# フォルダの除外を追加
Add-MpPreference -ExclusionPath $appPath
Add-MpPreference -ExclusionPath $uploadPath
Add-MpPreference -ExclusionPath $dataPath

# プロセスの除外を追加
Add-MpPreference -ExclusionProcess "node.exe"
Add-MpPreference -ExclusionProcess "pm2.exe"

Write-Host "Windows Defender exclusions have been set up successfully!"