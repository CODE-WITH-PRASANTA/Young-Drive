import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCarAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Young Drives Logo (1).png"; 
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // यदि पहले से ऑथेंटिकेटेड है, तो सीधे Dashboard पर भेजें
  useEffect(() => {
    if (localStorage.getItem("adminAuth") === "true") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");

    if (
      username.trim() === "drivex" &&
      password === "12345"
    ) {
      // 1. ऑथेंटिकेशन सेट करें
      localStorage.setItem("adminAuth", "true");

      setIsLoggedIn(true);
      setMessage("Login Successful");
      setMessageType("success");

      // 2. /dashboard पर रीडायरेक्ट करें
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 700);
    } else {
      setMessage("❌ Invalid Username or Password");
      setMessageType("error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* LEFT SIDE */}
        <div className="login-left">
          <div className="left-top">
            <img
              src={logo}
              alt="DRIVE X"
              className="login-logo"
            />

            <div className="company-info">
              <h3>DRIVE X</h3>
              <span>PREMIUM CAR SOLUTIONS</span>
            </div>
          </div>

          <div className="dot-pattern top-dots"></div>

          <div className="left-content">
            <h1>
              DRIVE
              <br />X
            </h1>

            <div className="line"></div>

            <p>
              Welcome to the DRIVE X Admin Dashboard.
              Manage fleet, bookings, inventory, and automotive
              operations securely.
            </p>

            <div className="secure-card">
              <FaCarAlt />

              <div>
                <h4>Secure Portal</h4>
                <span>Your security is our priority.</span>
              </div>
            </div>
          </div>

          <div className="wave one"></div>
          <div className="wave two"></div>
          <div className="wave three"></div>

          <div className="dot-pattern bottom-dots"></div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          {isLoggedIn ? (
            <div className="login-success-screen">
              <div className="success-icon">✓</div>
              <h2>Login Successfully</h2>
              <p>Welcome to DRIVE X Admin Dashboard</p>
              <span>Redirecting to Dashboard...</span>
            </div>
          ) : (
            <>
              <div className="top-icon">
                <FaCarAlt />
              </div>

              <h2>Welcome Back</h2>

              <p className="subtitle">
                Sign in to continue to your dashboard
              </p>

              {message && (
                <div className={`login-message ${messageType}`}>
                  {message}
                </div>
              )}

              <form className="login-form" onSubmit={handleLogin}>
                {/* Username */}
                <div className="input-box">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                {/* Password */}
                <div className="input-box">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {/* Options */}
                <div className="options-row">
                  <label>
                    <input type="checkbox" />
                    Remember me
                  </label>
                </div>

                {/* Credentials Hint */}
                <div className="credentials-hint">
                  <FaInfoCircle />
                  <span>
                    <strong>Username:</strong> drivex &nbsp;|&nbsp;{" "}
                    <strong>Password:</strong> 12345
                  </span>
                </div>

                {/* Button */}
                <button type="submit" className="login-btn">
                  Login
                </button>
              </form>

              <p className="copyright">
                © 2026 DRIVE X. All rights reserved.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;