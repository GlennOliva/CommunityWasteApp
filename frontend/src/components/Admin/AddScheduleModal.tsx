import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import '../../css/style.css'; // Import your CSS file here
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || ""; // Ensure fallback


interface AddScheduleModalProps {
  onClose: () => void;
}

const AddBudgetModal: React.FC<AddScheduleModalProps> = ({ onClose }) => {
  // Corrected states
  const [zone , setZone] = useState("");
  const [barangay, setBarangay] = useState("");
  const [collection_date, setCollectionDate] = useState("");
  const[collection_time, setCollectionTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Submit status
  const adminId = localStorage.getItem('admin_id') || "";
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
      admin_id: adminId,
      zone: zone,
      barangay: barangay,
      collection_date: collection_date,
      collection_time: collection_time,
      notes: notes
  
    };
    

    try {
      await axios.post(`${apiUrl}/api/schedule/add_schedule`, data);

      setSnackbar({
        open: true,
        message: "Schedule created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }, 2000);
    } catch (error) {
      console.error("Error creating schedule:", error);
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
        <h2 className="efinance-modal-title">Add Schedule</h2>

        <form onSubmit={handleSubmit} className="efinance-form">
          <div className="efinance-form-grid">
            <div className="efinance-form-group">
              <label>Zone</label>
              <input
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                required
              />
            </div>
            <div className="efinance-form-group">
              <label>Barangay</label>
              <input
                type="text"
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                required
              />
            </div>
            <div className="efinance-form-group">
              <label>Collection Date</label>
              <input
                type="date"
                value={collection_date}
                onChange={(e) => setCollectionDate(e.target.value)}
                required
              />
            </div>

            <div className="efinance-form-group">
              <label>Collection Time</label>
              <input
                type="time"
                value={collection_time}
                onChange={(e) => setCollectionTime(e.target.value)}
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

export default AddBudgetModal;
