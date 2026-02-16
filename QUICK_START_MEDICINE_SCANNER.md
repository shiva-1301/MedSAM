# Quick Start: Medicine Scanner Bot for MERN

## What's Been Done

✅ **React Component Created**
- File: `frontend/src/components/MedicineScannerBot.js`
- A floating medicine icon appears at bottom-left of all pages
- Click to open a modal with full drug scanning + interaction checker

✅ **Component Already Integrated**
- Imported in `App.js`
- Renders globally across your entire MERN app
- No additional setup needed!

## How to Use

### Step 1: Keep FastAPI Backend Running
```bash
cd c:\Users\Shivadhanu\OneDrive\Desktop\trial\gemini-text-test
python interaction_engine.py
```
FastAPI will start on **http://localhost:8000**

### Step 2: Run Your MERN App
```bash
cd c:\Users\Shivadhanu\OneDrive\analyx
npm start
```
Your React app will start on **http://localhost:3000**

### Step 3: Look for the Medicine Icon!
- Find the 💊 icon at **bottom-left corner** of any page
- Click it to open the scanner modal

## The Workflow

### User Flow Inside the Modal:

```
1. Upload Medicine Image
   ↓ (Click upload area or drag image)
   ↓ Frontend sends to: POST /extract-text

2. See Extracted Text
   ↓ (Raw OCR text from Gemini AI)
   ↓ Frontend sends to: POST /parse-medicine-text

3. View Parsed Medicine Info
   ↓ (Structured JSON: names, dosage, caution notes)
   ↓ Frontend sends to: POST /search-drugs-batch

4. Select Medicine from Database
   ↓ (Shows matching drugs with fuzzy matching)
   ↓ User selects one drug

5. Check Interactions
   ↓ (Enter your current medication)
   ↓ Frontend sends to: POST /check-interaction

6. See Interaction Results
   ↓ (Severity, mechanism, risks, recommendations)
```

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│         Your MERN App (localhost:3000)      │
│  ┌─────────────────────────────────────┐   │
│  │   MedicineScannerBot Component      │   │
│  │  [💊 Floating Button] + [Modal]     │   │
│  └──────────────┬──────────────────────┘   │
└─────────────────┼──────────────────────────┘
                  │ HTTP Requests
                  │ (port 8000)
                  ↓
┌─────────────────────────────────────────────┐
│   FastAPI Microservice (localhost:8000)     │
│                                             │
│  POST /extract-text          → Gemini API  │
│  POST /parse-medicine-text   → Groq API    │
│  POST /search-drugs-batch    → Local DB    │
│  POST /check-interaction     → Groq API    │
│                                             │
│  Database: drugbank_comprehensive.json     │
│  (4,628 drugs with interactions)           │
└─────────────────────────────────────────────┘
```

## File Locations

```
Your MERN Project (c:\Users\Shivadhanu\OneDrive\analyx\)
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── MedicineScannerBot.js        ← Main Component
│       │   └── MedicineScannerBot.css       ← Styling
│       └── App.js                           ← Updated with import
├── MEDICINE_SCANNER_SETUP.md                ← Full Documentation
└── ...

FastAPI Backend (c:\Users\Shivadhanu\OneDrive\Desktop\trial\gemini-text-test\)
├── interaction_engine.py                    ← The microservice
├── drugbank_comprehensive.json              ← Drug database
├── requirements.txt                         ← Dependencies
└── .env                                     ← API keys
```

## Component Features Breakdown

### 🎯 Floating Button
- Position: Fixed at bottom-left (`bottom-6 left-6`)
- Size: 64x64px circular button
- Icon: Medicine bottle emoji (💊)
- Colors: Purple → Blue gradient
- Hover effect: Scales up and glows
- Always on top (z-index: 40)

### 📱 Modal Window
- Size: 2xl (672px max width) with responsive height
- Header: Gradient purple background with close button
- Content: Scrollable with error handling
- Footer: Action buttons (Scan Another, Close)
- Animations: Smooth slide-in effect

### ✨ Styling
- Uses Tailwind CSS (matches your project)
- Responsive design (works on mobile)
- Professional color scheme
- Proper contrast for accessibility
- Loading states with spinners

## Customization Options

### Move the Button
In `MedicineScannerBot.js`, find this line:
```jsx
className="fixed bottom-6 left-6 z-40 ..."
```

Options:
- `bottom-6 left-6` = Bottom-left (current)
- `bottom-6 right-6` = Bottom-right
- `top-6 right-6` = Top-right
- `top-6 left-6` = Top-left

### Change Button Color
Find the gradient class:
```jsx
className="... bg-gradient-to-br from-blue-500 to-purple-600 ..."
```

Change colors:
- `from-green-500 to-emerald-600` = Green
- `from-red-500 to-pink-600` = Red
- `from-indigo-500 to-blue-600` = Indigo

### Disable on Some Pages
Wrap in App.js:
```jsx
import { useLocation } from 'react-router-dom';

// Inside App function:
const location = useLocation();

return (
  <>
    <Routes>...</Routes>
    {/* Show bot only on allowed pages */}
    {!['/admin', '/dashboard'].includes(location.pathname) && <MedicineScannerBot />}
  </>
);
```

## API Rate Limits & Costs

⚠️ Important notes about the backend APIs:

### Gemini API (Image Text Extraction)
- Used in: Step 1 (Extract Text from Image)
- Current model: `gemini-2.5-flash` (has available quota)
- Cost: Part of your free tier allocation
- Limit: Image compression automatically applied

### Groq API (Medicine Parsing & Interaction Checking)
- Used in: Step 2 (Parse) + Step 5 (Interactions)
- Model: `llama-3.3-70b-versatile`
- Speed: Instant responses
- Cost: Free tier available (high rate limits)

### Local Database Search
- Used in: Step 3 (Search Drugs)
- Database: `drugbank_comprehensive.json` (local file)
- Speed: Instant
- Cost: None (runs locally)

## Troubleshooting

### "Medicine icon not showing?"
1. Check console for errors: F12 → Console tab
2. Verify App.js has import and component
3. Clear browser cache (Ctrl+Shift+Delete)
4. Reload page

### "Can't upload image?"
1. Check file size (should be < 10MB)
2. Try PNG or JPG format
3. Check FastAPI is running on port 8000
4. Check browser console for CORS errors

### "API errors (Gemini quota exceeded)?"
1. Check .env file has valid API key
2. Gemini quota might be exceeded
3. Try again in 30 minutes or upgrade tier

### "Interaction checking slow?"
1. First request always slower (API warmup)
2. Check internet connection
3. Groq API might be experiencing high demand
4. Normal response time: 2-5 seconds

## Next Steps / Ideas

Once working, you can extend with:
1. **Save Results** - Store interaction checks to user's profile
2. **History** - Show past medicine scans
3. **Export** - Generate PDF reports
4. **Sharing** - Allow users to share results with doctors
5. **Alerts** - Notify when dangerous interactions detected
6. **Integration** - Link with prescriptions in your app

## Support

For issues with:
- **React Component**: Check `MedicineScannerBot.js` in editor
- **FastAPI Backend**: Check `interaction_engine.py`
- **API Keys**: Check `.env` file in backend folder
- **Database**: Usually `drugbank_comprehensive.json` is fine (no changes needed)

---

**Ready to scan medicines in your MERN app!** 🚀
