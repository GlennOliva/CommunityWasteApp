import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/style.css';
import Sidebar from '../../components/Admin/Sidebar';
import Navbar from '../../components/Admin/Navbar';
// import AddBudgetModal from '../../components/User/AddBudgetModal';
// import UpdateBudgetModal from '../../components/User/UpdateBudgetModal';
import { Snackbar, Alert } from '@mui/material';

interface Resident {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  address: string;
  zone: string;
  barangay: string;
  image: string;
  created_at: string;
}

const ManageResident = () => {
  const [resident, setResident] = useState<Resident[]>([]);
  const [filteredResident, setFilteredResident] = useState<Resident[]>([]); // For filtered results
  // const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  // const [residentProfile , setResidentProfile] = useState<{
  //   image:string,
  // } | null>(null);
//   const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
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
  axios.get(`${apiUrl}/api/user`)
    .then(res => {
      setResident(res.data);
      setFilteredResident(res.data); // Initially show all expenses
    })
    .catch(err => console.error('Failed to fetch resident:', err));
}, [apiUrl]);




  const handleDelete = (userId: number) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this resident?');
    if (isConfirmed) {
      axios.delete(`${apiUrl}/api/user/${userId}`)
        .then(() => {
          setResident(resident.filter((resident) => resident.id !== userId));
          setSnackbar({
            open: true,
            message: "Resident deleted successfully!",
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
      const filtered = resident.filter(resident =>
        resident.first_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredResident(filtered);
    } else {
      setFilteredResident(resident); // Show all expenses if search is empty
    }
  };

  // Pagination logic
  const indexOfLastResident = currentPage * itemsPerPage;
  const indexOfFirstResident = indexOfLastResident - itemsPerPage;
  const currentResident = filteredResident.slice(indexOfFirstResident, indexOfLastResident);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Manage Residents</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Residents</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Manage Residents</a></li>
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
{/* 
            <div className="action-buttons">
              <button onClick={() => setIsAddBudgetOpen(true)} className="btn add-btn">
                Add Budget
              </button>
            </div> 
            
              id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  address: string;
  zone: string;
  barangay: string;
  image: string;
  created_at: string;
            
            */}



            <table className="efinance-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Contact Number</th>
                  <th>Address</th>
                  <th>Zone</th>
                  <th>Barangay</th>
                  <th>Image</th>
                  <th>Created_at</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentResident.length > 0 ? (
                  currentResident.map((resident) => (
                    <tr key={resident.id}>
                      <td>{resident.id}</td>
                      <td>{resident.first_name + ' ' + resident.last_name}</td>
                      <td>{resident.email}</td>
                      <td>{resident.contact_number}</td>
                      <td>{resident.address}</td>
                      <td>{resident.zone}</td>
                      <td>{resident.barangay}</td>
                      <td style={{width:'100px'}}><img src={`${apiUrl}/uploads/${resident.image}`} alt="Profile" /></td>
                      <td>{new Date(resident.created_at).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => handleDelete(resident.id)} className="btn delete-btn">
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
  <span>Showing {currentResident.length} entries</span>
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
    {[...Array(Math.ceil(filteredResident.length / itemsPerPage))].map((_, index) => (
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
      disabled={currentPage === Math.ceil(filteredResident.length / itemsPerPage)}
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

      {/* Modals
      {isAddBudgetOpen && <AddBudgetModal onClose={() => setIsAddBudgetOpen(false)} />}
      {selectedBudget && (
        <UpdateBudgetModal onClose={() => setSelectedBudget(null)} budget={selectedBudget} />
      )} */}
    </div>
  );
};

export default ManageResident;
