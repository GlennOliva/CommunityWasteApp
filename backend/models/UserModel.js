const db = require('../config/db'); // Ensure this connects MySQL using mysql2

// 🔹 Get all users
exports.getUsers = (callback) => {
  const sql = 'SELECT * FROM tbl_user';
  db.query(sql, callback);
};

// 🔹 Get a single user by ID
exports.getUserById = (userId, callback) => {
  const sql = 'SELECT * FROM tbl_user WHERE id = ?';
  db.query(sql, [userId], callback);
};

// ➕ Add a new user
exports.addUser = (data, callback) => {
  const sql = `
    INSERT INTO tbl_user (
      first_name, middle_name, last_name,
      email, password, contact_number,
      address, zone, barangay, image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.first_name,
    data.middle_name,
    data.last_name,
    data.email,
    data.password,
    data.contact_number,
    data.address,
    data.zone,
    data.barangay,
    data.image
  ];
  db.query(sql, values, callback);
};

// ✏️ Update user by ID
exports.updateUser = (id, data, callback) => {
  const sql = `
    UPDATE tbl_user
    SET first_name = ?, middle_name = ?, last_name = ?,
        email = ?, password = ?, contact_number = ?,
        address = ?, zone = ?, barangay = ?, image = ?
    WHERE id = ?
  `;
  const values = [
    data.first_name,
    data.middle_name,
    data.last_name,
    data.email,
    data.password,
    data.contact_number,
    data.address,
    data.zone,
    data.barangay,
    data.image,
    id
  ];
  db.query(sql, values, callback);
};

// 🔐 User login
exports.loginUser = (email, password, callback) => {
  const sql = `SELECT * FROM tbl_user WHERE email = ? AND password = ?`;
  db.query(sql, [email, password], callback);
};


exports.deleteUser = (id, callback) => {
  const sql = 'DELETE FROM tbl_user WHERE id = ?';
  db.query(sql, [id], callback);
};
