# Instructions to Push to GitHub

## Step 1: Create the Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `kanban`
3. Choose Public or Private
4. **Do NOT** check "Initialize this repository with a README"
5. Click "Create repository"

## Step 2: Push Your Code

### Option A: Using the PowerShell Script

Run this command (replace `YOUR_USERNAME` with your GitHub username):
```powershell
.\push-to-github.ps1 -GitHubUsername YOUR_USERNAME
```

### Option B: Manual Commands

Run these commands (replace `YOUR_USERNAME` with your GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/kanban.git
git branch -M main
git push -u origin main
```

## Done!

Your repository will be available at: `https://github.com/YOUR_USERNAME/kanban`

