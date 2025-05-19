import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import '../../css/style.css'; // Import your CSS file here
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || ""; // Ensure fallback


interface AddComplaintModalProps {
  onClose: () => void;
}

const AddComplaintModal: React.FC<AddComplaintModalProps> = ({ onClose }) => {
  // Corrected states
  const [compliant_category, setCompliantCategory] = useState("");
  const [details, setDetails] = useState("");
const [image_attach, setImageAttach] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Submit status
const user_id = localStorage.getItem('user_id');
  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

   const formData = new FormData();
formData.append("user_id", user_id || "");
formData.append("compliant_category", compliant_category);
formData.append("details", details);
formData.append("status", "Pending"); // Status is expected by the backend
if (image_attach) {
  formData.append("image_attach", image_attach);
}
    

    try {
  await axios.post(`${apiUrl}/api/compliant/add_compliant`, formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
      setSnackbar({
        open: true,
        message: "Compliant created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }, 2000);
    } catch (error) {
      console.error("Error creating pickup request:", error);
      setSnackbar({
        open: true,
        message:
          axios.isAxiosError(error) && error.response?.data?.error
            ? error.response.data.error
            : "Failed to create schedule.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }; // <-- this closing brace was missing

  return (
    <div className="efinance-modal-overlay">
      <div className="efinance-modal-container">
        <h2 className="efinance-modal-title">Add Complaint</h2>

        <form onSubmit={handleSubmit} className="efinance-form">
          <div className="efinance-form-grid">
            <div className="efinance-form-group">
              <label>Compliant Name</label>
              <input
                type="text"
                value={compliant_category}
                onChange={(e) => setCompliantCategory(e.target.value)}
                required
              />
            </div>
            <div className="efinance-form-group">
              <label>Compliant Details</label>
              <input
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </div>
            <div className="efinance-form-group">
              <label>Compliant Image</label>
         <input
  type="file"
  onChange={(e) => {
    if (e.target.files && e.target.files[0]) {
      setImageAttach(e.target.files[0]);
    }
  }}
  required
/>

            </div>


     

            
          </div>

          <div className="efinance-button-group">
            <button type="button" onClick={onClose} className="efinance-btn cancel">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="efinance-btn submit">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default AddComplaintModal;
