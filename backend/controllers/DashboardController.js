const Dashboard = require('../models/DashboardModel');

// 🔍 Get total number of residents
exports.getTotalResidentByID = (req, res) => {
  Dashboard.getTotalResidentByID((err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json(result[0]);
  });
};

// 🔍 Get total number of complaints
exports.getTotalCompliantsByID = (req, res) => {
  Dashboard.getTotalCompliantsByID((err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json(result[0]);
  });
};

// 🔍 Get total number of pickup requests
exports.getTotalRequestByID = (req, res) => {
  Dashboard.getTotalRequestByID((err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json(result[0]);
  });
};

// 🔍 Get total number of schedules
exports.getCountScheduleByID = (req, res) => {
  Dashboard.getCountScheduleByID((err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json(result[0]);
  });
};

// 🔍 Get pie chart data for pickup requests
exports.getPieChartRequestByID = (req, res) => {
  Dashboard.getPieChartRequestByID((err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json(result);
  });
};

// 🔍 Get bar chart data for complaints per month
exports.getBarChartCompliantsPerMonthByID = (req, res) => {
  Dashboard.getBarChartCompliantsByID((err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json(result);
  });
};
