const db = require('../config/db');

// 🔹 Get all complaints and pickup requests with user full name
exports.getAllCombined = (callback) => {
  const sql = `
    SELECT 
      c.id,
      c.user_id,
      'complaint' AS type,
      c.compliant_category AS title,
      c.details AS description,
      c.status,
      c.created_at,
      CONCAT(u.first_name, ' ', u.last_name) AS full_name
    FROM 
      tbl_complaints c
    LEFT JOIN 
      tbl_user u ON c.user_id = u.id

    UNION ALL

    SELECT 
      p.id,
      p.user_id,
      'pickup_request' AS type,
      p.request_type AS title,
      p.notes AS description,
      p.status,
      p.created_at,
      CONCAT(u.first_name, ' ', u.last_name) AS full_name
    FROM 
      tbl_pickup_request p
    LEFT JOIN 
      tbl_user u ON p.user_id = u.id

    ORDER BY created_at DESC;
  `;
  db.query(sql, callback);
};
