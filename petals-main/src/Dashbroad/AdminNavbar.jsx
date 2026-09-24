import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from "../componets/images/logo.jpg";
import { auth } from "../Login/firebase";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef(null);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("tokens");
      await auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Create Product", path: "/createproduct" },
    { name: "All Products", path: "/showallproducts" },
    { name: "Orders", path: "/showallorders" },
    { name: "Testimonials", path: "/Showalltestimonial" },
    { name: "Gallery", path: "/creategallery" },
  ];

  const close = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (menuOpen && drawerRef.current && !drawerRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <>
      <nav className="admin-navbar">
        <div className="admin-nav-left">
          <button 
            className="admin-hamburger" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <span className={`admin-hb ${menuOpen ? "admin-hb--open" : ""}`} />
            <span className={`admin-hb ${menuOpen ? "admin-hb--open" : ""}`} />
            <span className={`admin-hb ${menuOpen ? "admin-hb--open" : ""}`} />
          </button>
          <img src={logo} alt="Logo" className="admin-logo-img" />
          <span className="admin-title">Petals Admin</span>
        </div>

        <div className="admin-nav-links">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`admin-nav-item ${location.pathname === link.path ? "active" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="admin-nav-right">
          <Link to="/" className="admin-btn-outline">Storefront</Link>
          <button onClick={handleLogout} className="admin-btn-solid">Logout</button>
        </div>
      </nav>

      {/* Overlay */}
      <div 
        className={`admin-drawer-overlay ${menuOpen ? "admin-drawer-overlay--on" : ""}`} 
        onClick={close} 
      />

      {/* Mobile Drawer */}
      <aside 
        ref={drawerRef} 
        className={`admin-drawer ${menuOpen ? "admin-drawer--open" : ""}`}
      >
        <div className="admin-drawer-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logo} alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            <span style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px', fontWeight: 'bold', color: '#f1f1f6' }}>Petals Admin</span>
          </div>
          <button className="admin-drawer-close" onClick={close}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="admin-drawer-links">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`admin-drawer-item ${location.pathname === link.path ? "active" : ""}`}
              onClick={close}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="admin-drawer-footer">
          <Link to="/" className="admin-drawer-btn-outline" onClick={close}>Storefront</Link>
          <button onClick={handleLogout} className="admin-drawer-btn-solid">Logout</button>
        </div>
      </aside>
    </>
  );
};

export default AdminNavbar;
