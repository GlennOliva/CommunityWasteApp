import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import '../../css/style.css'; // Import your CSS file here
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || ""; // Ensure fallback


interface AddPickupRequestModalProps {
  onClose: () => void;
}

const AddPickupRequestModal: React.FC<AddPickupRequestModalProps> = ({ onClose }) => {
  // Corrected states
  const [request_type, setRequestType] = useState("");
  const [schedule_date, setScheduleDate] = useState("");
  const [schedule_time, setScheduleTime] = useState("");
  const[notes, setNotes] = useState("");
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

    const data = {
      user_id: user_id,
      request_type: request_type,
      schedule_date: schedule_date,
      schedule_time: schedule_time,
      notes: notes
  
    };
    

    try {
      await axios.post(`${apiUrl}/api/pickup_request/add_pickup_request`, data);

      setSnackbar({
        open: true,
        message: "Pickup Request created successfully!",
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
        <h2 className="efinance-modal-title">Add Pickup Request</h2>

        <form onSubmit={handleSubmit} className="efinance-form">
          <div className="efinance-form-grid">
            <div className="efinance-form-group">
              <label>Request Name</label>
              <input
                type="text"
                value={request_type}
                onChange={(e) => setRequestType(e.target.value)}
                required
              />
            </div>
            <div className="efinance-form-group">
              <label>Schedule Date</label>
              <input
                type="date"
                value={schedule_date}
                onChange={(e) => setScheduleDate(e.target.value)}
                required
              />
            </div>
            <div className="efinance-form-group">
              <label>Schedule Time</label>
              <input
                type="time"
                value={schedule_time}
                onChange={(e) => setScheduleTime(e.target.value)}
                required
              />
            </div>


        <div className="efinance-form-group">
  <label>Notes</label>
  <textarea
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    required
    rows={4}
    placeholder="Enter notes here..."
    className="efinance-form-control"
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

export default AddPickupRequestModal;
