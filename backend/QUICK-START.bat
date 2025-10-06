@echo off
echo ========================================
echo Capital City Contractors CRM Backend
echo Quick Start Script
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo Step 2: Checking for .env file...
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo WARNING: Please edit .env and change JWT_SECRET!
    echo.
)

echo Step 3: Initializing database...
call npm run init-db
if errorlevel 1 (
    echo ERROR: Failed to initialize database
    pause
    exit /b 1
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Default Login:
echo   Username: admin
echo   Password: Coolguy1!
echo.
echo Starting server...
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
pause

call npm start

