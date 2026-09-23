import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import logo from "../images/logo.jpg"
import { FaEnvelope, FaPhone, FaInstagram, FaFacebook, FaYoutube, FaHeadset } from "react-icons/fa";
import { LuPhone } from "react-icons/lu";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-col footer-col-brand">
          <div className="footer-logo">
            <img
              src={logo}
              alt="Muthu's Petals Logo"
              className="footer-logo-img"
            />
            <h2 className="footer-logo-text">Muthu's Petals</h2>
          </div>
          <p className="tagline">
            Muthus Petals is a brand created with love, care, and trust 💚<br />
            Our mission is to bring quality, comfort, and confidence through carefully crafted creations made with passion ✨
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3>Quick Shop</h3>
          <ul>
            <li><Link to="/haircare">Shampoo</Link></li>
            <li><Link to="/skincare">Aloe Vera Gel</Link></li>
            <li><Link to="/products">Face Serum</Link></li>
            <li><Link to="/products">Lip Balm</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h3>Contact</h3>
          <ul>
            <li>
              <a href="mailto:muthuspetals@gmail.com" className="footer-icon-link">
                <span className="footer-icon-wrapper"><FaEnvelope /></span>
                muthuspetals@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+916381181527" className="footer-icon-link">
                <span className="footer-icon-wrapper"><LuPhone /></span>
                +91 6381181527
              </a>
            </li>
            <li>
              <Link to="/contact" className="footer-icon-link">
                <span className="footer-icon-wrapper"><FaHeadset /></span>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-col">
          <h3>Social Media</h3>
          <ul>
            <li>
              <a href="https://www.instagram.com/muthus_petals_official?utm_source=qr&igsh=dmt1OWJpcWFmcHlp" className="footer-icon-link">
                <span className="footer-icon-wrapper"><FaInstagram style={{ color: "#E4405F" }} /></span>
                Instagram
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/profile.php?id=61579168031168" className="footer-icon-link">
                <span className="footer-icon-wrapper"><FaFacebook style={{ color: "#1877F2" }} /></span>
                Facebook
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@MuthusPetals" className="footer-icon-link">
                <span className="footer-icon-wrapper"><FaYoutube style={{ color: "#FF0000" }} /></span>
                YouTube
              </a>
            </li>
          </ul>
        </div>

        {/* Info */}
        <div className="footer-col">
          <h3>Information</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/policy">Policy & Return</Link></li>
            <li><Link to="/shipping">Shipping Policy</Link></li>
            <li><Link to="/contact">India | Chennai</Link></li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2026 MUTHU'S PETALS. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
