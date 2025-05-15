import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/CWS-LOGO.png";
import "../../css/login.css";
import { Snackbar, Alert } from "@mui/material";
import axios from "axios";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState(""); // Correctly defined state for address
  const [first_name , setFirstName] = useState("");
    const [middle_name , setMiddleName] = useState("");
     const [last_name , setLastName] = useState("");
  const [image, setImage] = useState<File | null>(null); // Typed as File or null
  const [contact_number, setContactNumber] = useState("");
  const [zone , setZone] = useState("");
  const [barangay, setBarangay] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !first_name || !middle_name || !last_name || !image || !address) {
      return setSnackbar({
        open: true,
        message: "All fields are required",
        severity: "error",
      });
    }

    const formData = new FormData();
    formData.append("first_name", first_name);
    formData.append("middle_name", middle_name);
    formData.append("last_name", last_name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", image); // Send file object
    formData.append("address", address); // Corrected to pass address
    formData.append("contact_number", contact_number);
    formData.append("zone", zone);
    formData.append("barangay", barangay);

    try {
             await axios.post(`${apiUrl}/api/user/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSnackbar({
        open: true,
        message: "Registration successful!",
        severity: "success",
      });

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: (err as any)?.response?.data?.error || "Something went wrong",
        severity: "error",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={logo} alt="Logo" className="login-logo" />
        <h1 className="login-title">CWS APP</h1>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2 className="login-header">REGISTER PAGE</h2>

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <i className="bx bx-user email-icon"></i>
              <input
                type="text"
                placeholder="First Name"
                className="input-field"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

                      <div className="input-group">
              <i className="bx bx-user email-icon"></i>
              <input
                type="text"
                placeholder="Middle Name"
                className="input-field"
                value={middle_name}
                onChange={(e) => setMiddleName(e.target.value)}
                required
              />
            </div>

                       <div className="input-group">
              <i className="bx bx-user email-icon"></i>
              <input
                type="text"
                placeholder="Last Name"
                className="input-field"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>


            

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

            <div className="input-group">
              <i className="bx bx-file email-icon"></i>
              <input
                type="file"
                className="input-field"
                onChange={handleFileChange} // Corrected this to handle file changes
                required
              />
            </div>

            <div className="input-group">
              <i className="bx bx-location-plus email-icon"></i>
              <input
                type="text"
                placeholder="Address"
                className="input-field"
                value={address}
                onChange={(e) => setAddress(e.target.value)} // Corrected this to update the address state
                required
              />
            </div>

          <div className="input-group">
  <i className="bx bx-phone email-icon"></i>
  <input
    type="text"
    placeholder="Contact Number"
    className="input-field"
    maxLength={11}
    value={contact_number}
    onChange={(e) => setContactNumber(e.target.value.replace(/\D/, ""))} // only digits
    required
  />
</div>



            
                 <div className="input-group">
              <i className="bx bx-building-house email-icon"></i>
              <input
                type="text"
                placeholder="Zone"
                className="input-field"
                value={zone}
                onChange={(e) => setZone(e.target.value)} // Corrected this to update the address state
                required
              />
            </div>

                       <div className="input-group">
              <i className="bx bx-building-house email-icon"></i>
              <input
                type="text"
                placeholder="Barangay"
                className="input-field"
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)} // Corrected this to update the address state
                required
              />
            </div>

            <button className="login-button" type="submit">
              REGISTER
            </button>

            <h1 style={{ paddingTop: "10px", fontSize: "14px" }}>
              Have an Account? <Link to="/login">Login Here!</Link>
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

export default Register;
