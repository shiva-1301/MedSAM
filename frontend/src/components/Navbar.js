import React, { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const togglerRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    if (togglerRef.current) {
      togglerRef.current.focus();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top">
      <div className="container-fluid">
        
        {/* LOGO - Left */}
        <Link to="/" className="navbar-brand">
          <span className="fw-bold" style={{ fontSize: '1.5rem', color: '#0066cc' }}>
            Analyx
          </span>
          <span className="ms-2 d-none d-lg-inline" style={{ fontSize: '0.85rem', color: '#666' }}>
            Drug Scanner
          </span>
        </Link>

        {/* NAVIGATION TABS - Center (Desktop Only) */}
        <div className="navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link to="/search" className="nav-link">Search Medicines</Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Register
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link to="/register/user" className="dropdown-item">As User</Link></li>
                    <li><Link to="/register/pharmacy" className="dropdown-item">As Pharmacy</Link></li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/search" className="nav-link">Search Medicines</Link>
                </li>
                {user.role === 'user' && (
                  <>
                    <li className="nav-item">
                      <Link to="/user/dashboard" className="nav-link">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/user/adherence" className="nav-link">Adherence</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/user/prescriptions" className="nav-link">Prescription</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/user/pharmacies" className="nav-link">Pharmacies</Link>
                    </li>
                  </>
                )}
                {user.role === 'pharmacy' && (
                  <>
                    <li className="nav-item">
                      <Link to="/pharmacy/dashboard" className="nav-link">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/pharmacy/medicines" className="nav-link">Medicines</Link>
                    </li>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/admin/pharmacies/pending" className="nav-link">Pending Pharmacies</Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>

        {/* PROFILE ICON + HAMBURGER - Right */}
        <div className="d-flex align-items-center gap-2">
          
          {/* Profile Dropdown */}
          {user && (
            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle d-flex align-items-center p-0" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#0066cc', color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                  {user.fullName?.charAt(0)?.toUpperCase()}
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                {user.role === 'user' && (
                  <li><Link to="/user/profile" className="dropdown-item">My Profile</Link></li>
                )}
                {user.role === 'pharmacy' && (
                  <li><Link to="/pharmacy/profile" className="dropdown-item">My Profile</Link></li>
                )}
                {user.role === 'admin' && (
                  <li><span className="dropdown-item">Admin Panel</span></li>
                )}
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          )}

          {/* Hamburger Toggle - Mobile Only */}
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="drawerNav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
            onClick={toggleMenu}
            ref={togglerRef}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* DRAWER MENU - Mobile Only */}
        <div
          className={`drawer drawer-end${isMenuOpen ? ' show' : ''}`}
          tabIndex="-1"
          id="drawerNav"
          aria-labelledby="drawerNavLabel"
          aria-modal={isMenuOpen ? 'true' : undefined}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="drawerNavLabel">
              <span style={{ color: '#0066cc', fontWeight: 'bold' }}>Analyx</span>
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeMenu}
            ></button>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              {!user ? (
                <>
                  <li className="nav-item">
                    <Link to="/search" className="nav-link" onClick={closeMenu}>Search Medicines</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Register
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><Link to="/register/user" className="dropdown-item" onClick={closeMenu}>As User</Link></li>
                      <li><Link to="/register/pharmacy" className="dropdown-item" onClick={closeMenu}>As Pharmacy</Link></li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/search" className="nav-link" onClick={closeMenu}>Search Medicines</Link>
                  </li>
                  {user.role === 'user' && (
                    <>
                      <li className="nav-item">
                        <Link to="/user/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/user/adherence" className="nav-link" onClick={closeMenu}>Adherence</Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/user/prescriptions" className="nav-link" onClick={closeMenu}>Prescription</Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/user/pharmacies" className="nav-link" onClick={closeMenu}>Pharmacies</Link>
                      </li>
                    </>
                  )}
                  {user.role === 'pharmacy' && (
                    <>
                      <li className="nav-item">
                        <Link to="/pharmacy/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/pharmacy/medicines" className="nav-link" onClick={closeMenu}>Medicines</Link>
                      </li>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <>
                      <li className="nav-item">
                        <Link to="/admin/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/admin/pharmacies/pending" className="nav-link" onClick={closeMenu}>Pending Pharmacies</Link>
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>
          </div>
        </div>

        {isMenuOpen && (
          <div className="drawer-backdrop fade show" onClick={closeMenu}></div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
