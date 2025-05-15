import React, { useState } from 'react';
import '../../css/style.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface UpdateAdminProfileProps {
  initialFirstName: string;
  initialMiddleName: string;
  initialLastName: string;
  initialEmail: string;
  initialPassword: string;
  initialContactNumber: string;
  image: string;
  adminId: string;
  address: string;
  onClose: () => void;
}

const UpdateAdminProfile: React.FC<UpdateAdminProfileProps> = ({
  initialFirstName,
  initialMiddleName,
  initialLastName,
  initialEmail,
  initialPassword,
  initialContactNumber,
  adminId,
  address,
  onClose
}) => {
  const [firstName , setFirstName] = useState(initialFirstName);
  const [middleName, setMiddleName] = useState(initialMiddleName)
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [userAddress, setUserAddress] = useState(address);
  const [contact_number, setContactNumber] = useState(initialContactNumber);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("middle_name", middleName)
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("address", userAddress);
    formData.append("contact_number", contact_number)
    if (imageFile) {
      formData.append("image", imageFile);
    }

    fetch(`${apiUrl}/api/admin/${adminId}`, {
      method: "PUT",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log('Profile updated:', data);
        setSnackbar({
          open: true,
          message: "Admin Profile updated successfully!",
          severity: "success"
        });
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 3000);
      })
      .catch(err => {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Error updating profile. Please try again.",
          severity: "error"
        });
      });
  };

  return (
    <div className="modal-overlay" style={{ marginTop: '50px' }}>
      <div className="modal-container">
        <h2 className="modal-title">Update User Profile</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
               <div className="form-group">
              <label htmlFor="middle_name">Middle Name</label>
              <input
                type="text"
                id="middle_name"
                name="middle_name"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="full_name">Last Name</label>
              <input
                type="text"
                id="full_name"
                name="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                required
              />
            </div>
                <div className="form-group">
              <label htmlFor="contact_number">Contact Number</label>
              <input
                type="text"
                id="contact_number"
                name="contact_number"
           maxLength={11}
    value={contact_number}
    onChange={(e) => setContactNumber(e.target.value.replace(/\D/, ""))} // only digits
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="user_image">Profile Image</label>
              <input
                type="file"
                id="user_image"
                name="user_image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="button-group">
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
            <button type="submit" className="submit-button">Update Profile</button>
          </div>
        </form>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ marginTop: "50px" }}
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

export default UpdateAdminProfile;
