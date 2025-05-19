import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/style.css';
import Sidebar from '../../components/Residents/Sidebar';
import Navbar from '../../components/Residents/Navbar';
import { Snackbar, Alert } from '@mui/material';
import UpdatePickupRequestModal from '../../components/Residents/UpdatePickupRequestModal';
import AddPickupRequestModal from '../../components/Residents/AddPickupRequestModal';


interface PickupRequest {
  id: number;
  user_id: number;
  full_name: string;
  request_type: string;
  schedule_date: string;
  schedule_time: string;
  status: string;
  notes: string;
  created_at: string;
}

const ManagePickupRequest = () => {
  const [pickup_request, setPickupRequest] = useState<PickupRequest[]>([]);
  const [filteredPickupRequest, setFilteredPickupRequest] = useState<PickupRequest[]>([]); // For filtered results
   const [selectedPickupRequest, setSelectedPickupRequest] = useState<PickupRequest | null>(null);
   const user_id = localStorage.getItem('user_id') || '' ;
     const [isAddPickupRequestOpen, setIsAddPickupRequestOpen] = useState(false);
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


  const apiUrl = import.meta.env.VITE_API_URL;
  
useEffect(() => {
  if (!user_id) return;  // skip fetching if no user_id

  axios.get(`${apiUrl}/api/pickup_request/user/${user_id}`)
    .then(res => {
      setPickupRequest(res.data);
      setFilteredPickupRequest(res.data);
    })
    .catch(err => console.error('Failed to fetch pickup_request:', err));
}, [apiUrl, user_id]);



  const handleUpdate = (pick_up_requestId: number) => {
    const pickuprequestToUpdate = pickup_request.find((pickup_request) => pickup_request.id === pick_up_requestId);
    setSelectedPickupRequest(pickuprequestToUpdate || null);
  };



  const handleDelete = (pick_up_requestId: number) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this pickup request?');
    if (isConfirmed) {
      axios.delete(`${apiUrl}/api/pickup_request/${pick_up_requestId}`)
        .then(() => {
          setPickupRequest(pickup_request.filter((pickup_request) => pickup_request.id !== pick_up_requestId));
          setSnackbar({
            open: true,
            message: "Pickup Request deleted successfully!",
            severity: "success",
          });
  
          // Reload the page after a successful delete
          setTimeout(() => {
            window.location.reload();
          }, 2000); // Add a delay to allow the snackbar to be displayed before reloading
        })
        .catch(err => {
          console.error('Failed to delete resident:', err);
          setSnackbar({
            open: true,
            message: 'Failed to delete pickup request. Please try again.',
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
      const filtered = pickup_request.filter(pickup_request =>
        pickup_request.request_type.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPickupRequest(filtered);
    } else {
      setFilteredPickupRequest(pickup_request); // Show all expenses if search is empty
    }
  };

  // Pagination logic
  const indexOfLastPickupRequest = currentPage * itemsPerPage;
  const indexOfFirstPickupRequest = indexOfLastPickupRequest - itemsPerPage;
  const currentPickupRequest = filteredPickupRequest.slice(indexOfFirstPickupRequest, indexOfLastPickupRequest);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Manage Pickup Request</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Pickup Request</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Manage Pickup Request</a></li>
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
              <button onClick={() => setIsAddPickupRequestOpen(true)} className="btn add-btn">
                Add Pickup Request
              </button>
            </div> 
            


            <table className="efinance-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Request Name</th>
                  <th>Schedule Date</th>
                  <th>Schedule Time</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Created_at</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPickupRequest.length > 0 ? (
                  currentPickupRequest.map((pickup_request) => (
                    <tr key={pickup_request.id}>
                      <td>{pickup_request.id}</td>
                      <td>{pickup_request.full_name}</td>
                      <td>{pickup_request.request_type}</td>
<td>{new Date(pickup_request.schedule_date).toISOString().split('T')[0]}</td>
<td>{new Date(`1970-01-01T${pickup_request.schedule_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</td>
                      <td>{pickup_request.notes}</td>
                 <td>
  <span
    style={{
      padding: '4px 8px',
      borderRadius: '4px',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor:
        pickup_request.status === 'Completed'
          ? 'green'
          : pickup_request.status === 'Pending'
          ? 'orange'
          : pickup_request.status === 'Ongoing'
          ? 'goldenrod'
          : pickup_request.status === 'Cancelled'
          ? 'red'
          : 'gray',
    }}
  >
    {pickup_request.status}
  </span>
</td>
                      <td>{new Date(pickup_request.created_at).toLocaleDateString()}</td>
                      <td>
                             <button onClick={() => handleUpdate(pickup_request.id)} className="btn update-btn">
                          Update
                        </button>
                        <button onClick={() => handleDelete(pickup_request.id)} className="btn delete-btn">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>No Pickup Request found.</td>
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
  <span>Showing {currentPickupRequest.length} entries</span>
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
    {[...Array(Math.ceil(filteredPickupRequest.length / itemsPerPage))].map((_, index) => (
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
      disabled={currentPage === Math.ceil(filteredPickupRequest.length / itemsPerPage)}
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

   {isAddPickupRequestOpen && <AddPickupRequestModal onClose={() => setIsAddPickupRequestOpen(false)} />}
      {selectedPickupRequest && (
        <UpdatePickupRequestModal onClose={() => setSelectedPickupRequest(null)} pickup_request={selectedPickupRequest} />
      )}
    </div>
  );
};

export default ManagePickupRequest;
