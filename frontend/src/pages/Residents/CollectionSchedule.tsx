/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/style.css';
import Sidebar from '../../components/Residents/Sidebar';
import Navbar from '../../components/Residents/Navbar';
import { Snackbar, Alert } from '@mui/material';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { parseISO, format, startOfWeek as dfStartOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface Schedule {
  id: number;
  zone: string;
  barangay: string;
  collection_date: string;
  collection_time: string;
  notes: string;
  created_at: string;
}

interface ScheduleEvent extends Event {
  id: number;
  notes: string;
  zone: string;
  barangay: string;
}

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek: (date: any) => dfStartOfWeek(date, { locale: enUS }),
  getDay,
  locales,
});

const CollectionSchedule = () => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [filteredSchedule, setFilteredSchedule] = useState<Schedule[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'warning' | 'info',
  });
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/schedule/view_collection`)
      .then((res) => {
        setSchedule(res.data);
        setFilteredSchedule(res.data);
      })
      .catch((err) => console.error('Failed to fetch schedule:', err));
  }, [apiUrl]);

  const events: ScheduleEvent[] = filteredSchedule.map((item) => {
    const datePart = new Date(item.collection_date);
    const [hours, minutes] = item.collection_time.split(':').map(Number);
    const start = new Date(
      datePart.getFullYear(),
      datePart.getMonth(),
      datePart.getDate(),
      hours,
      minutes
    );
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour

    return {
      id: item.id,
      title: `${item.zone} - ${item.barangay}`,
      start,
      end,
      allDay: false,
      notes: item.notes,
      zone: item.zone,
      barangay: item.barangay,
    };
  });

  const handleSelectEvent = (event: ScheduleEvent) => {
    const sched = schedule.find((s) => s.id === event.id);
    if (sched) {
      setSelectedSchedule(sched);
      setIsModalOpen(true);
    }
  };

  const handleSelectSlot = () => {
    setSnackbar({
      open: true,
      message: 'Clicking on empty slot. Add schedule logic goes here.',
      severity: 'info',
    });
  };

  const closeSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'info' });
  };

  return (
    <div>
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Collection Schedule</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Collection Schedule</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Collection Schedule</a></li>
          </ul>

          <div className="efinance-table-container">
            <div style={{ height: 600, marginTop: 20 }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                views={['month', 'week', 'day']}
                defaultView="week"
                onSelectEvent={handleSelectEvent}
                selectable
                onSelectSlot={handleSelectSlot}
                popup
                tooltipAccessor={(event: ScheduleEvent) => {
                  const title = typeof event.title === 'string' ? event.title : String(event.title);
                  return event.notes ? `${title}\nNotes: ${event.notes}` : title;
                }}
              />
            </div>
          </div>
        </main>
      </section>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Modal */}
      {isModalOpen && selectedSchedule && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Schedule Details</h2>
            <p><strong>Zone:</strong> {selectedSchedule.zone}</p>
            <p><strong>Barangay:</strong> {selectedSchedule.barangay}</p>
<p><strong>Date:</strong> {format(new Date(selectedSchedule.collection_date), 'MMMM dd, yyyy')}</p>
<p><strong>Time:</strong> {format(new Date(`1970-01-01T${selectedSchedule.collection_time}`), 'hh:mm a')}</p>

            <p><strong>Notes:</strong> {selectedSchedule.notes}</p>
            <button onClick={() => setIsModalOpen(false)} className="close-button">Close</button>
          </div>
        </div>
      )}

      {/* Inline Modal Styles (optional, move to CSS for production) */}
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }
        .modal {
          background: white;
          padding: 20px;
          border-radius: 10px;
          max-width: 400px;
          width: 100%;
        }
        .close-button {
          margin-top: 20px;
          padding: 8px 16px;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .close-button:hover {
          background: #1565c0;
        }
      `}</style>
    </div>
  );
};

export default CollectionSchedule;
