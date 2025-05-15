const Admin = require('../models/AdminModel');

// 📥 Get all Admins
exports.getAdmin = (req, res) => {
    Admin.getAdmins((err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  };
  

// 🔍 Get a specific Admin by ID
exports.getAdminById = (req, res) => {
  const adminId = req.params.id;

  Admin.getAdminById(adminId, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(result[0]);
  });
};

// ➕ Add an Admin
exports.addAdmin = (req, res) => {
    try {
      const { first_name, middle_name, last_name, email, password, contact_number, address } = req.body;
      const image = req.file ? req.file.filename : null;
  
      // Validation
      if (!first_name || !last_name || !email || !password || !contact_number || !address) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      if (!image) {
        return res.status(400).json({ error: 'Image is required' });
      }
  
      const adminData = {
        first_name,
        middle_name,
        last_name,
        email,
        password,
        contact_number,
        address,
        image
      };
  
      Admin.addAdmin(adminData, (err, result) => {
        if (err) {
          console.error('Database Error:', err);
          return res.status(500).json({ error: err });
        }
        res.status(201).json({
          message: 'Admin Successfully Created',
          id: result.insertId
        });
      });
    } catch (error) {
      console.error('Internal Server Error:', error);
      res.status(500).json({ error: 'Server error occurred' });
    }
  };

  
  // ✏️ Update Admin
exports.updateAdmin = (req, res) => {
    const id = req.params.id;
    const { first_name, middle_name, last_name, email, password, contact_number, address } = req.body;
    const image = req.file ? req.file.filename : null;
  
    const updatedData = {
      first_name,
      middle_name,
      last_name,
      email,
      password,
      contact_number,
      address
    };
  
    if (image) {
      updatedData.image = image;
    }
  
    Admin.updateAdmin(id, updatedData, (err, result) => {
      if (err) {
        console.error('Update error:', err);
        return res.status(500).json({ error: 'Failed to update admin' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      res.json({ message: 'Admin updated successfully!' });
    });
  };

  
// 🔐 Admin Login
exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;

  Admin.loginAdmin(email, password, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', admin: results[0] });
  });
};
