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

interface UpdatePickUpRequestModalProps {
  onClose: () => void;
  pickup_request: PickupRequest;
}

const UpdatePickupRequestModal: React.FC<UpdatePickUpRequestModalProps> = ({ onClose, pickup_request }) => {
  // Add state for fields you want to edit
  const [requestType, setRequestType] = useState(pickup_request.request_type);
  const [scheduleTime, setScheduleTime] = useState(pickup_request.schedule_time || "");

  const [scheduleDate, setScheduleDate] = useState(
    pickup_request.schedule_date
      ? new Date(pickup_request.schedule_date).toISOString().split("T")[0]
      : ""
  );
  const [notes, setNotes] = useState(pickup_request.notes);
  const [status] = useState(pickup_request.status); // readonly - no setter
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
        request_type: requestType,
        schedule_date: scheduleDate,
        schedule_time: scheduleTime,
        notes: notes,
        status: status, // readonly
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
              <input
                type="text"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                required
              />
            </div>

            <div className="efinance-form-group">
              <label>Schedule Date</label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                required
              />
            </div>

            <div className="efinance-form-group">
              <label>Schedule Time</label>
<input
  type="time"
  value={scheduleTime}
  onChange={(e) => setScheduleTime(e.target.value)}
  required
/>


            </div>

            <div className="efinance-form-group">
              <label>Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="efinance-form-group">
              <label>Status</label>
              <select value={status} disabled>
                <option value="">-- Select Status --</option>
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
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
