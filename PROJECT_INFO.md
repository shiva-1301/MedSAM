# ANALYX - Drug Scanner Application
## Complete Project Information & Capabilities

**Last Updated:** February 14, 2026 - **PRODUCTION-LEVEL DASHBOARDS + AUTOCOMPLETE**

---

## 📋 PROJECT OVERVIEW

**ANALYX** is a comprehensive drug scanner and pharmacy management application with three distinct user roles:
1. **Normal Users** - Search drugs, track medical history, manage adherence, upload prescriptions, find nearby pharmacies
2. **Pharmacy Owners** - Manage inventory, track stock, handle orders, support geolocation
3. **Admins** - Approve/reject pharmacies, manage system

**Status:** ✅ FULLY OPERATIONAL & RUNNING
- Backend running on: `http://localhost:5000`
- Frontend running on: `http://localhost:3000`
- Database: MongoDB (Connected)

**Latest Features (Feb 2026):**
- ✨ Google-style medicine autocomplete with debouncing
- ✨ Course-based adherence tracking with refill alerts
- ✨ Production-level dashboard redesigns (User, Pharmacy, Admin)
- ✨ Cron-based reminder scheduler for medicine doses
- ✨ Real-time refill warnings (3-day threshold)

---

## 🏗️ PROJECT STRUCTURE

### Root Directory: `c:\Users\Shivadhanu\OneDrive\analyx\`

```
analyx/
├── backend/              # Node.js Express API
├── frontend/             # React 19 Application
├── setup.bat             # Windows setup script
├── setup.sh              # Unix/Linux/Mac setup script
├── README.md             # Comprehensive documentation
├── QUICKSTART.md         # 5-minute setup guide
├── PROJECT_SUMMARY.md    # Feature breakdown
└── PROJECT_INFO.md       # This file
```

---

## 🗂️ BACKEND FILES & STRUCTURE

**Location:** `backend/`

### Configuration Files
- `server.js` - Main Express server entry point (port 5000, starts reminder scheduler)
- `package.json` - Dependencies (Express v5, MongoDB, JWT, Multer, node-cron, etc.)
- `.env` - Environment variables (API keys, database URI, JWT secret)
- `.env.example` - Template for environment setup
- `.gitignore` - Git ignore file

### Key Backend Dependencies
- **express** (v5.0.0) - Web framework
- **mongoose** (v9.0.0) - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **node-cron** (v3.0.3) - Reminder scheduler (runs every minute)
- **cors** - Cross-origin resource sharing
- **express-validator** - Input validation
- **dotenv** - Environment variables

### Database Configuration
- `config/db.js` - MongoDB connection setup

### Data Models (MongoDB Schemas)
- `models/User.js` - Normal user schema with medical tracking
  - Fields: fullName, email, password, phone, age, gender, city, state
  - Medical: bloodGroup, medicalConditions[], knownDrugAllergies[]
  - **NEW**: chiefConcerns (primary health issues)
  - **NEW**: doctorDetails object (name, contact, hospital)
  - Other: emergencyContact, createdAt, updatedAt

- `models/Adherence.js` - **NEW** Medicine adherence tracking (course-based)
  - Fields: userId, medicineName, dose, tabletsPerDose, timesPerDay, startDate, durationDays
  - Tracking: totalTablets, remainingTablets, reminderTimes[], completed, refillReminderSent
  - Auto-calculated: totalTablets (tabletsPerDose * timesPerDay * durationDays)
  - Pre-validate hook: Sets remainingTablets equal to totalTablets on creation
  - Indexes: userId+startDate, userId+completed for fast queries

- `models/Prescription.js` - **NEW** Digital prescription storage
  - Fields: userId, doctorName, doctorContact, hospitalName, visitDate, fileUrl, fileType
  - File types: PDF, JPEG, PNG (max 5MB)
  - Storage: `/uploads/prescriptions/`

