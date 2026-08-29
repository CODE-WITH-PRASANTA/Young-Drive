import React, { useEffect, useState } from "react";
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
import API from "../../api/axios";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isRegister, setIsRegister] = useState(false);
  const [adminExists, setAdminExists] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const auth = localStorage.getItem("adminAuth");

    if (token || auth === "true") {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [navigate]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setCheckingAdmin(true);

        const response = await API.get(
          "/auth/setup-status"
        );

       

        const data = response.data || {};

        const exists =
          data.adminExists === true ||
          data.setupComplete === true ||
          data.isSetup === true ||
          data.adminCreated === true;

        setAdminExists(exists);

        if (exists) {
          setIsRegister(false);
        } else {
          setIsRegister(false);
        }
      } catch (error) {
        console.error(
          "ADMIN STATUS ERROR:",
          error
        );

        setAdminExists(false);
        setIsRegister(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const resetMessages = () => {
    setMessage("");
    setMessageType("");
  };

  const switchMode = () => {
    if (adminExists) {
      return;
    }

    setIsRegister((prev) => !prev);

    resetForm();
    resetMessages();
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    resetMessages();

    const enteredUsername = username.trim();

    if (!enteredUsername || !password) {
      setMessage(
        "❌ Username and password are required"
      );

      setMessageType("error");

      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/login",
        {
          username: enteredUsername,
          password,
        }
      );

     

      const data = response.data || {};

      if (data.success) {
        const token =
          data.token ||
          data.accessToken ||
          data.jwt;

        const loggedUser =
          data.admin ||
          data.user ||
          data.data;

        if (token) {
          localStorage.setItem(
            "adminToken",
            token
          );
        }

        if (loggedUser) {
          localStorage.setItem(
            "adminUser",
            JSON.stringify({
              id:
                loggedUser.id ||
                loggedUser._id,

              username:
                loggedUser.username ||
                enteredUsername,

              role:
                loggedUser.role ||
                "Super Admin",
            })
          );
        } else {
          localStorage.setItem(
            "adminUser",
            JSON.stringify({
              username: enteredUsername,
              role: "Super Admin",
            })
          );
        }

        localStorage.setItem(
          "adminAuth",
          "true"
        );

        setIsLoggedIn(true);

        setMessage(
          "Login Successful"
        );

        setMessageType("success");

        setTimeout(() => {
          navigate("/dashboard", {
            replace: true,
          });
        }, 700);
      } else {
        setMessage(
          data.message ||
            "❌ Invalid Username or Password"
        );

        setMessageType("error");
      }
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      if (error.response) {
        setMessage(
          `❌ ${
            error.response.data?.message ||
            "Invalid Username or Password"
          }`
        );
      } else if (error.request) {
        setMessage(
          "❌ Unable to connect to server"
        );
      } else {
        setMessage(
          "❌ Something went wrong. Please try again."
        );
      }

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    resetMessages();

    if (adminExists) {
      setMessage(
        "❌ Admin is already registered. Please login."
      );

      setMessageType("error");
      setIsRegister(false);

      return;
    }

    const enteredUsername = username.trim();

    if (
      !enteredUsername ||
      !password ||
      !confirmPassword
    ) {
      setMessage(
        "❌ Please fill all fields"
      );

      setMessageType("error");

      return;
    }

    if (enteredUsername.length < 3) {
      setMessage(
        "❌ Username must be at least 3 characters"
      );

      setMessageType("error");

      return;
    }

    if (password.length < 5) {
      setMessage(
        "❌ Password must be at least 5 characters"
      );

      setMessageType("error");

      return;
    }

    if (password !== confirmPassword) {
      setMessage(
        "❌ Passwords do not match"
      );

      setMessageType("error");

      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/setup",
        {
          username: enteredUsername,
          password,
        }
      );

     

      const data = response.data || {};

      if (data.success) {
        setAdminExists(true);
        setIsRegistered(true);

        setMessage(
          "Registration Successful"
        );

        setMessageType("success");

        resetForm();

        setTimeout(() => {
          setIsRegistered(false);
          setIsRegister(false);
          resetMessages();
        }, 1200);
      } else {
        setMessage(
          data.message ||
            "❌ Registration failed"
        );

        setMessageType("error");
      }
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      const status =
        error.response?.status;

      const responseData =
        error.response?.data || {};

      if (
        status === 400 ||
        status === 403 ||
        responseData.adminExists === true ||
        responseData.setupComplete === true
      ) {
        setAdminExists(true);
        setIsRegister(false);

        resetForm();

        setMessage(
          responseData.message ||
            "❌ Admin is already registered. Please login."
        );

        setMessageType("error");

        return;
      }

      if (error.response) {
        setMessage(
          `❌ ${
            responseData.message ||
            "Registration failed"
          }`
        );
      } else if (error.request) {
        setMessage(
          "❌ Unable to connect to server"
        );
      } else {
        setMessage(
          "❌ Something went wrong. Please try again."
        );
      }

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (isRegister) {
      handleRegister(e);
    } else {
      handleLogin(e);
    }
  };

  if (checkingAdmin) {
    return (
      <div className="login-page">
        <div className="login-card">

          <div className="login-left">

            <div className="left-top">

              <img
                src={logo}
                alt="DRIVE X"
                className="login-logo"
              />

              <div className="company-info">

                <h3>
                  YOUNG DRIVEX
                </h3>

                <span>
                  PREMIUM CAR SOLUTIONS
                </span>

              </div>

            </div>

            <div className="dot-pattern top-dots"></div>

            <div className="left-content">

              <h1>
                YOUNG DRIVE
                <br />
                X
              </h1>

              <div className="line"></div>

              <p>
                Welcome to the DRIVE X Admin
                Dashboard. Manage fleet,
                bookings, inventory, and
                automotive operations securely.
              </p>

              <div className="secure-card">

                <FaCarAlt />

                <div>

                  <h4>
                    Secure Portal
                  </h4>

                  <span>
                    Your security is our priority.
                  </span>

                </div>

              </div>

            </div>

            <div className="wave one"></div>
            <div className="wave two"></div>
            <div className="wave three"></div>

            <div className="dot-pattern bottom-dots"></div>

          </div>

          <div className="login-right">

            <div className="top-icon">
              <FaCarAlt />
            </div>

            <h2>
              Welcome Back
            </h2>

            <p className="subtitle">
              Checking secure admin portal...
            </p>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-left">

          <div className="left-top">

            <img
              src={logo}
              alt="DRIVE X"
              className="login-logo"
            />

            <div className="company-info">

              <h3>
                YOUNG DRIVEX
              </h3>

              <span>
                PREMIUM CAR SOLUTIONS
              </span>

            </div>

          </div>

          <div className="dot-pattern top-dots"></div>

          <div className="left-content">

            <h1>
             YOUNG DRIVE
             
              X
            </h1>

            <div className="line"></div>

            <p>
              Welcome to the YOUNG DRIVE X Admin
              Dashboard. Manage fleet,
              bookings, inventory, and
              automotive operations securely.
            </p>

            <div className="secure-card">

              <FaCarAlt />

              <div>

                <h4>
                  Secure Portal
                </h4>

                <span>
                  Your security is our priority.
                </span>

              </div>

            </div>

          </div>

          <div className="wave one"></div>
          <div className="wave two"></div>
          <div className="wave three"></div>

          <div className="dot-pattern bottom-dots"></div>

        </div>

        <div className="login-right">

          {isLoggedIn ? (

            <div className="login-success-screen">

              <div className="success-icon">
                ✓
              </div>

              <h2>
                Login Successfully
              </h2>

              <p>
                Welcome to DRIVE X Admin
                Dashboard
              </p>

              <span>
                Redirecting to Dashboard...
              </span>

            </div>

          ) : isRegistered ? (

            <div className="login-success-screen">

              <div className="success-icon">
                ✓
              </div>

              <h2>
                Registration Successful
              </h2>

              <p>
                Your DRIVE X Admin account
                has been created successfully.
              </p>

              <span>
                Please wait...
              </span>

            </div>

          ) : (

            <>

              <div className="top-icon">
                <FaCarAlt />
              </div>

              <h2>
                {isRegister
                  ? "Create Account"
                  : "Welcome Back"}
              </h2>

              <p className="subtitle">
                {isRegister
                  ? "Create your one-time admin account"
                  : "Sign in to continue to your dashboard"}
              </p>

              {message && (
                <div
                  className={`login-message ${messageType}`}
                >
                  {message}
                </div>
              )}

              <form
                className="login-form"
                onSubmit={handleSubmit}
              >

                <div className="input-box">

                  <FaUser className="input-icon" />

                  <input
                    type="text"
                    placeholder={
                      isRegister
                        ? "Create Username"
                        : "Enter Username"
                    }
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value
                      )
                    }
                    autoComplete="username"
                    required
                    disabled={loading}
                  />

                </div>

                <div className="input-box">

                  <FaLock className="input-icon" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder={
                      isRegister
                        ? "Create Password"
                        : "Enter Password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    autoComplete={
                      isRegister
                        ? "new-password"
                        : "current-password"
                    }
                    required
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="eye"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={loading}
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

                {isRegister && (

                  <div className="input-box">

                    <FaLock className="input-icon" />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      autoComplete="new-password"
                      required
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="eye"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>

                  </div>

                )}

                {!isRegister && (

                  <div className="options-row">

                    <label>

                      <input
                        type="checkbox"
                        name="remember"
                      />

                      Remember me

                    </label>

                  </div>

                )}

                <div className="credentials-hint">

                  <FaInfoCircle />

                  <span>
                    {isRegister
                      ? "This admin account can be registered only once."
                      : "Enter the username and password created during admin setup."}
                  </span>

                </div>

                <button
                  type="submit"
                  className="login-btn"
                  disabled={loading}
                >
                  {loading
                    ? isRegister
                      ? "Creating Account..."
                      : "Logging in..."
                    : isRegister
                      ? "Register"
                      : "Login"}
                </button>

                {!isRegister && !adminExists && (

                  <p
                    style={{
                      textAlign: "center",
                      marginTop: "15px",
                    }}
                  >
                    New user?{" "}

                    <button
                      type="button"
                      onClick={switchMode}
                      disabled={loading}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontWeight: "600",
                        textDecoration: "underline",
                      }}
                    >
                      Register
                    </button>

                  </p>

                )}

                {isRegister && (

                  <p
                    style={{
                      textAlign: "center",
                      marginTop: "15px",
                    }}
                  >
                    Already have an account?{" "}

                    <button
                      type="button"
                      onClick={switchMode}
                      disabled={loading}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontWeight: "600",
                        textDecoration: "underline",
                      }}
                    >
                      Login
                    </button>

                  </p>

                )}

              </form>

              <p className="copyright">
                © 2026 YOUNG DRIVE X.
                All rights reserved.
              </p>

            </>

          )}

        </div>

      </div>

    </div>
  );
};

export default Login;