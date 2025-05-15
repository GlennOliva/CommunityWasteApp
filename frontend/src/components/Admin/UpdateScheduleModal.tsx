import React, {  useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import '../../css/style.css';
import axios from 'axios';

const adminId = localStorage.getItem('admin_id');
const apiUrl = import.meta.env.VITE_API_URL || "";


interface Schedule {
  id: number;
  zone: string;
  barangay: string;
  collection_date: string;
  collection_time: string;
  notes: string;
}

interface UpdateScheduleModalProps {
  onClose: () => void;
  schedule: Schedule;
}

const UpdateScheduleModal: React.FC<UpdateScheduleModalProps> = ({ onClose, schedule }) => {
  const [zone, setZone] = useState(schedule.zone)
  const [barangay , setBarangay] = useState(schedule.barangay)
  const [collection_date, setCollectionDate] = useState(schedule.collection_date.slice(0,10));
  const [collection_time, setCollectionTime] = useState(schedule.collection_time.slice(0,10));
  const [notes, setNotes] = useState(schedule.notes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as "success" | "error" | "warning" | "info",
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
      await axios.put(`${apiUrl}/api/schedule/${schedule.id}`, data); // JSON request
  
      setSnackbar({
        open: true,
        message: "Schedule updated successfully!",
        severity: "success",
      });
  
      setTimeout(() => {
        onClose();
        setTimeout(() => window.location.reload(), 500);
      }, 2000);
    } catch (error) {
      console.error("Error updating budget:", error);
      setSnackbar({
        open: true,
        message:
          axios.isAxiosError(error) && error.response?.data?.error
            ? error.response.data.error
            : "Failed to update schedule.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="efinance-modal-overlay">
      <div className="efinance-modal-container">
        <h2 className="efinance-modal-title">Update Schedule</h2>

        <form onSubmit={handleSubmit} className="efinance-form">
          <div className="efinance-form-grid">
            <div className="efinance-form-group">
              <label>Zone</label>
              <input type="text" value={zone} onChange={(e) => setZone(e.target.value)} required />
            </div>
            <div className="efinance-form-group">
              <label>Barangay</label>
              <input type="text" value={barangay} onChange={(e) => setBarangay(e.target.value)} required />
            </div>
            
            <div className="efinance-form-group">
              <label>Collection Date</label>
              <input type="date" value={collection_date} onChange={(e) => setCollectionDate(e.target.value)} required />
            </div>
            <div className="efinance-form-group">
              <label>Collection Time</label>
              <input type="time" value={collection_time} onChange={(e) => setCollectionTime(e.target.value)} required />
            </div>
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

export default UpdateScheduleModal;