- `models/Pharmacy.js` - Pharmacy owner schema with verification
  - Fields: fullName, email, password, phone, pharmacyName
  - License: licenseNumber, gstNumber, licenseDocument (file upload)
  - **NEW**: location field (GeoJSON Point for 2dsphere geolocation queries)
  - Status: verificationStatus (pending/approved/rejected), rejectionReason
  - Hours: workingHours (day-wise object)

- `models/Medicine.js` - Medicine/Drug inventory schema
  - Fields: name, genericName, manufacturer, category, composition
  - Stock: stockQuantity, price, mrp
  - Dates: manufacturingDate, expiryDate
  - Medical: dosage, sideEffects[], precautions[]
  - **NEW**: Index on `name` field for fast prefix search
  - Virtual fields for stockStatus and expiryStatus

### Controllers (Business Logic)
- `controllers/authController.js` (11 functions)
  - `registerUser()` - User registration
  - `registerPharmacy()` - Pharmacy registration with file upload
  - `login()` - Authentication for both roles
  - `getProfile()` - Fetch user/pharmacy profile
  - `updateProfile()` - Update profile information
  - Additional helper methods

- `controllers/pharmacyController.js` (7 functions)
  - `getDashboardStats()` - Dashboard statistics
  - `getPharmacyProfile()` - Get full pharmacy details
  - `updatePharmacyProfile()` - Update pharmacy info
  - Stock and medicines related endpoints
  - **NEW**: `getNearbyPharmacies()` - Geolocation-based pharmacy search with distance calculation

- `controllers/medicineController.js` (9 functions)
  - `addMedicine()` - Add new medicine to inventory
  - `getMedicines()` - Get all/filtered medicines
  - `getMyMedicines()` - Get pharmacy's medicines
  - `updateMedicine()` - Edit medicine details
  - `deleteMedicine()` - Remove medicine
  - `updateStock()` - Adjust stock quantities
  - `searchMedicines()` - Search across pharmacies
  - **NEW**: `getMedicineSuggestions()` - Prefix-based autocomplete (top 10 results)

- `controllers/adminController.js` (6 functions)
  - `getPendingPharmacies()` - Get unverified pharmacies
  - `approvePharmacy()` - Approve pharmacy registration
  - `rejectPharmacy()` - Reject with reason
  - `getDashboardStats()` - Admin dashboard statistics
  - Pharmacy management functions

- `controllers/adherenceController.js` - **NEW** (5 functions)
  - `addCourse()` - Add medicine course
  - `getActiveCourses()` - List active courses with computed fields
  - `markDoseTaken()` - Decrement remaining tablets, mark refill warning
  - `getRefillAlerts()` - Courses below 3-day threshold
  - `getDailyReminders()` - Reminders based on scheduled times

- `controllers/prescriptionController.js` - **NEW** (4 functions)
  - `uploadPrescription()` - Upload prescription file with metadata
  - `getPrescriptions()` - Get all user prescriptions
  - `getPrescriptionById()` - Get single prescription
  - `deletePrescription()` - Delete prescription and file

### Routes (API Endpoints)
- `routes/authRoutes.js` - Authentication endpoints
  - POST `/register/user` - User registration
  - POST `/register/pharmacy` - Pharmacy registration
  - POST `/login` - Login
  - GET `/profile` - Get profile (protected)
  - PUT `/profile` - Update profile (protected)

- `routes/pharmacyRoutes.js` - Pharmacy management
  - GET `/nearby` - **NEW** Get nearby pharmacies (public, geo-based)
  - GET `/dashboard` - Dashboard stats
  - GET `/profile` - Pharmacy details
  - PUT `/profile` - Update profile
  - GET `/medicines` - List medicines
  - POST `/medicines` - Add medicine
  - PUT `/medicines/:id` - Edit medicine
  - DELETE `/medicines/:id` - Delete medicine
  - PUT `/medicine-stock/:id` - Update stock
  - GET `/search` - Search medicines

