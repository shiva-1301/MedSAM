import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/login');
  };

  return (
    <>
      {/* Fixed Header - Hidden on mobile, visible on desktop */}
      <div className="hidden md:block fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
          
          {/* Logo - Left */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: '#0066cc' }}>
              Analyx
            </span>
            <span className="text-sm" style={{ color: '#666' }}>
              Drug Scanner
            </span>
          </Link>

          {/* Navigation Tabs - Center (only when logged in) */}
          {user && (
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/search" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition">
                Search Medicines
              </Link>
              {user.role === 'user' && (
                <>
                  <Link to="/user/dashboard" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition">
                    Dashboard
                  </Link>
                  <Link to="/user/adherence" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition">
                    Adherence
                  </Link>
                  <Link to="/user/prescriptions" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition">
                    Prescriptions
                  </Link>
                  <Link to="/user/pharmacies" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition">
                    Pharmacies
                  </Link>
                </>
              )}
              {user.role === 'pharmacy' && (
                <>
                  <Link to="/pharmacy/dashboard" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition">
                    Dashboard
                  </Link>
                  <Link to="/pharmacy/medicines" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition">
                    Medicines
                  </Link>
                  <Link to="/pharmacy/stock" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition">
                    Stock
                  </Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition">
                    Dashboard
                  </Link>
                  <Link to="/admin/pharmacies/pending" className="text-gray-700 hover:text-blue-600 text-sm font-medium transition">
                    Pending Pharmacies
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Profile Icon - Right */}
          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-transform hover:scale-110"
                  style={{ backgroundColor: '#0066cc' }}
                >
                  {user.fullName?.charAt(0)?.toUpperCase()}
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {user.role === 'user' && (
                      <Link
                        to="/user/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        My Profile
                      </Link>
                    )}
                    {user.role === 'pharmacy' && (
                      <Link
                        to="/pharmacy/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        My Profile
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <div className="px-4 py-2 text-gray-700 text-sm font-medium">
                        Admin Panel
                      </div>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register/user"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header - Logo and Profile only, visible on mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Logo - Left */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold" style={{ color: '#0066cc' }}>
              Analyx
            </span>
          </Link>

          {/* Profile Icon - Right */}
          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-transform hover:scale-110"
                  style={{ backgroundColor: '#0066cc' }}
                >
                  {user.fullName?.charAt(0)?.toUpperCase()}
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {user.role === 'user' && (
                      <Link
                        to="/user/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        My Profile
                      </Link>
                    )}
                    {user.role === 'pharmacy' && (
                      <Link
                        to="/pharmacy/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        My Profile
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <div className="px-4 py-2 text-gray-700 text-sm font-medium">
                        Admin Panel
                      </div>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-2 md:px-4 py-2 text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register/user"
                  className="px-2 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs md:text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top padding spacer for fixed header */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Navbar;
