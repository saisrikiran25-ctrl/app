# GitHub Pages Deployment Guide

This guide will help you deploy your React application to GitHub Pages.

## Prerequisites

- Your code is hosted on GitHub repository: `saisrikiran25-ctrl/app`
- You have admin access to the repository

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository on GitHub: https://github.com/saisrikiran25-ctrl/app
2. Click on **Settings** (top navigation bar)
3. In the left sidebar, click on **Pages** (under "Code and automation")
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - This will allow the workflow to deploy your app automatically

### 2. Push Changes to Main Branch

The GitHub Actions workflow is configured to automatically build and deploy your app whenever you push to the `main` branch.

To trigger the first deployment:

```bash
# Merge your current changes to main branch
git checkout main
git merge copilot/modify-code-for-github-pages
git push origin main
```

Alternatively, you can manually trigger the workflow:
1. Go to the **Actions** tab in your repository
2. Click on "Deploy to GitHub Pages" workflow
3. Click "Run workflow" button
4. Select the `main` branch
5. Click "Run workflow"

### 3. Monitor Deployment

1. Go to the **Actions** tab in your repository
2. You should see a workflow run in progress
3. Click on it to see the build and deployment progress
4. Wait for both "build" and "deploy" jobs to complete (usually takes 2-3 minutes)

### 4. Access Your Deployed App

Once the deployment is complete, your app will be available at:

**https://saisrikiran25-ctrl.github.io/app**

## Important Notes

### Backend Configuration

Your app currently uses a backend API hosted at:
- `https://prompt-forge-28.preview.emergentagent.com`

This backend URL is configured in `frontend/.env`. The deployed app will continue to use this backend.

**Important:** Make sure your backend server:
1. Is running and accessible from the internet
2. Has CORS configured to allow requests from `https://saisrikiran25-ctrl.github.io`
3. Is hosted on a reliable platform (not just localhost)

If you need to change the backend URL, update the `REACT_APP_BACKEND_URL` in `frontend/.env` and redeploy.

### Automatic Deployments

The workflow is configured to automatically deploy whenever you push to the `main` branch. This means:
- Any changes merged to `main` will trigger a new deployment
- The deployment process is fully automated
- No manual intervention is required after the initial setup

### Troubleshooting

If the deployment fails:

1. **Check the workflow logs:**
   - Go to Actions tab
   - Click on the failed workflow run
   - Review the error messages

2. **Common issues:**
   - **Build errors:** Check that your app builds locally with `cd frontend && yarn build`
   - **Permission errors:** Ensure GitHub Pages is enabled with "GitHub Actions" as source
   - **Dependencies:** Make sure all dependencies are properly listed in `package.json`

3. **Test locally:**
   ```bash
   cd frontend
   yarn install
   yarn build
   # Serve the build folder to test
   npx serve -s build
   ```

### Custom Domain (Optional)

If you want to use a custom domain instead of `*.github.io`:

1. Add a `CNAME` file in `frontend/public/` with your domain name
2. Configure DNS settings with your domain provider
3. In repository Settings > Pages, add your custom domain

## Project Structure

```
app/
├── frontend/              # React application
│   ├── public/           # Static files
│   ├── src/              # React source code
│   ├── package.json      # Dependencies and scripts
│   └── .env              # Environment variables
├── backend/              # FastAPI backend (not deployed to GitHub Pages)
│   └── server.py         # Backend server
└── .github/
    └── workflows/
        └── deploy.yml    # GitHub Actions deployment workflow
```

## What Was Changed

1. **frontend/package.json**: Added `"homepage": "https://saisrikiran25-ctrl.github.io/app"` to configure the base URL
2. **.github/workflows/deploy.yml**: Created GitHub Actions workflow for automated deployment
3. **frontend/public/404.html**: Added 404 page to handle client-side routing (enables direct navigation to routes like /app/modes)
4. **frontend/public/index.html**: Added redirect script to restore proper routing when navigating directly to routes
5. **DEPLOYMENT_GUIDE.md**: This guide for reference

These changes ensure that React Router (BrowserRouter) works correctly on GitHub Pages by handling 404 errors from direct route navigation.

## Next Steps

1. Enable GitHub Pages in repository settings (see step 1 above)
2. Push/merge your changes to the `main` branch
3. Wait for the deployment to complete
4. Visit your app at https://saisrikiran25-ctrl.github.io/app
5. Test all functionality to ensure everything works correctly

## Support

If you encounter any issues:
- Check the GitHub Actions logs in the Actions tab
- Verify your backend is accessible and has proper CORS configuration
- Review the troubleshooting section above
- Ensure you've followed all setup steps correctly
