# PowerShell script to push to GitHub
# Make sure you've created the repository at https://github.com/new first

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername
)

Write-Host "Setting up remote and pushing to GitHub..." -ForegroundColor Green

# Add remote
git remote add origin "https://github.com/$GitHubUsername/kanban.git"

# Rename branch to main (if needed)
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    git branch -M main
    Write-Host "Renamed branch to 'main'" -ForegroundColor Yellow
}

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host "Done! Your repository is available at: https://github.com/$GitHubUsername/kanban" -ForegroundColor Green

