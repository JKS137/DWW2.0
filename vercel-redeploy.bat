@echo off
setlocal enabledelayedexpansion

rem Vercel Redeploy Script
rem This script forces Vercel to redeploy by making a small change, committing it, and pushing it to the repository

rem Configuration
set REPO_PATH=%~dp0
set TEMP_FILE_NAME=vercel-redeploy-trigger.txt
set COMMIT_MESSAGE=Force Vercel redeploy
set REVERT_COMMIT_MESSAGE=Revert temporary change for Vercel redeploy

rem Text formatting
set GREEN=[92m
set YELLOW=[93m
set RED=[91m
set CYAN=[96m
set MAGENTA=[95m
set NC=[0m

echo %MAGENTA%=== Vercel Redeploy Script ===%NC%

rem Check if git is installed
git --version > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo %RED%Git is not installed. Please install Git and try again.%NC%
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
    echo %GREEN%Git is installed: !GIT_VERSION!%NC%
)

rem Check if the directory is a git repository
if not exist "%REPO_PATH%.git" (
    echo %RED%The current directory is not a Git repository.%NC%
    exit /b 1
)

rem Check if there are uncommitted changes
for /f "tokens=*" %%i in ('git -C "%REPO_PATH%" status --porcelain') do set GIT_STATUS=%%i
if defined GIT_STATUS (
    echo %YELLOW%There are uncommitted changes in the repository:%NC%
    git -C "%REPO_PATH%" status --short
    set /p PROCEED=Do you want to proceed anyway? (y/n): 
    if /i "!PROCEED!" neq "y" (
        echo %YELLOW%Operation cancelled.%NC%
        exit /b 1
    )
)

rem Create temporary file change
set TIMESTAMP=%date% %time%
set TEMP_FILE_PATH=%REPO_PATH%%TEMP_FILE_NAME%
echo Vercel redeploy trigger - %TIMESTAMP% > "%TEMP_FILE_PATH%"
echo %CYAN%Created temporary file: %TEMP_FILE_PATH%%NC%

rem Commit and push the change
echo %CYAN%Committing and pushing temporary change...%NC%
git -C "%REPO_PATH%" add .
git -C "%REPO_PATH%" commit -m "%COMMIT_MESSAGE%"

echo %CYAN%Pushing changes to remote repository...%NC%
git -C "%REPO_PATH%" push
if %ERRORLEVEL% neq 0 (
    echo %RED%Failed to push changes to remote repository.%NC%
    if exist "%TEMP_FILE_PATH%" del "%TEMP_FILE_PATH%"
    exit /b 1
) else (
    echo %GREEN%Successfully pushed changes to remote repository.%NC%
)

rem Wait for Vercel to detect the change
echo %CYAN%Waiting for Vercel to detect the change (10 seconds)...%NC%
timeout /t 10 /nobreak > nul

rem Remove the temporary file
if exist "%TEMP_FILE_PATH%" (
    del "%TEMP_FILE_PATH%"
    echo %CYAN%Removed temporary file: %TEMP_FILE_PATH%%NC%
)

rem Commit and push the revert
echo %CYAN%Committing and pushing revert...%NC%
git -C "%REPO_PATH%" add .
git -C "%REPO_PATH%" commit -m "%REVERT_COMMIT_MESSAGE%"

echo %CYAN%Pushing revert to remote repository...%NC%
git -C "%REPO_PATH%" push
if %ERRORLEVEL% neq 0 (
    echo %RED%Failed to push revert to remote repository. You may need to manually remove the temporary file.%NC%
    exit /b 1
) else (
    echo %GREEN%Successfully pushed revert to remote repository.%NC%
)

echo %GREEN%=== Vercel Redeploy Process Completed ===%NC%
echo %GREEN%Vercel should now be rebuilding your project with the latest changes.%NC%

endlocal