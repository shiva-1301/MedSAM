# Deploying Medicine Scanner Bot with MERN on Render

## Current Problem

Your React app is hardcoded to call `http://localhost:8000`:
```jsx
const response = await fetch('http://localhost:8000/extract-text', ...)
```

On Render, there's no local FastAPI service, so it fails. We need to:
1. Make the API URL configurable
2. Deploy FastAPI as a separate Render service
3. Link both services via environment variables

---

## Solution: Deploy FastAPI on Render Too

### Step 1: Make React API URL Configurable

Edit `MedicineScannerBot.js`:

```javascript
// Get API URL from environment variable or default to localhost
const API_BASE_URL = process.env.REACT_APP_FASTAPI_URL || 'http://localhost:8000';

// Then replace all localhost:8000 calls with:
const response = await fetch(`${API_BASE_URL}/extract-text`, { ... })
```

### Step 2: Create `.env` File in Frontend

Frontend: `frontend/.env`
```
# For local development
REACT_APP_FASTAPI_URL=http://localhost:8000

# For production (after deploying FastAPI)
# REACT_APP_FASTAPI_URL=https://your-fastapi-service.onrender.com
```

### Step 3: Deploy FastAPI to Render

#### Option A: New Render Service (Recommended)

1. Go to **Render Dashboard** → **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `gemini-drug-scanner` (or similar)
   - **Runtime**: Python 3.11
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn interaction_engine:app --host 0.0.0.0 --port 10000`
   - **Environment**: Free or Paid (Free has limitations)

4. Set **Environment Variables** in Render Dashboard:
```
GEMINI_API_KEY=AIzaSyCalIG4qKi2JWVdgaPrRERpiS3ZlK8cWKQ
GROQ_API_KEY=your_groq_api_key_here
```

#### Option B: If You Have Private GitHub Repo

Push FastAPI code to separate GitHub repo:
```bash
cd c:\Users\Shivadhanu\OneDrive\Desktop\trial\gemini-text-test
git init
git add .
git commit -m "Initial FastAPI setup"
git remote add origin https://github.com/your-username/gemini-drug-scanner.git
git push -u origin main
```

Then connect that repo to Render.

### Step 4: Add Files to FastAPI for Render

#### `render.yaml` (Optional but recommended)

In FastAPI project root:
```yaml
services:
  - type: web
    name: gemini-drug-scanner
    env: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn interaction_engine:app --host 0.0.0.0 --port 10000
    envVars:
      - key: PYTHON_VERSION
        value: 3.11
```

#### `.gitignore`

```
__pycache__/
*.pyc
.env
.DS_Store
*.egg-info/
dist/
build/
.venv/
venv/
```

#### `runtime.txt` (Specify Python version)

```
python-3.11.7
```

### Step 5: Update FastAPI for Production

Edit `interaction_engine.py`:

```python
# At the top, add:
import os
from dotenv import load_dotenv

load_dotenv()

# Use env variables instead of hardcoded:
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Ensure API key exists
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable not set")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

# Update CORS to allow your Render domain:
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Development
        "https://your-mern-app.onrender.com",  # Production
        "http://localhost:8000",  # FastAPI testing
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 6: Update React Component

Modify `MedicineScannerBot.js`:

```javascript
// At top of file:
const API_BASE_URL = process.env.REACT_APP_FASTAPI_URL || 'http://localhost:8000';

// Then replace ALL fetch calls:

// OLD:
const response = await fetch('http://localhost:8000/extract-text', {

// NEW:
const response = await fetch(`${API_BASE_URL}/extract-text`, {
```

### Step 7: Update Frontend `.env` for Production

Frontend: `frontend/.env.production`
```
REACT_APP_FASTAPI_URL=https://gemini-drug-scanner.onrender.com
```

Or set in Render Dashboard:
- Go to Frontend service → Environment
- Add: `REACT_APP_FASTAPI_URL=https://gemini-drug-scanner.onrender.com`

### Step 8: Redeploy React Frontend

Once FastAPI is deployed:

1. Update the `.env` file on your local machine
2. Push to GitHub:
```bash
cd c:\Users\Shivadhanu\OneDrive\analyx
git add .
git commit -m "Update FastAPI URL for production"
git push
```

3. Render will auto-redeploy from GitHub

---

## Complete Deployment Checklist

```
Frontend (MERN) on Render:
☐ Update MedicineScannerBot.js to use API_BASE_URL variable
☐ Create/update frontend/.env with REACT_APP_FASTAPI_URL
☐ Push changes to GitHub
☐ Render auto-deploys

Backend (FastAPI) Setup:
☐ Add environment variables (GEMINI_API_KEY, GROQ_API_KEY)
☐ Update CORS to include production domain
☐ Add .gitignore, runtime.txt
☐ Push to GitHub (or new repo)
☐ Create Render Web Service
☐ Configure build & start commands
☐ Set environment variables in Render Dashboard
☐ Deploy and test

Testing:
☐ Verify FastAPI service is running (check Render logs)
☐ Test React app from production URL
☐ Test medicine scanner feature
☐ Check browser console for CORS errors
☐ Monitor Render logs for API errors
```

---

## Example: Complete Updated MedicineScannerBot.js

