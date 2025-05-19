import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/style.css';
import Sidebar from '../../components/Residents/Sidebar';
import Navbar from '../../components/Residents/Navbar';
import { Snackbar, Alert } from '@mui/material';
import UpdateComplaintModal from '../../components/Residents/UpdateComplaintModal';
import AddComplaintModal from '../../components/Residents/AddComplaintModal';

interface Compliant {
  id: number;
  user_id: number;
  full_name: string;
  compliant_category: string;
  details: string;
  image_attach: string;
  status: string;
  created_at: string;
}

const ManageCompliant = () => {
  const [compliant, setCompliant] = useState<Compliant[]>([]);
  const [filteredCompliant, setFilteredCompliant] = useState<Compliant[]>([]); // For filtered results
   const [selectedCompliant, setSelectedCompliant] = useState<Compliant | null>(null);
      const [isAddCompliantOpen, setIsCompliantOpen] = useState(false);
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

const user_id = localStorage.getItem('user_id');
  const apiUrl = import.meta.env.VITE_API_URL;
  
useEffect(() => {
  if (!user_id) {
    console.error("User ID not found in localStorage.");
    return;
  }

  axios.get(`${apiUrl}/api/compliant/user_compliant/${user_id}`)
    .then(res => {
      setCompliant(res.data);
      setFilteredCompliant(res.data);
    })
    .catch(err => console.error('Failed to fetch compliant:', err));
}, [apiUrl, user_id]);


  const handleUpdate = (compliantId: number) => {
    const compliantToUpdate = compliant.find((compliant) => compliant.id === compliantId);
    setSelectedCompliant(compliantToUpdate || null);
  };



  const handleDelete = (compliantId: number) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this compliant?');
    if (isConfirmed) {
      axios.delete(`${apiUrl}/api/compliant/${compliantId}`)
        .then(() => {
          setCompliant(compliant.filter((compliant) => compliant.id !== compliantId));
          setSnackbar({
            open: true,
            message: "Compliant deleted successfully!",
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
            message: 'Failed to delete resident. Please try again.',
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
      const filtered = compliant.filter(compliant =>
        compliant.compliant_category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCompliant(filtered);
    } else {
      setFilteredCompliant(compliant); // Show all expenses if search is empty
    }
  };

  // Pagination logic
  const indexOfLastCompliant = currentPage * itemsPerPage;
  const indexOfFirstCompliant = indexOfLastCompliant - itemsPerPage;
  const currentCompliant = filteredCompliant.slice(indexOfFirstCompliant, indexOfLastCompliant);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Manage Compliant</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Compliants</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Manage Compliants</a></li>
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
              <button onClick={() => setIsCompliantOpen(true)} className="btn add-btn">
                Add Compliant
              </button>
            </div> 

            <table className="efinance-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Complaint Name</th>
                  <th>Details</th>
                  <th>Image</th>
                  <th>Status</th>
                  <th>Created_at</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCompliant.length > 0 ? (
                  currentCompliant.map((compliant) => (
                    <tr key={compliant.id}>
                      <td>{compliant.id}</td>
                      <td>{compliant.full_name}</td>
                      <td>{compliant.compliant_category}</td>
                      <td>{compliant.details}</td>
                      <td style={{width:'100px'}}><img src={`${apiUrl}/uploads/${compliant.image_attach}`} alt="Profile" /></td>
             <td>
  <span
    style={{
      padding: '4px 8px',
      borderRadius: '4px',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor:
        compliant.status === 'Completed'
          ? 'green'
          : compliant.status === 'Pending'
          ? 'orange'
          : compliant.status === 'Ongoing'
          ? 'goldenrod'
          : compliant.status === 'Cancelled'
          ? 'red'
          : 'gray',
    }}
  >
    {compliant.status}
  </span>
</td>
                      <td>{new Date(compliant.created_at).toLocaleDateString()}</td>
                      <td>
                             <button onClick={() => handleUpdate(compliant.id)} className="btn update-btn">
                          Update
                        </button>
                        <button onClick={() => handleDelete(compliant.id)} className="btn delete-btn">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>No compliant found.</td>
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
  <span>Showing {currentCompliant.length} entries</span>
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
    {[...Array(Math.ceil(filteredCompliant.length / itemsPerPage))].map((_, index) => (
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
      disabled={currentPage === Math.ceil(filteredCompliant.length / itemsPerPage)}
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

   {isAddCompliantOpen && <AddComplaintModal onClose={() => setIsCompliantOpen(false)} />}
      {selectedCompliant && (
        <UpdateComplaintModal onClose={() => setSelectedCompliant(null)} compliant={selectedCompliant} />
      )}
    </div>
  );
};

export default ManageCompliant;
