import '../../css/style.css';
import Sidebar from '../../components/Admin/Sidebar';
import Navbar from '../../components/Admin/Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PieChartPickupRequest from '../../components/Admin/PieChartPickupRequest';
import ComplianceBarChart from '../../components/Admin/ComplianceBarChart';
// import CategoryPieChart from '../../components/Admin/CategoryPieChart';
// import ExpenseBarChart from '../../components/Admin/ExpenseBarChart';

const AdminDashboard = () => {
  const [total_resident, setTotalResident] = useState<number | null>(null);
  const [total_compliants, setTotalCompliants] = useState<number | null>(null);
  const [total_request, setTotalRequest] = useState<number | null>(null);
  const [total_schedule, setTotalShedule] = useState<number | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL || "";  // Ensure this URL is correct
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [residentRes, compliantRes, requestRes, scheduleRes] = await Promise.all([
          axios.get(`${apiUrl}/total_resident`),
          axios.get(`${apiUrl}/total_compliant`),
          axios.get(`${apiUrl}/total_request`),
          axios.get(`${apiUrl}/total_schedule`)
        ]);

        // Set values only if the data is present
        setTotalResident(residentRes.data?.no_residents ?? 0);
        setTotalCompliants(compliantRes.data?.no_compliants ?? 0);
        setTotalRequest(requestRes.data?.no_pickup_request ?? 0);
        setTotalShedule(scheduleRes.data?.no_budget_type ?? 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [apiUrl]);

  // Safe check before using toLocaleString
  const formatNumber = (num: number | null) => {
    return num !== null ? num.toLocaleString() : 'N/A';
  };

  

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
 
            <div className="card">
              <div className="head">
                <div>
              <h2>{formatNumber(total_resident)}</h2>
                  <p>TOTAL RESIDENTS</p>
                </div>
                <i className='bx bx-group icon'></i>
              </div>
            </div>

            {/* Students Card */}
            <div className="card">
              <div className="head">
                <div>
                 <h2>{formatNumber(total_compliants)}</h2>
                  <p>TOTAL SUBMIT COMPLAINTS</p>

                </div>
                <i className='bx bx-user-voice icon'></i>
              </div>
            </div>

             {/* Students Card */}
             <div className="card">
              <div className="head">
                <div>
                  <h2>{total_request !== null ? total_request.toLocaleString() : 'Loading...'}</h2>  
                  <p>TOTAL OF REQUEST</p>
                </div>
                <i className='bx bx-package icon'></i>
              </div>
            </div>

            {/* Students Card */}
            <div className="card">
              <div className="head">
                <div>
               <h2>{total_schedule!== null ? total_schedule.toLocaleString() : 'Loading...'}</h2>
                  <p>NO OF SCHEDULE</p>
                </div>
                <i className='bx bx-calendar icon'></i>
              </div>
            </div>
		
				</div>

            

                <div className="data">
  <div className="content-data">
    <div className="head">
      <h3>PIE CHART OF PICKUP REQUEST</h3>
      <div className="menu">
        <i className='bx bx-dots-horizontal-rounded icon'></i>
        <ul className="menu-link">
          <li><a href="#">Edit</a></li>
          <li><a href="#">Save</a></li>
          <li><a href="#">Remove</a></li>
        </ul>
      </div>
    </div>
    <div className="chart">
     <PieChartPickupRequest/>
    </div>
  </div>

  <div className="content-data">
    <div className="head">
      <h3>BAR CHART EXPENSES PER MONTH</h3>
      <div className="menu">
        <i className='bx bx-dots-horizontal-rounded icon'></i>
        <ul className="menu-link">
          <li><a href="#">Edit</a></li>
          <li><a href="#">Save</a></li>
          <li><a href="#">Remove</a></li>
        </ul>
      </div>
    </div>
    <div className="chart">
      <ComplianceBarChart />
    </div>
  </div>
</div>

        </main>
      </section>
    </div>
  );
};

export default AdminDashboard;
