# GitHub Pages Deployment Setup

## Steps to Enable GitHub Pages

1. **Go to your repository settings:**
   - Navigate to: https://github.com/zpalevani/kanban/settings/pages

2. **Configure GitHub Pages:**
   - Source: Select **"GitHub Actions"** (not "Deploy from a branch")
   - This will use the workflow file in `.github/workflows/deploy.yml`

3. **Wait for the workflow to complete:**
   - Go to the "Actions" tab in your repository
   - You should see the "Deploy to GitHub Pages" workflow running
   - Wait for it to complete (usually takes 1-2 minutes)

4. **Access your site:**
   - Once deployed, your site will be available at:
   - **https://zpalevani.github.io/kanban/**

## Local Development

To run the app locally (without the `/kanban/` base path):

```bash
npm run dev
```

This will start the dev server at `http://localhost:5173`

## Production Build

To build for GitHub Pages:

```bash
npm run build
```

The build will automatically use `/kanban/` as the base path.

## Troubleshooting

If the page is blank:
1. Check the browser console for errors
2. Verify GitHub Pages is enabled and using "GitHub Actions" as the source
3. Check the Actions tab to see if the deployment workflow completed successfully
4. Make sure you're accessing the correct URL: `https://zpalevani.github.io/kanban/` (note the trailing slash)

