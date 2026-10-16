import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import logoImg from "../componets/images/logo.jpg";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    axios
      .post(`${BASE_URL}/api/v1/login`, { email, password })
      .then((response) => {
        if (response.data.success === "success") {
          localStorage.setItem("tokens", response.data.token);
          toast.success("Login successful!");
          if (response.data.role === "admin") {
            navigate("/dashboard");
          } else if (response.data.role === "user") {
            navigate("/");
          } else {
            navigate("/register");
          }
        } else {
          setError(response.data.message);
          toast.error(response.data.message);
        }
      })
      .catch((err) => {
        let errorMessage = "An error occurred. Please try again.";
        if (err.response) {
          errorMessage = err.response.data.message || errorMessage;
        } else if (err.request) {
          errorMessage = "No response from server. Please try again later.";
        } else {
          errorMessage = err.message;
        }
        setError(errorMessage);
        toast.error(errorMessage);
      })
      .finally(() => setLoading(false));
  };

  const googleSignin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email === "vvigneshwaran518@gmail.com") {
        navigate("/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      toast.error("Google sign-in failed.");
    }
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="login-page">

        {/* Left branding panel */}
        <div className="login-left">
          <div className="login-left-content">
            <div className="login-hero-badge">
              <span className="badge-dot"></span>
              <span>100% Certified Organic</span>
            </div>
            <h1 className="login-hero-title">
              Pure. Organic.<br />Natural.
            </h1>
            <p className="login-hero-subtitle">
              Experience the touch of nature with handcrafted botanical wellness.
            </p>

            <div className="login-features">
              <div className="login-feature-item">
                <span className="feature-icon">🌿</span>
                <span className="feature-text">100% Organic Products</span>
              </div>
              <div className="login-feature-item">
                <span className="feature-icon">✨</span>
                <span className="feature-text">Handcrafted Premium Quality</span>
              </div>
              <div className="login-feature-item">
                <span className="feature-icon">🚚</span>
                <span className="feature-text">Fast & Reliable Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="login-right">
          <div className="login-form-box">
            
            {/* Logo & Brand Name (Centered on all devices) */}
            <div className="login-header">
              <div 
                className="login-logo"
                style={{ backgroundImage: `url(${logoImg})` }}
              ></div>
              <h2 className="login-title">Muthu's Petals</h2>
              <p className="login-subtitle">Sign in to your admin account to continue</p>
            </div>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleLogin} className="login-form">
              <div className="login-form-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  className="login-input"
                  placeholder="admin@petals.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button id="login-submit-btn" type="submit" className="login-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