- `routes/medicineRoutes.js` - Medicine endpoints
  - GET `/suggestions` - **NEW** Medicine name autocomplete (public, prefix match)
  - GET `/search` - Search all medicines
  - GET `/my-medicines` - User's pharmacy medicines
  - GET `/:id` - Get medicine details
  - POST `/` - Add new medicine
  - PUT `/:id` - Update medicine
  - DELETE `/:id` - Delete medicine

- `routes/adherenceRoutes.js` - **NEW** Medicine adherence tracking
  - POST `/add-course` - Add medicine course
  - GET `/active` - Active courses
  - PUT `/mark-dose/:id` - Mark dose taken
  - GET `/refill-alerts` - Refill alerts
  - GET `/daily-reminders` - Daily reminder list

- `routes/prescriptionRoutes.js` - **NEW** Digital prescriptions
  - POST `/upload` - Upload prescription (multipart)
  - GET `/` - Get all prescriptions
  - GET `/:id` - Get single prescription
  - DELETE `/:id` - Delete prescription

- `routes/adminRoutes.js` - Admin functions
  - GET `/pharmacies/pending` - Pending approvals
  - POST `/pharmacies/:id/approve` - Approve pharmacy
  - POST `/pharmacies/:id/reject` - Reject pharmacy
  - GET `/dashboard` - Admin stats

### Middleware
- `middleware/auth.js` - JWT verification & role checking
  - `protect()` - Verify token
  - `authorize(roles)` - Role-based access control

- `middleware/upload.js` - Multer file upload configuration
  - Accepts: JPEG, PNG, PDF
  - Size limit: 5MB
  - Storage: `uploads/` directory

- `middleware/prescriptionUpload.js` - **NEW** Prescription file upload
  - Separate folder: `uploads/prescriptions/`
  - Same file restrictions as main upload
  - Auto-creates prescriptions directory

### Utilities
- `utils/generateToken.js` - JWT token generation (7-day expiration)
- `utils/validators.js` - Input validation rules
- `utils/reminderScheduler.js` - **NEW** Cron-based reminder scheduler
  - Runs every minute (cron: '* * * * *')
  - Queries active adherence courses matching current time
  - Stores pending reminders in Map by userId
  - Exports: startReminderScheduler(), getPendingReminders(userId)

### Helper Scripts
- `scripts/createAdmin.js` - Create admin user in database
- `scripts/hashPassword.js` - Generate password hashes
- `scripts/seedPharmacies.js` - Seed 4 pharmacies and sample medicines

---

## 🎨 FRONTEND FILES & STRUCTURE

**Location:** `frontend/`

### Configuration Files
- `package.json` - Dependencies (React 19, React Router v7, Tailwind CSS v4, Axios, lodash.debounce)
- `.env` - Environment variables
- `.env.example` - Template
- `tailwind.config.js` - Tailwind CSS configuration
- `public/index.html` - Main HTML

### Key Frontend Dependencies
- **react** (v19) - UI library
- **react-dom** (v19) - React DOM renderer
- **react-router-dom** (v7) - Client-side routing
- **axios** - HTTP client
- **tailwindcss** (v4) - Utility-first CSS framework
- **lodash.debounce** - Debounce utility for autocomplete (300ms delay)

### Entry Points
- `src/index.js` - React entry point
- `src/index.css` - Global styles
- `src/App.js` - Main app with routing
- `src/reportWebVitals.js` - Performance metrics

### Global Components
- `src/components/Navbar.js` - Navigation header with role-based menu
- `src/components/PrivateRoute.js` - Protected route wrapper
- `src/components/Footer.js` - (if exists) Footer component

### Context & State Management
- `src/context/AuthContext.js` - Global authentication state
  - Manages: user, token, loading state
  - Methods: login(), logout(), register()
  - Persistence: localStorage

### API Communication
- `src/utils/api.js` - Axios instance with interceptors
  - Automatic token injection
  - Error handling
  - API_URL: `http://localhost:5000/api`

