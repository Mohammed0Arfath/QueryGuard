@echo off
REM Medical Query Firewall - Netlify Deployment Script (Windows)
REM This script builds and deploys your app to Netlify

echo.
echo ========================================================
echo    Medical Query Firewall - Netlify Deployment
echo ========================================================
echo.

REM Check if Netlify CLI is installed
where netlify >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Netlify CLI not found!
    echo [INFO] Installing Netlify CLI...
    call npm install -g netlify-cli
    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] Netlify CLI installed!
    ) else (
        echo [ERROR] Failed to install Netlify CLI
        exit /b 1
    )
    echo.
)

REM Build the project
echo [BUILD] Building project...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Build successful!
    echo.
) else (
    echo [ERROR] Build failed! Please check the errors above.
    exit /b 1
)

REM Check if dist folder exists
if not exist "dist" (
    echo [ERROR] dist folder not found! Build may have failed.
    exit /b 1
)

echo [INFO] Build output ready in dist/
echo.

REM Ask user which deployment option they want
echo Choose deployment option:
echo 1. Deploy to production (netlify deploy --prod)
echo 2. Deploy preview/draft (netlify deploy)
echo 3. Initialize new site (netlify init)
echo.
set /p choice="Enter choice (1-3): "

if "%choice%"=="1" (
    echo [DEPLOY] Deploying to PRODUCTION...
    call netlify deploy --prod
) else if "%choice%"=="2" (
    echo [DEPLOY] Deploying PREVIEW...
    call netlify deploy
) else if "%choice%"=="3" (
    echo [INIT] Initializing new site...
    call netlify init
) else (
    echo [ERROR] Invalid choice. Exiting.
    exit /b 1
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Deployment successful!
    echo [INFO] Your site is now live!
    echo.
    echo Next steps:
    echo    1. Set environment variables in Netlify dashboard
    echo    2. Configure your backend URL (REACT_APP_API_BASE)
    echo    3. Update CORS settings in backend to allow Netlify domain
    echo    4. Test your deployed app!
) else (
    echo.
    echo [ERROR] Deployment failed! Please check the errors above.
    exit /b 1
)

pause
