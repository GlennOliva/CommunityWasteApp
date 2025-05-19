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
  const [status] = useState(compliant.status); // Status is readonly
  const [category, setCategory] = useState(compliant.compliant_category);
  const [details, setDetails] = useState(compliant.details);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as "success" | "error" | "warning" | "info",
  });

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
      formData.append("compliant_category", category);
      formData.append("details", details);
      formData.append("status", status); // read-only, but included in payload

      if (newImage) {
        formData.append("image_attach", newImage);
      } else {
        formData.append("existing_image", compliant.image_attach);
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
              <label>Complaint Name</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="efinance-form-group">
              <label>Details</label>
              <input
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </div>

            <div className="efinance-form-group">
              <label>Status</label>
              <select value={status} disabled>
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
