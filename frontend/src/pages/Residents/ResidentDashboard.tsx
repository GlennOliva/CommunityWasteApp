import Navbar from '../../components/Residents/Navbar';
import Sidebar from '../../components/Residents/Sidebar';
import '../../css/style.css';

import { useEffect, useState } from 'react';
import axios from 'axios';

const ResidentDashboard = () => {
  const [usertotalCompliant, setUserTotalCompliant] = useState<number | null>(null);
  const [usertotalRequest, setUserTotalRequest] = useState<number | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL || "";
  const userId = localStorage.getItem('user_id') || "";

  // Fetch total complaints
  useEffect(() => {
    axios.get(`${apiUrl}/user_total_complaint/${userId}`)
      .then((response) => {
        setUserTotalCompliant(response.data.no_complaints);  // fixed key
      })
      .catch((error) => {
        console.error("Error fetching total complaints:", error);
      });
  }, [apiUrl, userId]);

  // Fetch total requests
  useEffect(() => {
    axios.get(`${apiUrl}/user_total_request/${userId}`)
      .then((response) => {
        setUserTotalRequest(response.data.no_request);  // fixed key
      })
      .catch((error) => {
        console.error("Error fetching total requests:", error);
      });
  }, [apiUrl, userId]);

  return (
    <div>
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Dashboard</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Dashboard</a></li>
          </ul>
          <div className="info-data">

            {/* Complaints Card */}
            <div className="card">
              <div className="head">
                <div>
                  <h2>{usertotalCompliant !== null ? usertotalCompliant.toLocaleString() : 'Loading...'}</h2>
                  <p>TOTAL SUBMITTED COMPLAINTS</p>
                </div>
                <i className='bx bx-error icon'></i>
              </div>
            </div>

            {/* Requests Card */}
            <div className="card">
              <div className="head">
                <div>
                  <h2>{usertotalRequest !== null ? usertotalRequest.toLocaleString() : 'Loading...'}</h2>
                  <p>TOTAL REQUESTS</p>
                </div>
                <i className='bx bx-file icon'></i>
              </div>
            </div>

          </div>
        </main>
      </section>
    </div>
  );
};

export default ResidentDashboard;
