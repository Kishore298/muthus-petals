import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from "../componets/images/logo.jpg";
import { auth } from "../Login/firebase";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-left">
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
  );
};

export default AdminNavbar;
