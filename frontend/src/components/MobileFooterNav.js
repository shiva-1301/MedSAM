import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const MobileFooterNav = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname.startsWith(path);

  const userLinks = [
    { path: '/user/dashboard', label: 'Home', icon: '🏠' },
    { path: '/user/adherence', label: 'Adherence', icon: '💊' },
    { path: '/search', label: 'Search', icon: '🔍' },
    { path: '/user/pharmacies', label: 'Pharmacy', icon: '📍' },
    { path: '/user/prescriptions', label: 'Rx', icon: '📄' },
  ];

  const pharmacyLinks = [
    { path: '/pharmacy/dashboard', label: 'Home', icon: '🏠' },
    { path: '/pharmacy/medicines', label: 'Medicines', icon: '💊' },
    { path: '/pharmacy/stock', label: 'Stock', icon: '📦' },
    { path: '/search', label: 'Search', icon: '🔍' },
    { path: '/pharmacy/profile', label: 'Profile', icon: '⚙️' },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Home', icon: '🏠' },
    { path: '/admin/pharmacies/pending', label: 'Pending', icon: '⏳' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/stats', label: 'Stats', icon: '📊' },
  ];

  let links = [];
  if (user.role === 'user') links = userLinks;
  else if (user.role === 'pharmacy') links = pharmacyLinks;
  else if (user.role === 'admin') links = adminLinks;

  return (
    <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40">
      <div className="grid grid-cols-5 gap-0">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center justify-center py-2 px-1 text-center transition-colors ${
              isActive(link.path)
                ? 'bg-blue-50 text-blue-600 border-t-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="text-xl mb-0.5">{link.icon}</div>
            <span className="text-xs font-medium">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileFooterNav;
