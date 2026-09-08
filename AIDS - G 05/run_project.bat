@echo off
title AI Lab GPU and Workstation Reservation System - Launcher

echo ===============================================================================
echo        AI LAB GPU AND WORKSTATION TIME-SLOT RESERVATION SYSTEM
echo                    Full-Stack Capstone Project Launcher
echo ===============================================================================
echo.

set "PROJECT_ROOT=%~dp0"
cd /d "%PROJECT_ROOT%"

:: ===============================================================================
:: STEP 1: CHECK JAVA
:: ===============================================================================
echo [1/5] Checking Java Installation...

java -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java is not installed or not found in system PATH.
    echo         Spring Boot 3 requires Java 17 or newer.
    echo         Download: https://adoptium.net/temurin/releases/
    echo.
    echo Proceeding to launch frontend in standalone mode...
    goto :OPEN_FRONTEND
)

echo [OK] Java runtime detected.

:: ===============================================================================
:: STEP 2: CHECK MYSQL ON PORT 3306
:: ===============================================================================
echo.
echo [2/5] Checking MySQL Service on Port 3306...

powershell -NoProfile -Command "try { $c = New-Object System.Net.Sockets.TcpClient; $c.Connect('127.0.0.1', 3306); $c.Close(); exit 0 } catch { exit 1 }" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] MySQL is active and listening on port 3306.
) else (
    echo [NOTICE] MySQL service is not listening on port 3306.
    echo          If you have XAMPP or MySQL installed, please start MySQL service.
    echo          Database: ai_lab_reservation - User: root
    echo.
    echo          Note: The frontend includes intelligent local simulation mode,
    echo          allowing you to test all reservation flows immediately!
)

:: ===============================================================================
:: STEP 3 & 4: BUILD AND RUN BACKEND (IF MAVEN IS PRESENT)
:: ===============================================================================
echo.
echo [3/5] Checking Backend Build Tools...

where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Maven detected. Starting Spring Boot Application...
    echo [4/5] Starting Backend on http://localhost:8080...
    start "AI Lab Backend - Spring Boot" cmd /k "cd /d "%PROJECT_ROOT%backend" && mvn spring-boot:run"
    timeout /t 5 /nobreak >nul
) else (
    echo [NOTICE] Maven CLI mvn is not installed in system PATH.
    echo          To run the Spring Boot backend directly:
    echo          1. Open the backend folder in VS Code or IntelliJ IDEA and click Run.
    echo          2. Or install Apache Maven: https://maven.apache.org/download.cgi
    echo          Skipping automated backend build.
)

:: ===============================================================================
:: STEP 5: OPEN FRONTEND
:: ===============================================================================
:OPEN_FRONTEND
echo.
echo [5/5] Launching Frontend Interface...

where npx >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Starting static web server on http://localhost:5500...
    start "AI Lab Frontend - Static Server" cmd /k "cd /d "%PROJECT_ROOT%frontend" && npx --yes serve -l 5500"
    timeout /t 2 /nobreak >nul
    start http://localhost:5500
) else (
    echo Opening frontend directly in default web browser...
    start "" "%PROJECT_ROOT%frontend\index.html"
)

echo.
echo ===============================================================================
echo   APPLICATION LAUNCH COMPLETED
echo ===============================================================================
echo   1. Student and Lab Assistant Portal: http://localhost:5500
echo   2. Backend REST API:                 http://localhost:8080/api/workstations
echo   3. Technical Presentation:           presentation\index.html
echo   4. Master Runbook Documentation:     docs\RUNBOOK.md
echo ===============================================================================
echo.
pause
