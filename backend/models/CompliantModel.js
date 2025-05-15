const db = require('../config/db'); // Ensure this connects to MySQL using mysql2

// 🔹 Get all complaints with user full name
exports.getAll = (callback) => {
  const sql = `
SELECT 
  c.*, 
  CONCAT(u.first_name, ' ', u.last_name) AS full_name
FROM 
  tbl_complaints c
LEFT JOIN 
  tbl_user u ON c.user_id = u.id;
  `;
  db.query(sql, callback);
};


// 🔹 Get a single complaint by ID
exports.getById = (id, callback) => {
  const sql = 'SELECT * FROM tbl_complaints WHERE id = ?';
  db.query(sql, [id], callback);
};

//statuis: Pending , On Progress , Approved

// ➕ Add a new complaint
exports.create = (data, callback) => {
  const sql = `
    INSERT INTO tbl_complaints (user_id, compliant_category, details, image_attach, status)
    VALUES (?, ?, ?, ?, 'Pending') 
  `;
  const values = [
    data.user_id,
    data.compliant_category,
    data.details,
    data.image_attach,
    data.status
  ];
  db.query(sql, values, callback);
};

// ✏️ Update complaint by ID
exports.update = (id, data, callback) => {
  // Log the data to see if it's populated correctly
  console.log("Updating complaint with ID:", id);
  console.log("Data received:", data);

  const sql = `
    UPDATE tbl_complaints
    SET compliant_category = ?, details = ?, status = ?, image_attach = ?
    WHERE id = ?
  `;
  
  const values = [
    data.compliant_category, // Compliant category
    data.details,            // Complaint details
    data.status,             // Complaint status
    data.image_attach,       // Image attachment (it should either be a new image or existing image)
    id                       // Complaint ID for WHERE condition
  ];

  // Log the values to ensure they are correct
  console.log("SQL Query Values:", values);

  db.query(sql, values, (err, result) => {
    // Handle query error
    if (err) {
      console.error("Database query error:", err);
      return callback(err, null);  // Pass error to callback
    }

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      console.log("No complaint found with the given ID");
      return callback(null, { message: 'Complaint not found' });
    }

    // Successful update
    console.log("Complaint updated successfully");
    callback(null, result);
  });
};


// ❌ Delete complaint by ID
exports.delete = (id, callback) => {
  const sql = 'DELETE FROM tbl_complaints WHERE id = ?';
  db.query(sql, [id], callback);
};
