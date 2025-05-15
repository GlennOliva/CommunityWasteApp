import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import '../../css/style.css';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || "";

interface Complaint {
  id: number;
  compliant_category: string;
  details: string;
  status: string;
  user_id: number;
  image_attach: string;
}

interface UpdateComplaintModalProps {
  onClose: () => void;
  compliant: Complaint;
}

const UpdateComplaintModal: React.FC<UpdateComplaintModalProps> = ({ onClose, compliant }) => {
  const [status, setStatus] = useState(compliant.status);
  const [newImage, setNewImage] = useState<File | null>(null); // NEW: image file state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as "success" | "error" | "warning" | "info",
  });

  // NEW: Handle file input
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const formData = new FormData();
    formData.append("user_id", String(compliant.user_id));
    formData.append("compliant_category", compliant.compliant_category);
    formData.append("details", compliant.details);
    formData.append("status", status);

    if (newImage) {
      formData.append("image_attach", newImage); // New image selected
    } else {
      formData.append("existing_image", compliant.image_attach); // Fallback to existing image
    }

    await axios.put(`${apiUrl}/api/compliant/${compliant.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    setSnackbar({
      open: true,
      message: "Complaint updated successfully!",
      severity: "success",
    });

    setTimeout(() => {
      onClose();
      setTimeout(() => window.location.reload(), 500);
    }, 2000);
  } catch (error) {
    console.error("Error updating complaint:", error);
    setSnackbar({
      open: true,
      message:
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to update complaint.",
      severity: "error",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="efinance-modal-overlay">
      <div className="efinance-modal-container">
        <h2 className="efinance-modal-title">Update Complaint</h2>

        <form onSubmit={handleSubmit} className="efinance-form" encType="multipart/form-data">
          <div className="efinance-form-grid">
            <div className="efinance-form-group">
              <label>Complaint Category</label>
              <input type="text" value={compliant.compliant_category} readOnly />
            </div>
            <div className="efinance-form-group">
              <label>Details</label>
              <input type="text" value={compliant.details} readOnly />
            </div>

            <div className="efinance-form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                <option value="">-- Select Status --</option>
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="efinance-form-group">
              <label>User ID</label>
              <input type="text" value={compliant.user_id} readOnly />
            </div>

            <div className="efinance-form-group">
              <label>Image Attachment</label>
              <div style={{ marginTop: '10px' }}>
                {compliant.image_attach ? (
                  <img
                    src={`${apiUrl}/uploads/${compliant.image_attach}`}
                    alt="Complaint Attachment"
                    style={{ maxWidth: '50%', height: 'auto', borderRadius: '8px' }}
                  />
                ) : (
                  <p>No image attached.</p>
                )}
              </div>
              <input
                type="file"
                name="image_attach"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginTop: '10px' }}
              />
            </div>
          </div>

          <div className="efinance-button-group">
            <button type="button" onClick={onClose} className="efinance-btn cancel">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="efinance-btn submit">
              {isSubmitting ? "Updating..." : "Update"}
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

export default UpdateComplaintModal;
