import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import UserRegister from './pages/UserRegister';
import PharmacyRegister from './pages/PharmacyRegister';
import DrugSearch from './pages/DrugSearch';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import Adherence from './pages/user/Adherence';
import Prescriptions from './pages/user/Prescriptions';
import NearbyPharmacies from './pages/user/NearbyPharmacies';

// Pharmacy Pages
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';
import VerificationStatus from './pages/pharmacy/VerificationStatus';
import ManageMedicines from './pages/pharmacy/ManageMedicines';
import AddMedicine from './pages/pharmacy/AddMedicine';
import EditMedicine from './pages/pharmacy/EditMedicine';
import StockManagement from './pages/pharmacy/StockManagement';
import PharmacyProfile from './pages/pharmacy/PharmacyProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingPharmacies from './pages/admin/PendingPharmacies';

// Components
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import MobileFooterNav from './components/MobileFooterNav';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/user" element={<UserRegister />} />
            <Route path="/register/pharmacy" element={<PharmacyRegister />} />
            <Route path="/search" element={<DrugSearch />} />

            {/* User Routes */}
            <Route
              path="/user/dashboard"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <UserDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/profile"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <UserProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/adherence"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <Adherence />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/prescriptions"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <Prescriptions />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/pharmacies"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <NearbyPharmacies />
                </PrivateRoute>
              }
            />

            {/* Pharmacy Routes */}
            <Route
              path="/pharmacy/verification"
              element={
                <PrivateRoute allowedRoles={['pharmacy']}>
                  <VerificationStatus />
                </PrivateRoute>
              }
            />
            <Route
              path="/pharmacy/dashboard"
              element={
                <PrivateRoute allowedRoles={['pharmacy']} requireVerification={true}>
                  <PharmacyDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/pharmacy/medicines"
              element={
                <PrivateRoute allowedRoles={['pharmacy']} requireVerification={true}>
                  <ManageMedicines />
                </PrivateRoute>
              }
            />
            <Route
              path="/pharmacy/medicines/add"
              element={
                <PrivateRoute allowedRoles={['pharmacy']} requireVerification={true}>
                  <AddMedicine />
                </PrivateRoute>
              }
            />
            <Route
              path="/pharmacy/medicines/edit/:id"
              element={
                <PrivateRoute allowedRoles={['pharmacy']} requireVerification={true}>
                  <EditMedicine />
                </PrivateRoute>
              }
            />
            <Route
              path="/pharmacy/stock"
              element={
                <PrivateRoute allowedRoles={['pharmacy']} requireVerification={true}>
                  <StockManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/pharmacy/profile"
              element={
                <PrivateRoute allowedRoles={['pharmacy']}>
                  <PharmacyProfile />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/pharmacies/pending"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <PendingPharmacies />
                </PrivateRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <MobileFooterNav />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
