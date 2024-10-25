@echo off
echo Installing Windows Service...

:: Node.jsのインストールチェック
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js first.
    exit /b 1
)

:: pm2のインストール
call npm install pm2 -g
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install pm2
    exit /b 1
)

:: pm2をWindowsサービスとして登録
call pm2 start ecosystem.config.js
call pm2 save
call pm2-service-install -n "AicoAdmin"

echo Service installation completed!
echo The application will start automatically when Windows starts.