# Medicine Scanner Bot Integration Guide

## Overview
The Medicine Scanner Bot is a floating chatbot-style widget that integrates the drug scanning and interaction checking feature into your MERN stack project. The component communicates with a Python FastAPI microservice to perform:

1. **Image Text Extraction** - Uses Gemini AI to extract text from medicine images
2. **Medicine Parsing** - Parses extracted text into structured JSON using Groq AI
3. **Drug Database Search** - Searches drugbank_comprehensive.json for drug information with fuzzy matching
4. **Drug Interaction Checking** - Analyzes interactions between selected medicine and current medications using Groq

## Architecture

```
MERN Frontend (React)
    ↓
MedicineScannerBot (React Component)
    ↓
FastAPI Microservice (Python) - localhost:8000
    ├── /extract-text (Gemini API)
    ├── /parse-medicine-text (Groq API)
    ├── /search-drugs-batch (Local drugbank DB)
    └── /check-interaction (Groq API)
```

## Setup Instructions

### 1. FastAPI Backend Already Running
The FastAPI microservice should be running on `http://localhost:8000`:

```bash
cd c:\Users\Shivadhanu\OneDrive\Desktop\trial\gemini-text-test
python interaction_engine.py
# Server runs on http://localhost:8000
```

### 2. React Component Already Integrated
The `MedicineScannerBot.js` component has been added to your MERN frontend:
- Component file: `frontend/src/components/MedicineScannerBot.js`
- CSS file: `frontend/src/components/MedicineScannerBot.css`
- Added to `App.js` for global availability

### 3. Start Your MERN App
```bash
cd c:\Users\Shivadhanu\OneDrive\analyx
npm start  # Frontend on localhost:3000
```

## Features

### 🎯 Floating Medicine Icon
- Fixed position at bottom-left of screen
- Circular design with gradient background
- Pulse animation on hover
- Always visible across all pages

### 📱 Modal Popup Window
When clicked, shows a modal with:
1. **Upload Step** - Upload medicine image or packaging photo
2. **Extracted Text** - Shows OCR'd text with preview image
3. **Parsed Data** - Structured medicine information (names, dosage, cautions)
4. **Drug Search** - Select from database matches with fuzzy matching for typos
5. **Interaction Check** - Input current medication and check for interactions

### 🔄 Automated Workflow
- Image upload → automatic text extraction
- Extracted text → automatic parsing
- Parsed drugs → automatic database search
- User selects drug → ready for interaction check

### 🎨 UI Features
- Progress through workflow steps
- Error handling and user feedback
- Detailed drug information display
- Color-coded interaction severity (HIGH/MODERATE/LOW)
- Responsive design (mobile-friendly)

## Component Usage

The component is already integrated globally in `App.js`. It appears on every page automatically.

If you need to customize or disable it for specific pages:

```jsx
// In any component, control visibility via state
const [showBot, setShowBot] = useState(true);

// To hide bot on specific pages:
useEffect(() => {
  if (location.pathname === '/admin') {
    setShowBot(false);
  }
}, [location]);
```

## API Endpoints Used

### 1. Extract Text from Image
```
POST /extract-text
Content-Type: multipart/form-data

Response: {
  "success": true,
  "text": "Extracted text from image..."
}
```

### 2. Parse Medicine Text to JSON
```
POST /parse-medicine-text
Content-Type: application/json
Body: { "text": "..." }

Response: {
  "success": true,
  "parsed_data": "{\"names\": [...], \"dosage\": [...], \"caution_notes\": [...]}"
}
```

### 3. Search Drugs in Database
```
POST /search-drugs-batch
Content-Type: application/json
Body: { "names": ["Aspirin", "Paracetamol"] }

Response: {
  "success": true,
  "results": [
    {
      "found": true,
      "drug_name": "Aspirin 500mg",
      "generic_name": "Acetylsalicylic acid",
      "pharm_class": "Analgesic",
      ...
    },
    ...
  ]
}
```

### 4. Check Drug Interaction
```
POST /check-interaction
Content-Type: application/json
Body: {
  "current_med": "Warfarin",
  "new_drug": "Aspirin"
}

Response: {
  "interaction_found": true,
  "ai_analysis": {
    "severity": "HIGH",
    "mechanism": "...",
    "risk": "...",
    "action": "..."
  }
}
```

## Error Handling

The component handles:
- Network errors from FastAPI
- File upload errors
- API timeout errors (from Gemini/Groq)
- Empty or invalid results
- User-friendly error messages displayed in the modal

## Customization

### Change Floating Button Position
In `MedicineScannerBot.js`, modify the button styling:
```jsx
className="fixed bottom-6 left-6 z-40 ..." // bottom-6 left-6 = bottom-left
// Change to: bottom-6 right-6 for bottom-right
// Or: top-6 left-6 for top-left
```

### Change Colors
Modify the gradient in the button:
```jsx
className="... bg-gradient-to-br from-blue-500 to-purple-600 ..."
// Change colors as needed
```

### Disable for Specific Routes
```jsx
const location = useLocation();
const allowedRoutes = ['/', '/search', '/prescriptions'];

if (!allowedRoutes.includes(location.pathname)) {
  return null; // Don't render bot
}
```

## Performance Notes

- FastAPI runs independently (separate process)
- No database queries from React (offloaded to Python backend)
- Lazy loading of component (only renders when needed)
- Image compression handled by Python backend
- Timeout protection on Gemini/Groq API calls

## FAQ

**Q: Can I move the bot to a different position?**
A: Yes, change `fixed bottom-6 left-6` to any position (bottom-right, top-left, etc.)

**Q: What if FastAPI backend goes down?**
A: Error messages will inform user. Graceful error handling in place.

**Q: Can I add this to specific pages only?**
A: Yes, wrap `<MedicineScannerBot />` in conditional render based on route.

**Q: How to customize the modal appearance?**
A: Edit the className attributes in `MedicineScannerBot.js` (uses Tailwind CSS)

**Q: Can users save their results?**
A: Currently shows results in modal. You can extend to save to your MongoDB backend.

## Troubleshooting

### Bot not appearing
- Check if component imported in App.js ✓
- Ensure z-index is high enough
- Check browser console for errors

### FastAPI not connecting
- Verify FastAPI running on localhost:8000
- Check CORS is enabled in backend ✓
- Check network console for 404/503 errors

### Image upload failing
- Check file size (limit 10MB in frontend validation)
- Verify image format (PNG, JPG, WebP supported)
- Check Gemini API quota

### Interaction checking slow
- This is normal for first request (API initialization)
- Groq API might be slow during high demand
- Check internet connection

## Support

For issues or customizations, refer to the FastAPI backend at:
`c:\Users\Shivadhanu\OneDrive\Desktop\trial\gemini-text-test\interaction_engine.py`
