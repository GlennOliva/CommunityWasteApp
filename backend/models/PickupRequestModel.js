const db = require('../config/db');

// Get all pickup requests
exports.getPickupRequests = (callback) => {
   const sql = `
SELECT 
  pr.*, 
  CONCAT(u.first_name, ' ', u.last_name) AS full_name
FROM 
  tbl_pickup_request pr
LEFT JOIN 
  tbl_user u ON pr.user_id = u.id;
  `;
  db.query(sql, callback);
};


exports.getByUserId = (userId, callback) => {
  const sql = `
    SELECT 
      c.*, 
      CONCAT(u.first_name, ' ', u.last_name) AS full_name
    FROM 
      tbl_complaints c
    LEFT JOIN 
      tbl_user u ON c.user_id = u.id
    WHERE 
      c.user_id = ?
  `;
  db.query(sql, [userId], callback);
};


// 📦 Get pickup requests by user ID
exports.getPickupRequestsByUserId = (userId, callback) => {
  const sql = `
    SELECT 
      pr.*, 
      CONCAT(u.first_name, ' ', u.last_name) AS full_name
    FROM 
      tbl_pickup_request pr
    LEFT JOIN 
      tbl_user u ON pr.user_id = u.id
    WHERE 
      pr.user_id = ?
  `;
  db.query(sql, [userId], callback);
};



// Get a specific pickup request by ID
exports.getPickupRequestById = (id, callback) => {
    db.query('SELECT * FROM tbl_pickup_request WHERE id = ?', [id], callback);
};

// Add a new pickup request
exports.addPickupRequest = (pickupRequestData, callback) => {
    const { user_id, request_type, schedule_date, schedule_time, notes } = pickupRequestData;
    db.query(
        "INSERT INTO tbl_pickup_request (user_id, request_type, schedule_date, schedule_time, notes, status) VALUES (?, ?, ?, ?, ?, 'Pending')",
        [user_id, request_type, schedule_date, schedule_time, notes],
        callback
    );
};


// Update an existing pickup request
exports.updatePickupRequest = (id, updatedData, callback) => {
    const { user_id, request_type, schedule_date, schedule_time, notes, status } = updatedData;
    db.query(
        'UPDATE tbl_pickup_request SET user_id = ?, request_type = ?, schedule_date = ?, schedule_time = ?, notes = ?, status = ? WHERE id = ?',
        [user_id, request_type, schedule_date, schedule_time, notes, status, id],
        callback
    );
};

// Delete a pickup request
exports.deletePickupRequest = (id, callback) => {
    db.query('DELETE FROM tbl_pickup_request WHERE id = ?', [id], callback);
};
