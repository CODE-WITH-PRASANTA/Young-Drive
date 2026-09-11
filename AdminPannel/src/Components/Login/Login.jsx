import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

import {
  FaUser,
  FaCarAlt,
  FaKey,
  FaShieldAlt,
} from "react-icons/fa";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: true,
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    const identifier =
      formData.identifier.trim().toLowerCase();

    const password =
      formData.password;

    /* ===================================================
       DEMO ADMIN LOGIN
    =================================================== */

    if (
      identifier === "youngdrive" &&
      password === "12345"
    ) {
      /*
       * Clear old authentication values first.
       * This prevents an old/invalid login state
       * from interfering with the new login.
       */

      sessionStorage.removeItem(
        "isAdminAuthenticated"
      );

      localStorage.removeItem(
        "isAdminAuthenticated"
      );

      localStorage.removeItem(
        "adminAuth"
      );

      /* =================================================
         SESSION AUTH
      ================================================= */

      sessionStorage.setItem(
        "isAdminAuthenticated",
        "true"
      );

      /* =================================================
         LOCAL AUTH
      ================================================= */

      localStorage.setItem(
        "isAdminAuthenticated",
        "true"
      );

      localStorage.setItem(
        "adminAuth",
        "true"
      );

      /* =================================================
         ADMIN USER DATA
      ================================================= */

      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          username: "youngdrive",
          name: "Young Drives Admin",
          email: "admin@youngdrives.com",
          phone: "",
          role: "Super Admin",
          avatar: null,
        })
      );

      /* =================================================
         LOGIN SUCCESS
      ================================================= */

      setErrorMessage("");
      setIsSuccess(true);

      /*
       * Give the success animation a little time,
       * then go directly to dashboard.
       */

      setTimeout(() => {
        navigate("/dashboard", {
          replace: true,
        });
      }, 1000);
    } else {
      setErrorMessage(
        "Invalid Credentials! Use ID: youngdrive & Pass: 12345"
      );
    }
  };

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="Login-container">

      {/* =================================================
          SUCCESS OVERLAY
      ================================================= */}

      {isSuccess && (
        <div className="Login-success-overlay">

          <div className="Login-success-card-3d">

            <div className="Login-success-icon-wrapper">
              <FiCheckCircle
                size={80}
                className="Login-success-icon"
              />
            </div>

            <h1 className="Login-success-title">
              LOGIN SUCCESSFUL
            </h1>

            <p className="Login-success-subtitle">
              Welcome back to Young Drives
              Rental Admin
            </p>

            <div className="Login-success-loader"></div>

          </div>

        </div>
      )}

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div
        className={`Login-card-wrapper ${
          isSuccess
            ? "Login-blur"
            : ""
        }`}
      >

        {/* =================================================
            LEFT BRANDING
        ================================================= */}

        <div className="Login-brand-section">

          <div className="Login-brand-header">

            <div className="Login-logo-container">

              <div className="Login-logo-badge">
                <FaCarAlt
                  size={22}
                  color="#e63946"
                />
              </div>

              <div className="Login-logo-text-group">

                <h2 className="Login-brand-title">
                  Young Drives
                </h2>

                <span className="Login-brand-subtitle">
                  PREMIUM CAR RENTALS
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              HERO
          ================================================= */}

          <div className="Login-hero-content">

            <h1 className="Login-hero-heading">

              Drive Your Way Across
              <br />

              <span className="Login-hero-highlight">
                Odisha's Scenic Routes
              </span>

            </h1>

            <p className="Login-hero-description">
              Experience hassle-free
              self-drive rentals, luxury
              cars, and budget rides.
              Clean fleets, instant
              bookings, and total freedom
              on the road.
            </p>

            {/* =================================================
                FEATURES
            ================================================= */}

            <div className="Login-features-grid">

              <div className="Login-feature-item">

                <FaKey
                  size={14}
                  className="Login-feature-icon"
                />

                <span>
                  Self-Drive Fleet
                </span>

              </div>

              <div className="Login-feature-item">

                <FaShieldAlt
                  size={14}
                  className="Login-feature-icon"
                />

                <span>
                  24/7 Roadside Assist
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="Login-hero-footer">

            <p className="Login-handwritten">
              Rent Fast. Drive Free.
            </p>

          </div>

        </div>

        {/* =================================================
            RIGHT LOGIN FORM
        ================================================= */}

        <div className="Login-form-section">

          {/* =================================================
              AVATAR
          ================================================= */}

          <div className="Login-avatar-container">

            <div className="Login-avatar-3d">

              <FaUser
                size={26}
                color="#e63946"
              />

            </div>

          </div>

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="Login-form-header">

            <h2>
              Welcome Back
            </h2>

            <p>
              Login to manage your
              rentals, bookings, and
              fleet operations.
            </p>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {errorMessage && (
            <div className="Login-error-badge">
              {errorMessage}
            </div>
          )}

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="Login-form"
          >

            {/* =================================================
                USERNAME
            ================================================= */}

            <div className="Login-input-group">

              <FiMail
                className="Login-input-icon"
                size={18}
              />

              <input
                type="text"
                name="identifier"
                placeholder="Email Address or Mobile Number"
                value={
                  formData.identifier
                }
                onChange={
                  handleChange
                }
                autoComplete="username"
                required
              />

            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="Login-input-group">

              <FiLock
                className="Login-input-icon"
                size={18}
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="Login-password-toggle"
                onClick={() =>
                  setShowPassword(
                    (prev) =>
                      !prev
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <FiEyeOff
                    size={18}
                  />
                ) : (
                  <FiEye
                    size={18}
                  />
                )}
              </button>

            </div>

            {/* =================================================
                OPTIONS
            ================================================= */}

            <div className="Login-form-options">

              <label className="Login-checkbox-label">

                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={
                    formData.rememberMe
                  }
                  onChange={
                    handleChange
                  }
                />

                <span>
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="Login-forgot-link"
                onClick={() =>
                  setErrorMessage(
                    "Please contact the administrator to reset your password."
                  )
                }
              >
                Forgot Password?
              </button>

            </div>

            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="submit"
              className="Login-submit-btn"
              disabled={isSuccess}
            >

              <span>
                {isSuccess
                  ? "Logging in..."
                  : "Login"}
              </span>

              <FiArrowRight
                size={18}
              />

            </button>

            {/* =================================================
                DIVIDER
            ================================================= */}

            <div className="Login-divider">

              <span>
                Default Admin Credentials
              </span>

            </div>

            {/* =================================================
                CREDENTIALS
            ================================================= */}

            <div className="Login-credentials-box">

              <div className="Login-cred-item">

                <span className="Login-cred-label">
                  ID:
                </span>

                <span className="Login-cred-value">
                  youngdrive
                </span>

              </div>

              <div className="Login-cred-divider">
                |
              </div>

              <div className="Login-cred-item">

                <span className="Login-cred-label">
                  Password:
                </span>

                <span className="Login-cred-value">
                  12345
                </span>

              </div>

            </div>

            {/* =================================================
                SIGNUP
            ================================================= */}

            <p className="Login-signup-prompt">

              Don't have an account?

              <button
                type="button"
                onClick={() =>
                  setErrorMessage(
                    "Please contact the administrator to create an account."
                  )
                }
              >
                Create Account
              </button>

            </p>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Login;