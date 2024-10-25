@echo off
echo Installing dependencies...
call npm install

echo Creating required directories...
mkdir data 2>nul
mkdir uploads 2>nul
mkdir logs 2>nul

echo Copying environment file...
copy .env.example .env 2>nul

echo Building application...
call npm run build

echo Installation complete!
echo You can now start the application using:
echo   Development: dev.bat
echo   Production: start.bat