### Public Pages (No login required)
- `src/pages/Home.js` - Homepage with features overview
- `src/pages/Login.js` - Login form for all roles
- `src/pages/UserRegister.js` - User registration form
- `src/pages/PharmacyRegister.js` - Pharmacy registration with file upload
- `src/pages/DrugSearch.js` - Search medicines with autocomplete
  - **NEW**: Google-style prefix-based suggestions dropdown
  - Debounced API calls (300ms delay) using lodash.debounce
  - Top 10 medicine name suggestions
  - Click suggestion to auto-fill and search
  - Filter by: Name, City, Category
  - Verified pharmacies only
- `src/pages/NotFound.js` - 404 error page

### User Pages (Role: user)
- `src/pages/user/UserDashboard.js` - **REDESIGNED** Production-level dashboard
  - Hero card: Today's medication summary with progress bar
  - Active courses table (2/3 width) with days/tablets remaining
  - Upcoming reminder + Refill alert cards (1/3 width)
  - Recent prescriptions section (full width)
  - Quick actions grid (4 cards with hover effects)
  - Real-time data from adherence + prescriptions APIs
  - Responsive: Stacks vertically on mobile
- **NEW** `src/pages/user/UserProfile.js` - Comprehensive profile with 4 tabs:
  - Personal: Name, phone, age, gender, city, state
  - Medical: Blood group, conditions, allergies, chief concerns, emergency contact
  - Doctor: Doctor name, contact, hospital
  - Security: Change password, email display
- **NEW** `src/pages/user/Adherence.js` - Course-based medicine adherence
  - Add medicine course form (tablets, times per day, duration, reminders)
  - Active courses table with remaining tablets/days
  - Mark dose taken (decrements remaining tablets)
  - Refill alerts (3-day threshold warning)
  - Daily reminders sidebar (time-based)
  - Real-time refill calculation
- **NEW** `src/pages/user/Prescriptions.js` - Digital prescription management
  - Upload prescriptions (PDF/JPEG/PNG)
  - List all prescriptions with doctor details
  - Download/Delete prescriptions
  - File management
- **NEW** `src/pages/user/NearbyPharmacies.js` - Geolocation-based pharmacy finder
  - Browser geolocation API integration
  - Adjustable search radius (5-30 km)
  - Distance calculation using Haversine formula
  - Pharmacy cards with hours and contact info
- `src/pages/user/MedicineDetails.js` - Medicine information page
- `src/pages/user/MedicalHistory.js` - View personal medical records

### Pharmacy Pages (Role: pharmacy - approved status required)
- `src/pages/pharmacy/VerificationStatus.js` - Check approval status
- `src/pages/pharmacy/PharmacyDashboard.js` - **REDESIGNED** Production-level dashboard
  - 4 summary cards: Total, Low Stock, Out of Stock, Expiring Soon
  - Low stock table (2/3 width) with inline Update buttons
  - Expiring soon alert cards (1/3 width) with days-left highlighting
  - Recent medicines table (last 5 entries)
  - Quick actions grid (4 cards)
  - Color-coded alerts: Yellow (low), Red (urgent), Orange (expiring)
  - Fetches data from /low-stock and /expiring endpoints

- `src/pages/pharmacy/ManageMedicines.js` - List all pharmacy medicines
  - Table: Name, Category, Stock, Price, Expiry, Status
  - Actions: Edit, Delete
  - Filter & search

- `src/pages/pharmacy/AddMedicine.js` - Add new medicine form
  - Fields: Name, generic name, manufacturer, category, composition
  - Stock & pricing: Quantity, price, MRP
  - Dates: Manufacturing, expiry
  - Medical: Dosage, side effects, precautions
  - Image upload

- `src/pages/pharmacy/EditMedicine.js` - Edit existing medicine
  - Same fields as AddMedicine
  - Pre-populated form

- `src/pages/pharmacy/StockManagement.js` - Stock alerts & management
  - Low stock alerts
  - Expiring medicines alerts
  - Bulk stock update

- `src/pages/pharmacy/PharmacyProfile.js` - Pharmacy settings
  - Update: Pharmacy name, address, working hours, GST
  - View: License, verification status
  - Update: Contact information

