import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'user') navigate('/user/dashboard');
      if (user.role === 'pharmacy') navigate('/pharmacy/verification');
      if (user.role === 'admin') navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Analyx Drug Scanner
            </h1>
            <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-primary-100">
              Your trusted companion for safe medication management and drug information
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
              <Link
                to="/search"
                className="bg-white text-primary-600 px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:bg-primary-50 transition text-sm md:text-base"
              >
                Search Medicines
              </Link>
              <Link
                to="/register/user"
                className="bg-primary-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:bg-primary-800 transition border-2 border-white text-sm md:text-base"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-primary-600 text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Drug Search</h3>
            <p className="text-gray-600">
              Search and find medicines from verified pharmacies near you
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-primary-600 text-3xl md:text-4xl mb-3 md:mb-4">✅</div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Verified Pharmacies</h3>
            <p className="text-gray-600 text-sm md:text-base">
              All pharmacies are verified by admin to ensure authenticity
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-primary-600 text-3xl md:text-4xl mb-3 md:mb-4">💊</div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Medicine Info</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Get detailed information about medicines, side effects, and precautions
            </p>
          </div>
        </div>
      </div>

      {/* For Pharmacies */}
      <div className="bg-gray-100 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-3xl font-bold mb-4">For Pharmacy Owners</h2>
            <p className="text-gray-600 text-lg">
              Register your pharmacy and manage your inventory digitally
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">📊 Inventory Management</h3>
              <p className="text-gray-600">
                Track your medicine stock, get low stock alerts, and manage expiry dates
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">🏪 Digital Presence</h3>
              <p className="text-gray-600">
                Make your pharmacy visible to customers searching for medicines online
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              to="/register/pharmacy"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-block"
            >
              Register Your Pharmacy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
