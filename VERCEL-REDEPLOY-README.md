# Vercel Redeploy Scripts

These scripts help force Vercel to redeploy your application by making a small change to your repository, pushing it, and then reverting the change. This is useful when you want to ensure Vercel picks up the latest changes that have been pushed to your repository.

## Available Scripts

Choose the script that matches your operating system:

- **Windows PowerShell**: `vercel-redeploy.ps1`
- **Windows Batch**: `vercel-redeploy.bat`
- **Linux/macOS**: `vercel-redeploy.sh`

## How It Works

All scripts follow the same process:

1. Check if Git is installed and if the current directory is a Git repository
2. Check for uncommitted changes (with option to proceed anyway)
3. Create a temporary file with a timestamp
4. Commit and push the temporary file
5. Wait for Vercel to detect the change (10 seconds)
6. Remove the temporary file
7. Commit and push the removal

This process creates two commits:
- First commit: "Force Vercel redeploy"
- Second commit: "Revert temporary change for Vercel redeploy"

These commits trigger Vercel's automatic deployment system without making any permanent changes to your codebase.

## Usage Instructions

### Windows PowerShell

```powershell
# Navigate to your repository
cd path/to/your/repo

# Run the script
.\vercel-redeploy.ps1
```

### Windows Batch

```batch
# Navigate to your repository
cd path/to/your/repo

# Run the script
vercel-redeploy.bat
```

### Linux/macOS

```bash
# Navigate to your repository
cd path/to/your/repo

# Make the script executable (first time only)
chmod +x ./vercel-redeploy.sh

# Run the script
./vercel-redeploy.sh
```

## Requirements

- Git must be installed and configured
- You must have push access to the repository
- The repository must be connected to Vercel for automatic deployments

## Troubleshooting

### Push Failed

If the push fails, the script will attempt to clean up by removing the temporary file. You may need to:

1. Check your Git credentials
2. Ensure you have the correct permissions to push to the repository
3. Check if there are any network issues

### Vercel Not Deploying

If Vercel doesn't start a new deployment after running the script:

1. Verify that automatic deployments are enabled in your Vercel project settings
2. Check if the repository is correctly connected to your Vercel project
3. Try increasing the wait time in the script (change the sleep/timeout value)

## Notes

- These scripts create actual commits in your repository history
- The scripts will ask for confirmation if there are uncommitted changes
- You can safely run these scripts multiple times if needed