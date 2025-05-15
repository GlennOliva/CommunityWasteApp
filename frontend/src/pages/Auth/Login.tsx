/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/images/CWS-LOGO.png";
import "../../css/login.css";
import { Snackbar, Alert } from "@mui/material";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "success" | "error" | "warning" | "info",
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  //console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);

  const navigate = useNavigate();

const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!email || !password) {
    setSnackbar({ open: true, message: "Email and password are required.", severity: "error" });
    return;
  }

  try {
    // Try Admin login first
    const response = await axios.post(`${apiUrl}/api/admin/login`, { email, password });

    if (response.status === 200) {
      const admin = response.data.admin;
      console.log("Admin Login Successful:", admin);

      localStorage.setItem("admin_id", admin.id);
      setSnackbar({ open: true, message: "Admin Login Successful!", severity: "success" });

      // Return here to stop further execution
      setTimeout(() => navigate("/admin/dashboard"), 1500);
      return;
    }
  } catch (error: unknown) {
    // Only log error here — don't show snackbar yet, because we will try user login next
    console.log("Admin login failed, trying user login...");
  }

  try {
    // Try User login
    const userResponse = await axios.post(`${apiUrl}/api/user/login`, { email, password });

    if (userResponse.status === 200) {
      const user = userResponse.data.user;
      localStorage.setItem("user_id", user.id);
      console.log("User Login Successful:", user.id);
      setSnackbar({ open: true, message: "User Login Successful!", severity: "success" });
      setTimeout(() => navigate("/user/dashboard"), 1500);
      return;
    }
  } catch (userError) {
    if (axios.isAxiosError(userError) && userError.response) {
      setSnackbar({
        open: true,
        message: userError.response.data?.message || "Login failed",
        severity: "error",
      });
    } else {
      setSnackbar({ open: true, message: "An unexpected error occurred.", severity: "error" });
    }
  }
};


  return (
    <div className="login-container">
      <div className="login-left">
        <img src={logo} alt="Logo" className="login-logo" />
        <h1 className="login-title">COMMUNITY WASTE SYSTEM</h1>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2 className="login-header">LOGIN PAGE</h2>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <i className="bx bx-envelope email-icon"></i>
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <i className="bx bx-lock password-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input-field password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`bx ${showPassword ? "bx-hide" : "bx-show"} eye-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <button className="login-button" type="submit">
              LOGIN
            </button>

            <h1 style={{ paddingTop: '10px', fontSize: '14px' }}>
              Don't have an account? <Link to="/register">Sign Up here!</Link>
            </h1>
          </form>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
