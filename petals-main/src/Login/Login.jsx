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
          <div className="login-brand" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', alignItems: 'center', textAlign: 'center' }}>
            <h1 style={{ fontSize: '48px', lineHeight: '1.2' }}>Pure. Organic.<br/>Natural.</h1>
            <p style={{ fontSize: '18px', marginTop: '16px', color: 'rgba(255,255,255,0.8)' }}>Experience the touch of nature</p>
          </div>
          <div className="login-features">
            <div className="login-feature-item">
              <span>🌿</span>
              <span>100% Organic Products</span>
            </div>
            <div className="login-feature-item">
              <span>✨</span>
              <span>Premium Quality</span>
            </div>
            <div className="login-feature-item">
              <span>🚚</span>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="login-right">
          <div className="login-form-box">
            
            {/* Logo & Brand Name (Visible on all devices) */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ 
                backgroundImage: `url(${logoImg})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                width: '84px', 
                height: '84px', 
                borderRadius: '50%', 
                margin: '0 auto 16px', 
                border: '3px solid rgba(124,58,237,0.4)',
                boxShadow: '0 8px 24px rgba(124,58,237,0.2)'
              }}></div>
              <h1 style={{ fontSize: '26px', color: '#f1f1f6', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>Muthu's Petals</h1>
              <p style={{ color: '#9898b3', fontSize: '14px', margin: 0 }}>Sign in to your admin account to continue.</p>
            </div>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleLogin}>
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

