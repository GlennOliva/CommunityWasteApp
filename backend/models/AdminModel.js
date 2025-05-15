const db = require('../config/db'); // Make sure db.js connects MySQL using mysql2

// 🔹 Get all admins
exports.getAdmins = (callback) => {
  const sql = 'SELECT * FROM tbl_admin';
  db.query(sql, callback);
};

// 🔹 Get a single admin by ID
exports.getAdminById = (adminId, callback) => {
  const sql = 'SELECT * FROM tbl_admin WHERE id = ?';
  db.query(sql, [adminId], callback);
};

// ➕ Add a new admin
exports.addAdmin = (data, callback) => {
  const sql = `
    INSERT INTO tbl_admin (first_name, middle_name, last_name, email, password, contact_number, address, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.first_name,
    data.middle_name,
    data.last_name,
    data.email,
    data.password,
    data.contact_number,
    data.address,
    data.image
  ];
  db.query(sql, values, callback);
};

// ✏️ Update admin by ID
exports.updateAdmin = (id, data, callback) => {
  const sql = `
    UPDATE tbl_admin
    SET first_name = ?, middle_name = ?, last_name = ?, email = ?, password = ?, contact_number = ?, address = ?, image = ?
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
    data.image,
    id
  ];
  db.query(sql, values, callback);
};

// 🔐 Admin login
exports.loginAdmin = (email, password, callback) => {
  const sql = `SELECT * FROM tbl_admin WHERE email = ? AND password = ?`;
  db.query(sql, [email, password], callback);
};
