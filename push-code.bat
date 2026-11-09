@echo off
chcp 65001 >nul
echo ======================================================================
echo [1/3] Running Syntax Check & Pre-Flight Test Suite...
echo ======================================================================
node -c app.js
if %errorlevel% neq 0 (
  echo [ERROR] Syntax error in app.js! Aborting push.
  exit /b 1
)
node -e "const fs=require('fs'),vm=require('vm'); new vm.Script(fs.readFileSync('Code.gs','utf8'),{filename:'Code.gs'}); console.log('Code.gs syntax OK');"
if %errorlevel% neq 0 (
  echo [ERROR] Syntax error in Code.gs! Aborting push.
  exit /b 1
)
node test-suite.js
if %errorlevel% neq 0 (
  echo [ERROR] Pre-Flight Test Suite failed! Aborting push.
  exit /b 1
)

echo.
echo ======================================================================
echo [2/3] Staging & Committing Changes to Git...
echo ======================================================================
set COMMIT_MSG=%~1
if "%COMMIT_MSG%"=="" set COMMIT_MSG=chore: update ICT Task & Project Manager (Verified by Pre-Flight Test)

git add .
git commit -m "%COMMIT_MSG%"

echo.
echo ======================================================================
echo [3/3] Pushing to Remote Git Repository...
echo ======================================================================
git push
if exist ".clasp.json" (
  echo Found .clasp.json - Pushing backend files to Google Apps Script...
  node push-gas.js
)
echo Done!
