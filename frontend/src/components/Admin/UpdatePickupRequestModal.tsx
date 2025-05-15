import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import '../../css/style.css';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || "";

interface PickupRequest {
  id: number;
  request_type: string;
  schedule_date: string;
  schedule_time: string;
  notes: string;
  status: string;
  user_id: number;
}

interface UpdateComplaintModalProps {
  onClose: () => void;
  pickup_request: PickupRequest;
}

const UpdatePickupRequestModal: React.FC<UpdateComplaintModalProps> = ({ onClose, pickup_request }) => {
  const [status, setStatus] = useState(pickup_request.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as "success" | "error" | "warning" | "info",
  });


 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    await axios.put(`${apiUrl}/api/pickup_request/${pickup_request.id}`, {
      user_id: pickup_request.user_id,
      request_type: pickup_request.request_type,
      schedule_date: pickup_request.schedule_date,
      schedule_time: pickup_request.schedule_time,
      notes: pickup_request.notes,
      status: status, // use updated status value
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setSnackbar({
      open: true,
      message: "Pickup Request updated successfully!",
      severity: "success",
    });

    setTimeout(() => {
      onClose();
      setTimeout(() => window.location.reload(), 500);
    }, 2000);
  } catch (error) {
    console.error("Error updating pickup request:", error);
    setSnackbar({
      open: true,
      message:
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to update pickup request.",
      severity: "error",
    });
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <div className="efinance-modal-overlay">
      <div className="efinance-modal-container">
        <h2 className="efinance-modal-title">Update Pickup Request</h2>

        <form onSubmit={handleSubmit} className="efinance-form" encType="multipart/form-data">
          <div className="efinance-form-grid">
            <div className="efinance-form-group">
              <label>Pickup Request Type</label>
              <input type="text" value={pickup_request.request_type} readOnly />
            </div>
         <div className="efinance-form-group">
  <label>Schedule Date</label>
  <input
    type="date"
    value={
      pickup_request.schedule_date
        ? new Date(pickup_request.schedule_date).toISOString().split("T")[0]
        : ""
    }
    readOnly
  />
</div>

<div className="efinance-form-group">
  <label>Schedule Time</label>
  <input
    type="time"
    value={pickup_request.schedule_time || ""}
    readOnly
  />
</div>

<div className="efinance-form-group">
              <label>Notes</label>
              <input type="text" value={pickup_request.notes} readOnly />
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
              <input type="text" value={pickup_request.user_id} readOnly />
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

export default UpdatePickupRequestModal;
