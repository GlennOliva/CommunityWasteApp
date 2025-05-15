const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./config/db.js');
const adminRoutes = require('./routes/AdminRoutes.js');
const userRoutes = require('./routes/UserRoutes.js');
const scheduleRoutes = require('./routes/ScheduleRoutes.js');
const pickuprequestRoutes = require('./routes/PickupRoutes.js');
const compliantsRoutes = require('./routes/CompliantRoutes.js');
const DashboardRoutes = require('./routes/DashboardRoutes.js');


app.use(cors()); // ✅ Allow all origins (for development)
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use('/api/admin', adminRoutes)
app.use('/api/user', userRoutes)
app.use('/api/schedule', scheduleRoutes)
app.use('/api/pickup_request',pickuprequestRoutes)
app.use('/api/compliant', compliantsRoutes)
app.use(DashboardRoutes); // no '/api' prefix


const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (request, response)=> {
    return response.json("Starting Node Server..");
})