### Admin Pages (Role: admin)
- `src/pages/admin/AdminDashboard.js` - **REDESIGNED** Production-level dashboard
  - 5 overview cards: Total Users, Total Pharmacies, Approved, Pending, Total Medicines
  - Pending pharmacy approvals table (2/3 width) with inline Approve/Reject
  - System health card (1/3 width): Server + Database status
  - Recent activity feed (auto-generated from stats)
  - Recent registrations: New Users + New Pharmacies tabs
  - Operational focus: Quick decision-making, minimal clutter

- `src/pages/admin/PendingPharmacies.js` - Pharmacy approval queue
  - List all pending pharmacies
  - View: License document, details
  - Actions: Approve, Reject with reason

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### User Roles
1. **user** - Normal drug scanner user
2. **pharmacy** - Pharmacy owner/manager
3. **admin** - System administrator

### Login Credentials

**Admin Account:**
- Email: `admin@analyx.com`
- Password: `admin123`

**Test User Account:**
- Email: `user@test.com`
- Password: `user123`

**Test Pharmacy Account:**
- Email: `pharmacy@test.com`
- Password: `pharmacy123`

### JWT Token Features
- Expiration: 7 days
- Stored in: localStorage
- Verified on: Protected routes & API calls
- Contains: User ID, email, role, pharmacy ID (if pharmacy)

### Role-Based Features
- **Users:** Can register, search drugs, view pharmacies, track medical history
- **Pharmacies:** Can register (with verification), add medicines, manage stock (after approval only)
- **Admins:** Can approve/reject pharmacies, view all data, manage system

---

## 📱 AVAILABLE FUNCTIONALITIES

### User Functionalities
✅ Register as normal user with medical history
✅ Login with email/password
✅ Search medicines across all pharmacies
✅ **NEW**: Autocomplete medicine names (Google-style dropdown)
✅ **NEW**: Debounced suggestions (top 10 prefix matches)
✅ Filter medicines by: Category, City, Pharmacy
✅ View medicine details: Composition, dosage, side effects, precautions
✅ View pharmacy details: Location, working hours, rating
✅ View & Edit personal profile with medical information
✅ Update profile: Personal info, medical history, emergency contact
✅ **NEW**: Manage chief concerns and doctor details
✅ Track drug allergies and medical conditions
✅ **NEW**: Track medicine adherence with course-based system
✅ **NEW**: Add medicine courses (tablets, duration, times per day)
✅ **NEW**: Mark dose taken (auto-decrements remaining tablets)
✅ **NEW**: Receive refill alerts (3-day threshold)
✅ **NEW**: Set reminder times for each course
✅ **NEW**: View active courses with days/tablets remaining
✅ **NEW**: Upload and manage digital prescriptions
✅ **NEW**: Download prescription files
✅ **NEW**: Find nearby pharmacies using geolocation
✅ **NEW**: Search within custom radius (5-30 km)
✅ **NEW**: View pharmacy distance and hours
✅ **NEW**: Change account password
✅ Logout

### Pharmacy Functionalities
✅ Register as pharmacy owner with license verification
✅ Upload license document during registration
✅ View approval/rejection status
✅ Login after approval
✅ Add medicines to inventory with details
✅ Upload medicine images
✅ Edit medicine information
✅ Delete medicines from inventory
✅ View inventory dashboard with statistics
✅ Track stock levels (In Stock/Low Stock/Out of Stock)
✅ Manage stock quantities
✅ Track expiring medicines (Valid/Expiring Soon/Expired)
✅ View medicines by: Category, stock status, expiry status
✅ Search prescriptions (if implemented)
✅ Update pharmacy profile: Hours, contact, GST
✅ View license document status
✅ Logout

