# Backend CORS Configuration

## Overview

This backend uses **FastAPI** with CORS (Cross-Origin Resource Sharing) middleware to allow requests from specific frontend origins.

## Current Configuration

The CORS origins are configured in the `.env` file:

```
CORS_ORIGINS="https://saisrikiran25-ctrl.github.io,http://localhost:3000,https://prompt-forge-28.preview.emergentagent.com"
```

### Allowed Origins:

1. **https://saisrikiran25-ctrl.github.io** - GitHub Pages deployment (Production)
2. **http://localhost:3000** - Local development server
3. **https://prompt-forge-28.preview.emergentagent.com** - Preview deployment

## How It Works

The CORS configuration is set up in `server.py` (lines 336-342):

```python
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
```

The `CORS_ORIGINS` environment variable is:
- Read from the `.env` file
- Split by commas to create a list of allowed origins
- Used by the CORS middleware to validate incoming requests

## Adding New Origins

To allow requests from additional origins:

1. Open `backend/.env`
2. Add the new origin to the `CORS_ORIGINS` variable (comma-separated):
   ```
   CORS_ORIGINS="origin1,origin2,origin3"
   ```
3. Restart the backend server

### Example:

To add a new staging environment:
```
CORS_ORIGINS="https://saisrikiran25-ctrl.github.io,http://localhost:3000,https://prompt-forge-28.preview.emergentagent.com,https://staging.example.com"
```

## Security Notes

- **Never use `*` (wildcard) in production** - It allows requests from any origin and is a security risk
- Only add origins that you control and trust
- Make sure to include the full URL with protocol (`https://` or `http://`)
- Don't include trailing slashes in origin URLs

## Troubleshooting CORS Errors

### Error: "No 'Access-Control-Allow-Origin' header is present"

**Cause:** The requesting origin is not in the allowed list.

**Solution:** Add the origin to `CORS_ORIGINS` in `.env`

### Error: "CORS policy: The request client is not a secure context"

**Cause:** Trying to make requests from HTTP to HTTPS or vice versa.

**Solution:** Ensure both frontend and backend use the same protocol (preferably HTTPS in production)

### Error: "Credentials flag is true, but Access-Control-Allow-Credentials is not"

**Cause:** The backend is not configured to allow credentials.

**Solution:** The current setup already has `allow_credentials=True`, so this shouldn't occur.

## Testing CORS Configuration

After updating the CORS settings:

1. **Restart the backend server**
2. **Clear browser cache** (important!)
3. **Test from the frontend**:
   - Open browser console (F12)
   - Make a request to the API
   - Check for CORS errors

4. **Verify in browser console**:
   ```javascript
   fetch('https://your-backend-url/api/')
     .then(response => response.json())
     .then(data => console.log('Success:', data))
     .catch(error => console.error('CORS Error:', error));
   ```

## Production Deployment Checklist

Before deploying to production:

- [ ] Update `CORS_ORIGINS` to include production frontend URL
- [ ] Remove any development/testing origins if not needed
- [ ] Ensure `allow_credentials=True` only if your app needs cookies/auth
- [ ] Test CORS from the production frontend URL
- [ ] Document any new origins added

## Additional Resources

- [FastAPI CORS Documentation](https://fastapi.tiangolo.com/tutorial/cors/)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [CORS Best Practices](https://web.dev/cross-origin-resource-sharing/)
