# Vercel Redeploy Script
# This script forces Vercel to redeploy by making a small change, committing it, and pushing it to the repository

# Configuration
$repoPath = $PSScriptRoot  # Current directory where the script is located
$tempFileName = "vercel-redeploy-trigger.txt"
$commitMessage = "Force Vercel redeploy"
$revertCommitMessage = "Revert temporary change for Vercel redeploy"

# Function to check if git is installed
function Check-GitInstalled {
    try {
        $gitVersion = git --version
        Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "Git is not installed. Please install Git and try again." -ForegroundColor Red
        return $false
    }
}

# Function to check if the directory is a git repository
function Check-GitRepository {
    if (-not (Test-Path -Path "$repoPath\.git")) {
        Write-Host "The current directory is not a Git repository." -ForegroundColor Red
        return $false
    }
    return $true
}

# Function to check if there are uncommitted changes
function Check-UncommittedChanges {
    $status = git -C $repoPath status --porcelain
    if ($status) {
        Write-Host "There are uncommitted changes in the repository:" -ForegroundColor Yellow
        git -C $repoPath status --short
        $proceed = Read-Host "Do you want to proceed anyway? (y/n)"
        if ($proceed -ne "y") {
            Write-Host "Operation cancelled." -ForegroundColor Yellow
            return $false
        }
    }
    return $true
}

# Function to create a temporary file change
function Create-TempChange {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $content = "Vercel redeploy trigger - $timestamp"
    
    $filePath = Join-Path -Path $repoPath -ChildPath $tempFileName
    $content | Out-File -FilePath $filePath -Encoding utf8
    
    Write-Host "Created temporary file: $filePath" -ForegroundColor Cyan
    return $filePath
}

# Function to commit and push changes
function Commit-AndPush {
    param (
        [string]$message
    )
    
    git -C $repoPath add .
    git -C $repoPath commit -m "$message"
    
    Write-Host "Pushing changes to remote repository..." -ForegroundColor Cyan
    $pushResult = git -C $repoPath push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully pushed changes to remote repository." -ForegroundColor Green
        return $true
    } else {
        Write-Host "Failed to push changes to remote repository." -ForegroundColor Red
        Write-Host $pushResult -ForegroundColor Red
        return $false
    }
}

# Function to remove the temporary file
function Remove-TempFile {
    param (
        [string]$filePath
    )
    
    if (Test-Path -Path $filePath) {
        Remove-Item -Path $filePath
        Write-Host "Removed temporary file: $filePath" -ForegroundColor Cyan
        return $true
    }
    return $false
}

# Main execution
Write-Host "=== Vercel Redeploy Script ===" -ForegroundColor Magenta

# Check prerequisites
if (-not (Check-GitInstalled)) { exit 1 }
if (-not (Check-GitRepository)) { exit 1 }
if (-not (Check-UncommittedChanges)) { exit 1 }

# Step 1: Create temporary change
$tempFilePath = Create-TempChange

# Step 2: Commit and push the change
Write-Host "Committing and pushing temporary change..." -ForegroundColor Cyan
if (-not (Commit-AndPush -message $commitMessage)) {
    Write-Host "Failed to commit and push temporary change. Cleaning up..." -ForegroundColor Red
    Remove-TempFile -filePath $tempFilePath
    exit 1
}

# Step 3: Wait for Vercel to detect the change
Write-Host "Waiting for Vercel to detect the change (10 seconds)..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Step 4: Remove the temporary file
Remove-TempFile -filePath $tempFilePath

# Step 5: Commit and push the revert
Write-Host "Committing and pushing revert..." -ForegroundColor Cyan
if (-not (Commit-AndPush -message $revertCommitMessage)) {
    Write-Host "Failed to commit and push revert. You may need to manually remove the temporary file." -ForegroundColor Red
    exit 1
}

Write-Host "=== Vercel Redeploy Process Completed ===" -ForegroundColor Green
Write-Host "Vercel should now be rebuilding your project with the latest changes." -ForegroundColor Green