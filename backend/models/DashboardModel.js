const db = require('../config/db'); // Ensure this is mysql2/promise or callback-based mysql2

exports.getTotalResidentByID = ( callback) => {
      const sql = `SELECT COUNT(*) AS no_residents FROM tbl_user`;
    db.query(sql, (error, results) => {
        if (error) return callback(error, null);
        callback(null, results);
    });
};

exports.getTotalCompliantsByID = (callback) => {
      const sql = `SELECT COUNT(*) AS no_compliants FROM tbl_complaints`;
    db.query(sql,(error, results) => {
        if (error) return callback(error, null);
        callback(null, results);
    });
};

exports.getTotalRequestByID = ( callback) => {
    const sql = `SELECT COUNT(*) AS no_pickup_request FROM tbl_pickup_request`;
    db.query(sql, (error, results) => {
        if (error) return callback(error, null);
        callback(null, results);
    });
};

exports.getCountScheduleByID = (callback) => {
    const sql = `SELECT COUNT(*) AS no_budget_type FROM tbl_schedule`;
    db.query(sql, (error, results) => {
        if (error) return callback(error, null);
        callback(null, results);
    });
};


exports.getPieChartRequestByID = ( callback) => {
    const sql = `
      SELECT request_type
      FROM tbl_pickup_request
    `;
    db.query(sql,(error, results) => {
      if (error) return callback(error, null);
      // Ensure the result is an array of objects
      callback(null, results);
    });
 };
 

 exports.getBarChartCompliantsByID = (callback) => {
  const sql = `
    SELECT 
      DATE_FORMAT(created_at, '%Y-%m') AS month,
      compliant_category,
      COUNT(*) AS total_complaints
    FROM tbl_complaints
    GROUP BY month, compliant_category
    ORDER BY month ASC
  `;
  db.query(sql, (error, results) => {
    if (error) return callback(error, null);
    callback(null, results);
  });
};

  
  
  
  
  