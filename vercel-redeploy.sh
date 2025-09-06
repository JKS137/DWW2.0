#!/bin/bash

# Vercel Redeploy Script
# This script forces Vercel to redeploy by making a small change, committing it, and pushing it to the repository

# Configuration
REPO_PATH="$(pwd)"  # Current directory
TEMP_FILE_NAME="vercel-redeploy-trigger.txt"
COMMIT_MESSAGE="Force Vercel redeploy"
REVERT_COMMIT_MESSAGE="Revert temporary change for Vercel redeploy"

# Text colors
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
CYAN="\033[0;36m"
MAGENTA="\033[0;35m"
NC="\033[0m" # No Color

# Function to check if git is installed
check_git_installed() {
    if ! command -v git &> /dev/null; then
        echo -e "${RED}Git is not installed. Please install Git and try again.${NC}"
        return 1
    else
        echo -e "${GREEN}Git is installed: $(git --version)${NC}"
        return 0
    fi
}

# Function to check if the directory is a git repository
check_git_repository() {
    if [ ! -d "$REPO_PATH/.git" ]; then
        echo -e "${RED}The current directory is not a Git repository.${NC}"
        return 1
    fi
    return 0
}

# Function to check if there are uncommitted changes
check_uncommitted_changes() {
    local status=$(git -C "$REPO_PATH" status --porcelain)
    if [ -n "$status" ]; then
        echo -e "${YELLOW}There are uncommitted changes in the repository:${NC}"
        git -C "$REPO_PATH" status --short
        read -p "Do you want to proceed anyway? (y/n): " proceed
        if [ "$proceed" != "y" ]; then
            echo -e "${YELLOW}Operation cancelled.${NC}"
            return 1
        fi
    fi
    return 0
}

# Function to create a temporary file change
create_temp_change() {
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    local content="Vercel redeploy trigger - $timestamp"
    
    local file_path="$REPO_PATH/$TEMP_FILE_NAME"
    echo "$content" > "$file_path"
    
    echo -e "${CYAN}Created temporary file: $file_path${NC}"
    echo "$file_path"
}

# Function to commit and push changes
commit_and_push() {
    local message="$1"
    
    git -C "$REPO_PATH" add .
    git -C "$REPO_PATH" commit -m "$message"
    
    echo -e "${CYAN}Pushing changes to remote repository...${NC}"
    if git -C "$REPO_PATH" push; then
        echo -e "${GREEN}Successfully pushed changes to remote repository.${NC}"
        return 0
    else
        echo -e "${RED}Failed to push changes to remote repository.${NC}"
        return 1
    fi
}

# Function to remove the temporary file
remove_temp_file() {
    local file_path="$1"
    
    if [ -f "$file_path" ]; then
        rm "$file_path"
        echo -e "${CYAN}Removed temporary file: $file_path${NC}"
        return 0
    fi
    return 1
}

# Main execution
echo -e "${MAGENTA}=== Vercel Redeploy Script ===${NC}"

# Check prerequisites
if ! check_git_installed; then exit 1; fi
if ! check_git_repository; then exit 1; fi
if ! check_uncommitted_changes; then exit 1; fi

# Step 1: Create temporary change
temp_file_path=$(create_temp_change)

# Step 2: Commit and push the change
echo -e "${CYAN}Committing and pushing temporary change...${NC}"
if ! commit_and_push "$COMMIT_MESSAGE"; then
    echo -e "${RED}Failed to commit and push temporary change. Cleaning up...${NC}"
    remove_temp_file "$temp_file_path"
    exit 1
fi

# Step 3: Wait for Vercel to detect the change
echo -e "${CYAN}Waiting for Vercel to detect the change (10 seconds)...${NC}"
sleep 10

# Step 4: Remove the temporary file
remove_temp_file "$temp_file_path"

# Step 5: Commit and push the revert
echo -e "${CYAN}Committing and pushing revert...${NC}"
if ! commit_and_push "$REVERT_COMMIT_MESSAGE"; then
    echo -e "${RED}Failed to commit and push revert. You may need to manually remove the temporary file.${NC}"
    exit 1
fi

echo -e "${GREEN}=== Vercel Redeploy Process Completed ===${NC}"
echo -e "${GREEN}Vercel should now be rebuilding your project with the latest changes.${NC}"