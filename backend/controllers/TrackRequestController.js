const TrackRequest = require('../models/TrackRequestModel');

// 📥 Get all Complaints
// 📥 Get all Complaints and Pickup Requests (combined)
exports.getAllCombinedRequests = (req, res) => {
  TrackRequest.getAllCombined((err, results) => {
    if (err) return res.status(500).json({ error: err });

    console.log(results); // Log result to verify structure
    res.json(results);
  });
};