# Node.js Version Fix for GitHub Pages Deployment

## Problem

The GitHub Pages deployment was failing with the following error:

```
error react-router-dom@7.12.0: The engine "node" is incompatible with this module. Expected version ">=20.0.0". Got "18.20.8"
```

## Root Cause

The project uses `react-router-dom@7.5.1` (as shown in `frontend/package.json`), which requires Node.js version 20 or higher. However, the GitHub Actions workflow was configured to use Node.js version 18.

## Solution

Updated the GitHub Actions workflow file (`.github/workflows/deploy.yml`) to use Node.js version 20 instead of version 18.

**Changed:**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'  # ❌ Old version
```

**To:**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # ✅ New version
```

## CORS Configuration (Verified)

The backend CORS configuration has been previously fixed and verified to be correct:

- **Location:** `backend/.env`
- **Configuration:**
  ```
  CORS_ORIGINS="https://saisrikiran25-ctrl.github.io,http://localhost:3000,https://prompt-forge-28.preview.emergentagent.com"
  ```
- **Status:** ✅ Properly configured to allow requests from GitHub Pages

## Testing

To verify the fix works:

1. Merge this PR to trigger the deployment workflow
2. Monitor the workflow at: https://github.com/saisrikiran25-ctrl/app/actions
3. Deployment should complete successfully without Node version errors
4. Access the deployed app at: https://saisrikiran25-ctrl.github.io/app

## Impact

This is a minimal change that only affects the deployment environment. It does not modify any application code, only the CI/CD configuration.

- **Files Changed:** 1 (`.github/workflows/deploy.yml`)
- **Lines Changed:** 1 (Node version specification)
- **Risk Level:** Low (configuration change only)
- **Backwards Compatibility:** No impact on existing functionality

## Related Documentation

- **Deployment Guide:** See `HOW_TO_DEPLOY.md` for full deployment instructions
- **CORS Setup:** See `CORS_FIX_GUIDE.md` and `backend/CORS_SETUP.md` for CORS documentation
- **Build Configuration:** See `DEPLOYMENT_SUMMARY.md` for deployment overview

## Security Summary

- ✅ No security vulnerabilities introduced
- ✅ CodeQL security scan passed with no alerts
- ✅ Code review completed with no issues
- ✅ CORS configuration properly restricts allowed origins

## Next Steps

1. Merge this PR
2. GitHub Actions will automatically deploy to GitHub Pages
3. Verify the deployed application works correctly
4. Ensure backend is deployed with the updated CORS configuration