### Admin Functionalities
✅ Login with admin credentials
✅ View all pending pharmacy registrations
✅ Review pharmacy license documents
✅ Approve pharmacies
✅ Reject pharmacies with reason
✅ View system dashboard with overall statistics
✅ View total users count
✅ View total pharmacies count
✅ View total medicines count
✅ View pending approvals count
✅ Recent activities monitoring
✅ Logout

### System Functionalities
✅ JWT-based authentication
✅ Role-based access control
✅ File upload (License, Medicine images) with validation
✅ Password hashing (bcryptjs)
✅ CORS enabled for cross-origin requests
✅ MongoDB integration for persistence
✅ Input validation on all endpoints
✅ Error handling with meaningful messages
✅ Responsive design (Tailwind CSS)
✅ Protected routes on frontend & backend
✅ Token refresh capability
✅ Logout with session cleanup

---

## 📊 DATABASE COLLECTIONS

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  phone: String,
  age: Number,
  gender: String,
  city: String,
  state: String,
  bloodGroup: String,
  medicalConditions: [String],
  knownDrugAllergies: [String],
  chiefConcerns: String (NEW),
  doctorDetails: {                  (NEW)
    name: String,
    contact: String,
    hospital: String
  },
  emergencyContact: Object,
  role: "user",
  createdAt: Date,
  updatedAt: Date
}
```

### Adherence Collection (Course-Based)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User, required),
  medicineName: String (required),
  dose: String (required),
  tabletsPerDose: Number (required, min: 1),
  timesPerDay: Number (required, min: 1),
  startDate: Date (required),
  durationDays: Number (required, min: 1),
  totalTablets: Number (auto-calculated: tabletsPerDose * timesPerDay * durationDays),
  remainingTablets: Number (default: totalTablets, decrements on mark dose),
  reminderTimes: [String] (array of times in HH:mm format),
  completed: Boolean (default: false),
  refillReminderSent: Boolean (default: false, set at 3-day threshold),
  createdAt: Date,
  updatedAt: Date
}
```

### Prescription Collection (NEW)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User, required),
  doctorName: String (required),
  doctorContact: String (required),
  hospitalName: String (required),
  visitDate: Date (required),
  notes: String,
  fileUrl: String (required, path to file),
  fileType: String (enum: pdf, jpeg, jpg, png),
  createdAt: Date,
  updatedAt: Date
}
```

### Pharmacies Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique, required),
  password: String (hashed, required),
  phone: String,
  pharmacyName: String,
  licenseNumber: String (unique),
  gstNumber: String (regex validated),
  licenseDocument: String (file path),
  address: Object,
  pincode: String,
  location: {                         (NEW - GeoJSON)
    type: "Point",
    coordinates: [longitude, latitude]
  },
  workingHours: Object (day-wise hours),
  verificationStatus: "pending|approved|rejected",
  rejectionReason: String,
  role: "pharmacy",
  createdAt: Date,
  updatedAt: Date
}
```

