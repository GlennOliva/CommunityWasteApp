import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from '../pages/Auth/Login';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import Register from '../pages/Auth/Register';
import ResidentDashboard from '../pages/Residents/ResidentDashboard';
import ManageResident from '../pages/Admin/ManageResident';
import ManageSchedule from '../pages/Admin/ManageSchedule';
import ManageCompliant from '../pages/Admin/ManageCompliant';
import ManagePickupRequest from '../pages/Admin/ManagePickupRequest';
import CollectionSchedule from '../pages/Residents/CollectionSchedule';
import ManageUserPickupRequest from '../pages/Residents/ManagePickupRequest';
import UserManageCompliant from '../pages/Residents/ManageCompliant';
import TrackRequest from '../pages/Residents/TrackRequest';






const AppRoutes = () => (
  <Router>
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path='/admin/dashboard' element={<AdminDashboard/>} />
    <Route path='/user/dashboard' element={<ResidentDashboard/>} />
    <Route path='/admin/manage_resident' element={<ManageResident/>} />
    <Route path='/admin/manage_schedule' element={<ManageSchedule/>} />
    <Route path='/admin/manage_compliant' element={<ManageCompliant/>} />
    <Route path='/admin/manage_pickup_request' element={<ManagePickupRequest/>} />
    <Route path='/user/collection_schedule' element={<CollectionSchedule/>} />
    <Route path='/user/manage_pickup_request' element={<ManageUserPickupRequest/>} />
    <Route path='/user/manage_compliant' element={<UserManageCompliant/>} />
      <Route path='/user/track_request' element={<TrackRequest/>} />
    </Routes>
  </Router>
);

export default AppRoutes;
