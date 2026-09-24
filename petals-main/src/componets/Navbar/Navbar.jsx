import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../images/logo.jpg";
import { auth } from "../../Login/firebase";

/* ── Nav Icons ── */
const IconHome = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const IconHairCare = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.5 2.8-1.3 3.8" />
    <path d="M8.7 9.8A4 4 0 0 1 8 6a4 4 0 0 1 4-4" />
    <path d="M12 10c-2 2-3 4-3 7a3 3 0 0 0 6 0c0-3-1-5-3-7z" />
    <path d="M9 17c-2 0-4-1-4-3 0-1.5 1-2.5 2-3" />
    <path d="M15 17c2 0 4-1 4-3 0-1.5-1-2.5-2-3" />
  </svg>
);

const IconSkinCare = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10" />
    <path d="M17 17c0 2.8-2.2 5-5 5" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 5v2M12 17v2M5 12h2M17 12h2" />
  </svg>
);

const IconNewArrivals = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

const IconContact = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconOurStory = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const navItems = [
  { label: "Home", href: "/", icon: <IconHome /> },
  { label: "Hair Care", href: "/haircare", icon: <IconHairCare /> },
  { label: "Skin Care", href: "/skincare", icon: <IconSkinCare /> },
  { label: "New Arrivals", href: "/products", icon: <IconNewArrivals /> },
  { label: "Contact", href: "/contact", icon: <IconContact /> },
  { label: "Our Story", href: "/about", icon: <IconOurStory /> },
];

const TICKER_MSGS = [
  "Free shipping on orders above ₹499",
  "Extra ₹20 off on prepaid orders",
  "Free gift on orders above ₹549",
  "100% Toxin-free ingredients",
];

/* ── Floral logo icon ── */
const FloralIcon = () => (
  <svg width="22" height="22" viewBox="0 0 40 40" fill="none" className="logo-icon">
    <circle cx="20" cy="12" r="5" fill="#c084d4" opacity="0.85" />
    <circle cx="28" cy="20" r="5" fill="#e8a0f0" opacity="0.75" />
    <circle cx="20" cy="28" r="5" fill="#c084d4" opacity="0.85" />
    <circle cx="12" cy="20" r="5" fill="#e8a0f0" opacity="0.75" />
    <circle cx="20" cy="20" r="4" fill="#fff" opacity="0.9" />
    <circle cx="20" cy="20" r="2" fill="#c084d4" />
  </svg>
);

/* ── Desktop dropdown ── */
function NavItem({ item }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <li
      ref={ref}
      className={`nav-item ${open ? "nav-item--open" : ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link to={item.href} className="nav-a">
        {item.icon && <span className="nav-icon">{item.icon}</span>}
        {item.label}
        {item.children && <span className="nav-chevron" aria-hidden="true" />}
      </Link>
      {item.children && (
        <div
          className={`nav-drop ${open ? "nav-drop--visible" : ""}`}
          aria-hidden={!open}
        >
          <ul>
            {item.children.map((c) => (
              <li key={c}><a href="#">{c}</a></li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

/* ── Mobile accordion ── */
function DrawerItem({ item, onClose }) {
  const [open, setOpen] = useState(false);

  const content = (
    <>
      <span className="drawer-text">{item.label}</span>
      {item.icon && <span className="drawer-nav-icon">{item.icon}</span>}
    </>
  );

  if (item.children) {
    return (
      <div className="drawer-item">
        <button
          className="drawer-link drawer-link--row"
          onClick={() => setOpen((v) => !v)}
        >
          {content}
        </button>

        {open && (
          <div className="drawer-sub">
            {item.children.map((c) => (
              <Link
                key={c.label}
                to={c.href}
                className="drawer-sub-link"
                onClick={onClose}
              >
                {c.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="drawer-item">
      <Link
        to={item.href}
        className="drawer-link drawer-link--row"
        onClick={() => {
          onClose();
          window.scrollTo(0, 0);
        }}
      >
        {content}
      </Link>
    </div>
  );
}
/* ── Navbar Icons ── */
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="11" cy="11" r="7" />
    <path d="M16.5 16.5 21 21" />
  </svg>
);

const IconAccount = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconBag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

/* ═══════════════════════════════
   MAIN NAVBAR
═══════════════════════════════ */
export default function Navbar({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const drawerRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("tokens");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("tokens");
      await auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  useEffect(() => {
    const handler = (e) => {
      if (searchOpen && searchRef.current && !searchRef.current.contains(e.target))
        setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      {/* ── Navbar ── */}
      <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar-inner">

          {/* LEFT */}
          <div className="navbar-left">
            <button
              className="hamburger"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className={`hb ${menuOpen ? "hb--open" : ""}`} />
              <span className={`hb ${menuOpen ? "hb--open" : ""}`} />
              <span className={`hb ${menuOpen ? "hb--open" : ""}`} />
            </button>

            <Link to="/" className="logo" aria-label="Muthu's Petals – Home">
              <img src={logo} alt="Muthu's Petals Logo" className="logo-img" />
              <span className="logo-text">
                Muthu's Petals
                <em className="logo-tagline">Nourishing Hair & Skin Care</em>
              </span>
            </Link>
          </div>

          {/* CENTRE */}
          <nav className="nav-links" aria-label="Primary navigation">
            <ul>
              {navItems.map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
            </ul>
          </nav>

          {/* RIGHT */}
          <div className="navbar-right">
            <Link to="/profile" className="icon-btn" aria-label="My account">
              <IconAccount />
            </Link>
            {isLoggedIn ? (
              <Link to="/dashboard" className="nav-login-btn">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="nav-login-btn">
                Login
              </Link>
            )}
            <Link to="/cart" className="icon-btn cart-btn" aria-label={`Cart, ${cartCount} items`}>
              <IconBag />
              {cartCount > 0 && (
                <span className="cart-badge" aria-hidden="true">{cartCount}</span>
              )}
            </Link>
          </div>

        </div>
      </header>

      {/* ── Overlay ── */}
      <div
        className={`drawer-overlay ${menuOpen ? "drawer-overlay--on" : ""}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer ── */}
      <aside
        ref={drawerRef}
        className={`drawer ${menuOpen ? "drawer--open" : ""}`}
        aria-label="Mobile navigation"
        aria-modal="true"
        role="dialog"
        hidden={!menuOpen}
      >
        <div className="drawer-head">
          <Link to="/" className="drawer-logo" onClick={close}>
            <FloralIcon />
            Muthu's Petals
          </Link>
          <button className="drawer-close" onClick={close} aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="drawer-nav">
          {navItems.map((item) => (
            <DrawerItem key={item.label} item={item} onClose={close} />
          ))}
        </nav>

        <div className="drawer-footer">
          <div className="drawer-footer-icons" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <Link to="/profile" className="drawer-foot-btn" onClick={close} aria-label="Account">
                <IconAccount />
                <span>Account</span>
              </Link>
              {isLoggedIn ? (
                <Link to="/dashboard" className="drawer-foot-btn" onClick={close} aria-label="Dashboard" style={{ background: 'none', border: '1px solid var(--c-border)' }}>
                  <IconAccount />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link to="/login" className="drawer-foot-btn" onClick={close} aria-label="Login">
                  <IconAccount />
                  <span>Login</span>
                </Link>
              )}
            </div>
            <Link to="/cart" className="drawer-foot-btn" onClick={close} aria-label="Cart" style={{ width: '100%', justifyContent: 'center' }}>
              <IconBag />
              <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
            </Link>
          </div>
          <Link to="/products" className="drawer-cta" onClick={close}>
            Shop Now
          </Link>
        </div>
      </aside>
    </>
  );
}