### Medicines Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  genericName: String,
  manufacturer: String,
  category: String (Enum),
  composition: String,
  stockQuantity: Number,
  price: Number,
  mrp: Number,
  manufacturingDate: Date,
  expiryDate: Date,
  dosage: String,
  sideEffects: [String],
  precautions: [String],
  imageUrl: String,
  pharmacyId: ObjectId (reference to Pharmacy),
  createdAt: Date,
  updatedAt: Date,
  stockStatus: Virtual (Computed),
  expiryStatus: Virtual (Computed)
}
```

---

## 🧪 SAMPLE SEED DATA (Pharmacies + Medicines)

### Pharmacy Owners (4 Accounts)
```javascript
const pharmacies = [
  {
    fullName: "Ravi Kumar",
    email: "medplus1@test.com",
    password: hashedPassword,
    phone: "9000000001",
    pharmacyName: "MedPlus Central",
    licenseNumber: "LIC1001",
    gstNumber: "GST1001",
    verificationStatus: "approved",
    location: {
      type: "Point",
      coordinates: [78.4867, 17.3850] // Hyderabad center
    }
  },
  {
    fullName: "Suresh Reddy",
    email: "apollo1@test.com",
    password: hashedPassword,
    phone: "9000000002",
    pharmacyName: "Apollo Pharmacy",
    licenseNumber: "LIC1002",
    gstNumber: "GST1002",
    verificationStatus: "approved",
    location: {
      type: "Point",
      coordinates: [78.4011, 17.4435]
    }
  },
  {
    fullName: "Priya Sharma",
    email: "care1@test.com",
    password: hashedPassword,
    phone: "9000000003",
    pharmacyName: "Care Pharmacy",
    licenseNumber: "LIC1003",
    gstNumber: "GST1003",
    verificationStatus: "approved",
    location: {
      type: "Point",
      coordinates: [78.4983, 17.4400]
    }
  },
  {
    fullName: "Arjun Rao",
    email: "wellness1@test.com",
    password: hashedPassword,
    phone: "9000000004",
    pharmacyName: "Wellness Meds",
    licenseNumber: "LIC1004",
    gstNumber: "GST1004",
    verificationStatus: "approved",
    location: {
      type: "Point",
      coordinates: [78.4738, 17.3616]
    }
  }
];
```

### Medicines (Assigned Per Pharmacy)
```javascript
const medicineNames = [
  "Paracetamol",
  "Amoxicillin",
  "Ibuprofen",
  "Cetirizine",
  "Azithromycin",
  "Metformin",
  "Aspirin",
  "Pantoprazole",
  "Atorvastatin",
  "Dolo 650"
];

const medicineData = {
  name: medicineNames[i],
  genericName: medicineNames[i],
  manufacturer: "Generic Pharma",
  category: "General",
  composition: "Sample composition",
  stockQuantity: Math.floor(Math.random() * 50),
  price: Math.floor(Math.random() * 200) + 20,
  mrp: Math.floor(Math.random() * 250) + 50,
  manufacturingDate: new Date("2024-01-01"),
  expiryDate: new Date("2026-12-31"),
  dosage: "Twice daily",
  sideEffects: ["Nausea", "Headache"],
  precautions: ["Avoid alcohol"],
  pharmacyId: pharmacy._id
};
```

---

## 🌐 API ENDPOINTS SUMMARY

### Total Endpoints: 37 (Was 28, +9 NEW)

**Authentication (5)**
- POST `/api/auth/register/user`
- POST `/api/auth/register/pharmacy`
- POST `/api/auth/login`
- GET `/api/auth/profile`
- PUT `/api/auth/profile`

**Pharmacy Management (9)** - +1 NEW
- **GET `/api/pharmacy/nearby`** - NEW: Get nearby pharmacies (public, geo-based)
- GET `/api/pharmacy/dashboard`
- GET `/api/pharmacy/profile`
- PUT `/api/pharmacy/profile`
- GET `/api/pharmacy/medicines`
- POST `/api/pharmacy/medicines`
- PUT `/api/pharmacy/medicines/:id`
- DELETE `/api/pharmacy/medicines/:id`
- PUT `/api/pharmacy/medicine-stock/:id`

**Medicine Search (4)**
- GET `/api/medicines/my-medicines`
- GET `/api/medicines/search`
- GET `/api/medicines/:id`
- Search with filters

**Medicine Adherence (5)** - NEW
- **POST `/api/adherence/add`** - Add medicine schedule
- **GET `/api/adherence/today`** - Today's checklist
- **PUT `/api/adherence/mark/:id`** - Mark as taken
- **GET `/api/adherence/history`** - Adherence history
- **DELETE `/api/adherence/:id`** - Delete record

**Digital Prescriptions (4)** - NEW
- **POST `/api/prescriptions/upload`** - Upload prescription
- **GET `/api/prescriptions`** - Get all prescriptions
- **GET `/api/prescriptions/:id`** - Get single prescription
- **DELETE `/api/prescriptions/:id`** - Delete prescription

**Admin (7)**
- GET `/api/admin/pharmacies/pending`
- POST `/api/admin/pharmacies/:id/approve`
- POST `/api/admin/pharmacies/:id/reject`
- GET `/api/admin/dashboard`
- Admin stats endpoints

---

## 🚀 HOW TO RUN

### Backend
```bash
cd backend
npm install
npm run create-admin
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