```javascript
import React, { useState } from 'react';
import './MedicineScannerBot.css';

const MedicineScannerBot = () => {
  // Get API URL from environment or default to localhost
  const API_BASE_URL = process.env.REACT_APP_FASTAPI_URL || 'http://localhost:8000';
  
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // ... rest of component code stays the same ...
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      // Use API_BASE_URL instead of hardcoded localhost
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/extract-text`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      // ... rest of logic ...
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  // Update all other fetch calls similarly:
  const parseExtractedText = async (text) => {
    const response = await fetch(`${API_BASE_URL}/parse-medicine-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    // ...
  };

  const searchDrugsInDatabase = async (names) => {
    const response = await fetch(`${API_BASE_URL}/search-drugs-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ names }),
    });
    // ...
  };

  const checkInteraction = async () => {
    const response = await fetch(`${API_BASE_URL}/check-interaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current_med: currentMedication,
        new_drug: selectedDrug.drug_name,
      }),
    });
    // ...
  };

  // ... rest of component ...
};

export default MedicineScannerBot;
```

---

## Deployment Process Step-by-Step

### Phase 1: Local Testing (Before Deploying)

```bash
# Terminal 1 - FastAPI local
cd c:\Users\Shivadhanu\OneDrive\Desktop\trial\gemini-text-test
python interaction_engine.py
# Runs on http://localhost:8000

# Terminal 2 - React frontend local
cd c:\Users\Shivadhanu\OneDrive\analyx
npm start
# Runs on http://localhost:3000
```

Test the medicine scanner to ensure it works locally.

### Phase 2: Deploy FastAPI to Render

1. **Prepare code**:
   ```bash
   cd c:\Users\Shivadhanu\OneDrive\Desktop\trial\gemini-text-test
   git init
   git add .
   git commit -m "FastAPI for Render deployment"
   ```

2. **Push to GitHub** (or create new repo)

3. **Create Render Service**:
   - Dashboard → New Web Service
   - Select GitHub repo
   - Configure as shown above
   - Deploy

4. **Set Environment Variables in Render**:
   - Render Dashboard → Env
   - Add GEMINI_API_KEY
   - Add GROQ_API_KEY

5. **Wait for deployment** (~5 minutes)

6. **Get deployed URL** (e.g., `https://gemini-drug-scanner.onrender.com`)

### Phase 3: Update React Frontend

1. **Update MedicineScannerBot.js**:
   - Replace all `http://localhost:8000` with `${API_BASE_URL}`

2. **Update frontend/.env**:
   ```
   REACT_APP_FASTAPI_URL=https://gemini-drug-scanner.onrender.com
   ```

3. **Push to GitHub**:
   ```bash
   cd c:\Users\Shivadhanu\OneDrive\analyx
   git add .
   git commit -m "Update FastAPI URL for production"
   git push
   ```

4. **Render auto-deploys** React frontend

### Phase 4: Test Production

1. Go to your deployed MERN URL (e.g., `https://your-mern-app.onrender.com`)
2. Find 💊 icon at bottom-left
3. Upload a medicine image
4. Verify it works end-to-end

---

## Troubleshooting Production Issues

### CORS Error: "Access to fetch blocked by CORS policy"

**Problem**: Render domain not in CORS allowed origins

**Solution**: Update `interaction_engine.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-mern-app.onrender.com",  # Add your exact domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Redeploy FastAPI
```

### 404 Not Found: "Cannot POST /extract-text"

**Problem**: FastAPI service not running or wrong URL

**Check**:
1. Verify Render shows "Live" status
2. Check Render logs for startup errors
3. Verify environment variables are set
4. Test API directly: `https://your-service.onrender.com/docs`

### 503 Service Unavailable

**Problem**: FastAPI service spinning down (free tier limitation)

**Solution**: 
- Upgrade to Paid tier (on Render)
- Or use Keep-Alive service (e.g., UptimeRobot)

### 500 Internal Server Error

**Check Render Logs**:
```
Render Dashboard → Your Service → Logs
```

Common causes:
- Missing environment variables
- API key invalid
- Python package not installed (check requirements.txt)

---

## Cost Considerations

| Component | Free Tier | Notes |
|-----------|-----------|-------|
| React Frontend (Render) | Yes | Included |
| FastAPI Backend (Render) | Yes | Spins down after 15 min inactivity |
| Gemini API | Free | Limited quota (may hit limits) |
| Groq API | Free | Generous free tier |

**Recommendation**: Start with free tier, upgrade FastAPI to paid if it needs 24/7 availability.

---

## Quick Reference: URLs After Deployment

```
Local Development:
- React: http://localhost:3000
- FastAPI: http://localhost:8000

Production (Render):
- React: https://your-mern-app.onrender.com
- FastAPI: https://gemini-drug-scanner.onrender.com

Environment Variable:
- Frontend: REACT_APP_FASTAPI_URL=https://gemini-drug-scanner.onrender.com
```

---

## Files to Modify/Create

```
FastAPI Project (c:\Users\Shivadhanu\OneDrive\Desktop\trial\gemini-text-test\):
✓ interaction_engine.py - Update CORS & env variables
✓ requirements.txt - Ensure python-dotenv is included
✓ .env - Local only (don't commit)
✓ .gitignore - Exclude .env
✓ runtime.txt - Specify Python 3.11

React Project (c:\Users\Shivadhanu\OneDrive\analyx\):
✓ frontend/src/components/MedicineScannerBot.js - Use API_BASE_URL
✓ frontend/.env - REACT_APP_FASTAPI_URL for local
✓ frontend/.env.production - REACT_APP_FASTAPI_URL for production (optional)
```

---

**Once deployed, your medicine scanner will work seamlessly on your production MERN app!** 🚀
