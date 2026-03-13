# 🚀 GitHub Pages Deployment Guide

## Step-by-Step Instructions

### 1. Configure Git (First Time Only)
Open Command Prompt in your Weather app folder and run:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### 2. Initialize Git Repository
```bash
git init
```

### 3. Add All Files
```bash
git add .
```

### 4. Commit Files
```bash
git commit -m "Initial commit - Weather App"
```

### 5. Create GitHub Repository
1. Go to https://github.com
2. Click "+" icon (top right) → "New repository"
3. Repository name: `weather-app` (or any name you want)
4. Keep it PUBLIC
5. DON'T check "Initialize with README"
6. Click "Create repository"

### 6. Connect Local to GitHub
Copy the commands from GitHub (they will look like this):

```bash
git remote add origin https://github.com/YOUR-USERNAME/weather-app.git
git branch -M main
git push -u origin main
```

Replace YOUR-USERNAME with your actual GitHub username.

### 7. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" (left sidebar)
4. Under "Source", select "main" branch
5. Click "Save"
6. Wait 2-3 minutes

### 8. Your App is Live! 🎉
Your app will be available at:
```
https://YOUR-USERNAME.github.io/weather-app/
```

## Quick Commands (All in One)

Open Command Prompt in "Weather app" folder and run these one by one:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git
git push -u origin main
```

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git
```

### Error: "failed to push"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Update Your Live Site (After Making Changes)
```bash
git add .
git commit -m "Updated weather app"
git push
```

Wait 1-2 minutes and your changes will be live!

## Important Notes

⚠️ **Don't forget to add your API key in script.js before deploying!**

⚠️ **Make sure repository is PUBLIC for GitHub Pages to work (free)**

✅ **Your app will be live at: https://YOUR-USERNAME.github.io/REPO-NAME/**

## Need Help?

- Check if Git is installed: `git --version`
- Check if you're in the right folder: `dir` (should show index.html)
- Make sure you're logged into GitHub in your browser