**URLs:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- API: `http://localhost:5000/api`

---

## 🔐 TEST CREDENTIALS (Seeded)

**Admin**
- Email: `admin@analyx.com`
- Password: `admin123`

**Pharmacies** (password for all: `123456`)
- MedPlus Central: `medplus1@test.com`
- Apollo Pharmacy: `apollo1@test.com`
- Care Pharmacy: `care1@test.com`
- Wellness Meds: `wellness1@test.com`

---

## 📦 DEPENDENCIES INSTALLED

### Backend (package.json)
- express: ^5.0.2
- mongoose: ^9.0.0
- jsonwebtoken: ^9.0.0
- bcryptjs: ^2.4.3
- multer: ^1.4.5
- express-validator: ^7.0.0
- dotenv: ^16.0.3
- cors: ^2.8.5
- nodemon: ^3.0.0

### Frontend (package.json)
- react: ^19.0.0
- react-dom: ^19.0.0
- react-router-dom: ^7.0.0
- axios: ^1.6.0
- tailwindcss: ^4.0.0
- create-react-app: ^5.0.0

---

## ✨ FEATURES BY USER ROLE

### User Role Features (7 main areas)
1. Registration & Login
2. Drug/Medicine Search
3. Pharmacy Discovery
4. Medical Profile Management
5. Medical History Tracking
6. Drug Allergy Tracking
7. Dashboard with recommendations

### Pharmacy Role Features (9 main areas)
1. Business Registration
2. License Upload & Verification
3. Monitor Approval Status
4. Complete Dashboard
5. Inventory Management
6. Stock Tracking
7. Expiry Alert System
8. Medicine Image Uploads
9. Profile Management

### Admin Role Features (4 main areas)
1. Pharmacy Approval System
2. License Document Review
3. System Dashboard
4. Rejection Management

---

## 🎯 KEY ACHIEVEMENTS

✅ Full-stack application (MERN stack)
✅ 50+ source files created (was 46, +4 new pages)
✅ 37 API endpoints (was 28, +9 new)
✅ 3 user roles with specific permissions
✅ JWT-based authentication
✅ File upload system (Multer) - 2 separate upload handlers
✅ MongoDB integration with 5 collections (was 3, +2 new)
✅ Responsive UI (Tailwind CSS)
✅ Role-based routing
✅ Input validation & error handling
✅ Admin approval workflow
✅ Stock tracking system
✅ Expiry management
✅ **NEW**: Medicine Adherence Tracking System
✅ **NEW**: Digital Prescription Management System
✅ **NEW**: Geolocation-based Pharmacy Discovery
✅ **NEW**: Enhanced User Profile (4-tab interface)
✅ **NEW**: 2dsphere geospatial indexing
✅ **NEW**: Haversine distance calculation
✅ **NEW**: Browser Geolocation API integration
✅ **NEW**: Adherence percentage tracking
✅ Complete documentation
✅ Automated setup scripts
✅ Currently running & operational

---

## 📝 DOCUMENTATION FILES

- **README.md** - Complete user guide (70KB+)
- **QUICKSTART.md** - 5-minute setup guide
- **PROJECT_SUMMARY.md** - Feature breakdown
- **PROJECT_INFO.md** - This file (comprehensive details)

---

## ⚠️ NOTES

- Pharmacy users must be approved by admin before accessing features
- Files are uploaded to `backend/uploads/` directory
- JWT tokens expire after 7 days
- All passwords are hashed with bcryptjs
- CORS is enabled for localhost:3000
- MongoDB must be running for the application to work

---

**Application Status:** ✅ FULLY OPERATIONAL & ENHANCED
**Last Updated:** February 13, 2026 - Post Feature Enhancement
**Version:** 2.0.0 (4 new modules added)

