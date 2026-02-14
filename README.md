# Analyx Drug Scanner

A comprehensive drug scanner and pharmacy management system with role-based authentication.

## Features

### For Users (Drug Scanner Users)
- **User Registration** with detailed medical history
  - Full Name, Email, Password
  - Phone Number, Age, Gender
  - City/State, Blood Group
  - Existing Medical Conditions
  - Known Drug Allergies
  - Emergency Contact Information
- **Drug Search** - Search medicines from verified pharmacies
- **Medicine Information** - View detailed medicine information including side effects and precautions

### For Pharmacy Owners
- **Pharmacy Registration** with strict verification
  - Personal Information (Name, Email, Phone)
  - Pharmacy Details (Name, License Number, GST Number)
  - Address and Location
  - Working Hours Configuration
  - License Document Upload (PDF/Image)
- **Verification Status Page** - Track admin approval status
- **Dashboard** - Overview of pharmacy statistics
- **Manage Medicines** - Add, edit, and delete medicines
- **Stock Management** - Track low stock and expiring medicines
- **Profile Settings** - Update pharmacy information

### For Admins
- **Admin Dashboard** - System-wide statistics
- **Pharmacy Verification** - Approve or reject pharmacy registrations
- **User Management** - View all registered users

## Tech Stack

### Backend
- **Node.js** & **Express.js v5** - Server framework
- **MongoDB** & **Mongoose v9** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Express Validator** - Input validation

### Frontend
- **React 19** - UI framework
- **React Router v7** - Routing
- **Tailwind CSS v4** - Styling
- **Axios** - API requests

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file by copying `.env.example`:
```bash
copy .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/analyx
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Create the uploads directory:
```bash
mkdir uploads
```

6. Start MongoDB service (if not running):
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

7. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
copy .env.example .env
```

4. Update the `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### Creating an Admin User

Since the first admin user needs to be created manually, you can use MongoDB Compass or MongoDB Shell:

```javascript
// Using MongoDB Shell
use analyx

db.users.insertOne({
  fullName: "Admin User",
  email: "admin@analyx.com",
  password: "$2a$10$YourHashedPasswordHere", // Use bcryptjs to hash "admin123"
  phoneNumber: "1234567890",
  age: 30,
  gender: "Other",
  city: "Admin City",
  state: "Admin State",
  emergencyContactName: "Emergency",
  emergencyContactPhone: "0987654321",
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

Or hash a password using Node.js:
```javascript
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('admin123', salt);
console.log(hash);
```

### User Workflows

#### 1. User Registration and Drug Search
1. Go to `http://localhost:3000`
2. Click "Register" → "As User"
3. Fill in all required information
4. After registration, you'll be logged in automatically
5. Use the "Search Medicines" feature to find drugs

#### 2. Pharmacy Owner Registration
1. Go to `http://localhost:3000`
2. Click "Register" → "As Pharmacy"
3. Fill in personal and pharmacy details
4. Upload license document (PDF or Image)
5. Set working hours
6. Submit registration
7. Wait for admin approval on the Verification Status page

#### 3. Admin Approval Process
1. Login as admin
2. Go to "Pending Pharmacies"
3. Review pharmacy details and license document
4. Approve or reject with reason
5. Pharmacy owner gets updated status

#### 4. Pharmacy Medicine Management
1. After approval, pharmacy can access dashboard
2. Add medicines with all details (stock, price, expiry, etc.)
3. Manage stock levels
4. Track expiring medicines
5. Update prices and quantities

## API Endpoints

### Authentication
- `POST /api/auth/register/user` - Register user
- `POST /api/auth/register/pharmacy` - Register pharmacy
- `POST /api/auth/login` - Login (all roles)
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update profile

### Pharmacy (Protected - Pharmacy Role)
- `GET /api/pharmacy/dashboard` - Get dashboard data
- `PUT /api/pharmacy/profile` - Update pharmacy profile
- `PUT /api/pharmacy/working-hours` - Update working hours

### Medicines
- `GET /api/medicines/search` - Search medicines (Public)
- `POST /api/medicines` - Add medicine (Pharmacy)
- `GET /api/medicines/my-medicines` - Get pharmacy medicines
- `GET /api/medicines/low-stock` - Get low stock medicines
- `GET /api/medicines/expiring` - Get expiring medicines
- `GET /api/medicines/:id` - Get single medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine

### Admin (Protected - Admin Role)
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/pharmacies/pending` - Get pending pharmacies
- `GET /api/admin/pharmacies` - Get all pharmacies
- `PUT /api/admin/pharmacies/:id/approve` - Approve pharmacy
- `PUT /api/admin/pharmacies/:id/reject` - Reject pharmacy
- `GET /api/admin/users` - Get all users

## Role-Based Access Control

- **User Role**: Can search medicines, view their profile
- **Pharmacy Role**: 
  - Pending: Can only view verification status
  - Approved: Full access to dashboard and medicine management
- **Admin Role**: Can manage users and approve/reject pharmacies

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes with role validation
- Pharmacy verification requirement for sensitive operations
- Input validation with express-validator
- File upload restrictions (size, type)

## Project Structure

```
analyx/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── medicineController.js
│   │   └── pharmacyController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Medicine.js
│   │   ├── Pharmacy.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── medicineRoutes.js
│   │   └── pharmacyRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── uploads/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   └── PendingPharmacies.js
│   │   │   ├── pharmacy/
│   │   │   │   ├── AddMedicine.js
│   │   │   │   ├── EditMedicine.js
│   │   │   │   ├── ManageMedicines.js
│   │   │   │   ├── PharmacyDashboard.js
│   │   │   │   ├── PharmacyProfile.js
│   │   │   │   ├── StockManagement.js
│   │   │   │   └── VerificationStatus.js
│   │   │   ├── user/
│   │   │   │   └── UserDashboard.js
│   │   │   ├── DrugSearch.js
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── PharmacyRegister.js
│   │   │   └── UserRegister.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Future Enhancements

- Email verification for users and pharmacies
- OTP verification for phone numbers
- Real-time notifications
- Order management system
- Payment integration
- Medicine barcode scanning
- Prescription upload and verification
- Chat/messaging between users and pharmacies
- Advanced analytics and reports
- Mobile app (React Native)

## License

ISC

## Contributors

Developed for Analyx Drug Scanner Platform
