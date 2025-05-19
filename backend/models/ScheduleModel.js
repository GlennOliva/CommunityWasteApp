const db = require('../config/db'); // Ensure this connects MySQL using mysql2

// 🔹 Get all schedules
exports.getSchedules = (admin_id ,callback) => {
  const sql = 'SELECT * FROM tbl_schedule WHERE admin_id = ?';
  db.query(sql, [admin_id], callback);
};

exports.getAllSchedules = (callback) => {
  const sql = 'SELECT * FROM tbl_schedule';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return callback(err);
    }
    console.log('DB results:', results);  // Add this line to see what data is returned
    callback(null, results);
  });
};



// 🔹 Get a single schedule by ID
exports.getScheduleById = (scheduleId, callback) => {
  const sql = 'SELECT * FROM tbl_schedule WHERE id = ?';
  db.query(sql, [scheduleId], callback);
};

// ➕ Add a new schedule
exports.addSchedule = (data, callback) => {
  const sql = `
    INSERT INTO tbl_schedule (
      admin_id, zone, barangay,
      collection_date, collection_time, notes
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.admin_id,
    data.zone,
    data.barangay,
    data.collection_date,
    data.collection_time,
    data.notes
  ];
  db.query(sql, values, callback);
};

// ✏️ Update schedule by ID
exports.updateSchedule = (id, data, callback) => {
  const sql = `
    UPDATE tbl_schedule
    SET admin_id = ?, zone = ?, barangay = ?,
        collection_date = ?, collection_time = ?, notes = ?
    WHERE id = ?
  `;
  const values = [
    data.admin_id,
    data.zone,
    data.barangay,
    data.collection_date,
    data.collection_time,
    data.notes,
    id
  ];
  db.query(sql, values, callback);
};

// ❌ Delete schedule by ID
exports.deleteSchedule = (id, callback) => {
  const sql = 'DELETE FROM tbl_schedule WHERE id = ?';
  db.query(sql, [id], callback);
};
