# Analyx Drug Scanner - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

Open two terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Setup Environment Files

**Backend (.env):**
```bash
cd backend
copy .env.example .env
```

**Frontend (.env):**
```bash
cd frontend
copy .env.example .env
```

### Step 3: Start MongoDB

Make sure MongoDB is running:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Step 4: Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
✅ Backend running on http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```
✅ Frontend running on http://localhost:3000

## 🎯 First Time Setup

### 1. Create Admin User

Open MongoDB Shell or Compass and run:

```javascript
use analyx

// First, hash your admin password using Node.js console:
// const bcrypt = require('bcryptjs');
// bcrypt.hashSync('admin123', 10);

db.users.insertOne({
  fullName: "Admin User",
  email: "admin@analyx.com",
  // Replace with your hashed password
  password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
  phoneNumber: "1234567890",
  age: 30,
  gender: "Other",
  city: "Admin City",
  state: "Admin State",
  emergencyContactName: "Emergency Contact",
  emergencyContactPhone: "0987654321",
  role: "admin",
  isActive: true,
  medicalConditions: [],
  knownDrugAllergies: [],
  createdAt: new Date()
})
```

### 2. Test User Accounts

You can create test accounts through the web interface:

**Test User:**
- Go to http://localhost:3000
- Click "Register" → "As User"
- Fill in the form and submit

**Test Pharmacy:**
- Click "Register" → "As Pharmacy"
- Fill in the form
- Upload a sample license document
- Submit and wait for admin approval

### 3. Login as Admin

- Email: `admin@analyx.com`
- Password: `admin123` (if you used the password above)

## 📱 Testing the Flow

### User Flow:
1. Register as user
2. Login
3. Search for medicines
4. View medicine details

### Pharmacy Flow:
1. Register as pharmacy
2. Wait on verification status page
3. Admin approves
4. Access dashboard
5. Add medicines
6. Manage stock

### Admin Flow:
1. Login as admin
2. View pending pharmacies
3. Review details and license
4. Approve or reject

## 🐛 Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in backend .env file

### Cannot Find Module
```
Error: Cannot find module 'express'
```
**Solution:** Run `npm install` in the respective directory

### CORS Error
**Solution:** Make sure backend is running on port 5000 and frontend on 3000

## 📚 API Testing

You can test the API using tools like:
- **Postman**: Import the endpoints from README
- **Thunder Client** (VS Code extension)
- **cURL** commands

Example Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@analyx.com","password":"admin123"}'
```

## 🔑 Default Credentials

After creating admin:
- **Admin**: admin@analyx.com / admin123

Create your own test users through registration!

## 📞 Need Help?

Check the main README.md for:
- Complete API documentation
- Project structure
- Feature details
- Security information

Happy Coding! 🎉
