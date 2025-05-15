import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/style.css';
import Sidebar from '../../components/Admin/Sidebar';
import Navbar from '../../components/Admin/Navbar';
import { Snackbar, Alert } from '@mui/material';
import UpdateScheduleModal from '../../components/Admin/UpdateScheduleModal';
import AddScheduleModal from '../../components/Admin/AddScheduleModal';

interface Schedule {
  id: number;
  zone: string;
  barangay: string;
  collection_date: string;
  collection_time: string;
  notes:string;
  created_at: string;
}

const ManageSchedule = () => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [filteredSchedule, setFilteredSchedule] = useState<Schedule[]>([]); // For filtered results
   const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const admin_id = localStorage.getItem('admin_id') || '';
  const apiUrl = import.meta.env.VITE_API_URL;
  
useEffect(() => {
  axios.get(`${apiUrl}/api/schedule/${admin_id}`)
    .then(res => {
      setSchedule(res.data);
      setFilteredSchedule(res.data); // Initially show all expenses
    })
    .catch(err => console.error('Failed to fetch schedule:', err));
}, [apiUrl, admin_id]);


  const handleUpdate = (scheduleId: number) => {
    const scheduleToUpdate = schedule.find((schedule) => schedule.id === scheduleId);
    setSelectedSchedule(scheduleToUpdate || null);
  };


  const handleDelete = (scheduleId: number) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this schedule?');
    if (isConfirmed) {
      axios.delete(`${apiUrl}/api/schedule/${scheduleId}`)
        .then(() => {
          setSchedule(schedule.filter((schedule) => schedule.id !== scheduleId));
          setSnackbar({
            open: true,
            message: "Schedule deleted successfully!",
            severity: "success",
          });
  
          // Reload the page after a successful delete
          setTimeout(() => {
            window.location.reload();
          }, 2000); // Add a delay to allow the snackbar to be displayed before reloading
        })
        .catch(err => {
          console.error('Failed to delete schedule:', err);
          setSnackbar({
            open: true,
            message: 'Failed to delete schedule. Please try again.',
            severity: 'error',
          });
        });
    }
  };
  

  const closeSnackbar = () => {
    setSnackbar({
      open: false,
      message: '',
      severity: 'info',
    });
  };

  // Handle search filter
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = schedule.filter(schedule =>
        schedule.zone.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSchedule(filtered);
    } else {
      setFilteredSchedule(schedule); // Show all expenses if search is empty
    }
  };

  // Pagination logic
  const indexOfLastSchedule = currentPage * itemsPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - itemsPerPage;
  const currentSchedule = filteredSchedule.slice(indexOfFirstSchedule, indexOfLastSchedule );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Manage Schedule</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Schedule</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Manage Schedule</a></li>
          </ul>

          <div className="efinance-table-container">
            <div className="efinance-table-controls">
              <input
                type="text"
                className="efinance-table-search"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="action-buttons">
              <button onClick={() => setIsAddScheduleOpen(true)} className="btn add-btn">
                Add Schedule
              </button>
            </div> 
            
    
            
           



            <table className="efinance-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Zone</th>
                  <th>Barangay</th>
                  <th>Collection Date</th>
                  <th>Collection Time</th>
                  <th>Notes</th>
                  <th>Created_at</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentSchedule.length > 0 ? (
                  currentSchedule.map((schedule) => (
                    <tr key={schedule.id}>
                      <td>{schedule.id}</td>
                      <td>{schedule.zone}</td>
                      <td>{schedule.barangay}</td>
<td>{new Date(schedule.collection_date).toISOString().split('T')[0]}</td>
<td>{new Date(`1970-01-01T${schedule.collection_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</td>

                      <td>{schedule.notes}</td>
                      <td>{new Date(schedule.created_at).toLocaleDateString()}</td>
                      <td>
                                <button onClick={() => handleUpdate(schedule.id)} className="btn update-btn">
                          Update
                        </button>
                        <button onClick={() => handleDelete(schedule.id)} className="btn delete-btn">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>No resident found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div
  className="efinance-table-footer"
  style={{
    width: '100%',
    display: 'flex',
    alignItems: 'right',
    justifyContent: 'space-between',
    padding: '10px',
    marginTop: '20px',
    gap: '10px'
  }}
>
  <span>Showing {currentSchedule.length} entries</span>
  <div
    className="efinance-pagination"
    style={{
      display: 'flex',
      gap: '6px'
    }}
  >
    <button
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
      style={{
        margin: '0 4px',
        padding: '6px 10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#f3f4f6',
        cursor: 'pointer'
      }}
    >
      Previous
    </button>
    {[...Array(Math.ceil(filteredSchedule.length / itemsPerPage))].map((_, index) => (
      <button
        key={index}
        onClick={() => paginate(index + 1)}
        style={{
          margin: '0 4px',
          padding: '6px 10px',
          border: 'none',
          borderRadius: '4px',
          backgroundColor: currentPage === index + 1 ? '#3b82f6' : '#f3f4f6',
          color: currentPage === index + 1 ? 'white' : 'black',
          cursor: 'pointer'
        }}
      >
        {index + 1}
      </button>
    ))}
    <button
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === Math.ceil(filteredSchedule.length / itemsPerPage)}
      style={{
        margin: '0 4px',
        padding: '6px 10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#f3f4f6',
        cursor: 'pointer'
      }}
    >
      Next
    </button>
  </div>
</div>
          </div>
        </main>
      </section>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      Modals
      {isAddScheduleOpen && <AddScheduleModal onClose={() => setIsAddScheduleOpen(false)} />}
      {selectedSchedule && (
        <UpdateScheduleModal onClose={() => setSelectedSchedule(null)} schedule={selectedSchedule} />
      )}
    </div>
  );
};

export default ManageSchedule;
