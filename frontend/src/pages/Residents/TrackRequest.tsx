import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/style.css';
import Sidebar from '../../components/Residents/Sidebar';
import Navbar from '../../components/Residents/Navbar';
import { Snackbar, Alert } from '@mui/material';

interface CombinedRequest {
  id: number;
  user_id: number;
  full_name: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  type: 'complaint' | 'pickup_request';
}

const TrackRequest = () => {
  const [requests, setRequests] = useState<CombinedRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<CombinedRequest[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'warning' | 'info',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/track_request`)
      .then((res) => {
        setRequests(res.data);
        setFilteredRequests(res.data);
      })
      .catch((err) => console.error('Failed to fetch requests:', err));
  }, [apiUrl]);

  const closeSnackbar = () => {
    setSnackbar({
      open: false,
      message: '',
      severity: 'info',
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterRequests(term, filterType);
  };

  const filterRequests = (search: string, type: string) => {
    let updated = requests;

    if (type !== 'all') {
      updated = updated.filter((r) => r.type === type);
    }

    if (search.trim() !== '') {
      updated = updated.filter((r) =>
        r.full_name.toLowerCase().includes(search)
      );
    }

    setFilteredRequests(updated);
    setCurrentPage(1); // Reset to first page on filter
  };

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterType(value);
    filterRequests(searchTerm, value);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Track Requests</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Requests</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Track Requests</a></li>
          </ul>

          <div className="efinance-table-container">
            <div className="efinance-table-controls" style={{ display: 'flex', gap: '1rem' }}>
              <select
                value={filterType}
                onChange={handleFilterTypeChange}
                className="efinance-table-search"
              >
                <option value="all">All</option>
                <option value="complaint">Complaints</option>
                <option value="pickup_request">Pickup Requests</option>
              </select>

              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearch}
                className="efinance-table-search"
              />
            </div>

            <table className="efinance-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.length > 0 ? (
                  currentRequests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.id}</td>
                      <td>{req.full_name}</td>
                      <td>{req.type}</td>
                      <td>{req.title}</td>
                      <td>{req.description}</td>
                  <td>
  <span
    style={{
      padding: '4px 8px',
      borderRadius: '4px',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor:
        req.status === 'Completed'
          ? 'green'
          : req.status === 'Pending'
          ? 'orange'
          : req.status === 'Ongoing'
          ? 'goldenrod'
          : req.status === 'Cancelled'
          ? 'red'
          : 'gray',
    }}
  >
    {req.status}
  </span>
</td>

                      <td>{new Date(req.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>No requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="efinance-table-footer" style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              marginTop: '20px',
            }}>
              <span>Showing {currentRequests.length} of {filteredRequests.length} entries</span>
              <div className="efinance-pagination" style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </button>
                {[...Array(Math.ceil(filteredRequests.length / itemsPerPage))].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    style={{
                      backgroundColor: currentPage === index + 1 ? '#3b82f6' : '#f3f4f6',
                      color: currentPage === index + 1 ? '#fff' : '#000',
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredRequests.length / itemsPerPage)}
                >
                  Next
                </button>
              </div>
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
    </div>
  );
};

export default TrackRequest;
