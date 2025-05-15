const User = require('../models/UserModel');

// 📥 Get all Users
exports.getUsers = (req, res) => {
  User.getUsers((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// 🔍 Get a specific User by ID
exports.getUserById = (req, res) => {
  const userId = req.params.id;

  User.getUserById(userId, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result[0]);
  });
};

// ➕ Add a User
exports.addUser = (req, res) => {
  try {
    const {
      first_name, middle_name, last_name,
      email, password, contact_number,
      address, zone, barangay
    } = req.body;
    const image = req.file ? req.file.filename : null;

    // Validation
    if (!first_name || !middle_name || !last_name || !email || !password || !contact_number || !address || !zone || !barangay) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const userData = {
      first_name,
      middle_name,
      last_name,
      email,
      password,
      contact_number,
      address,
      zone,
      barangay,
      image
    };

    User.addUser(userData, (err, result) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ error: err });
      }
      res.status(201).json({
        message: 'User Successfully Registered',
        id: result.insertId
      });
    });
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// ✏️ Update User
exports.updateUser = (req, res) => {
  const id = req.params.id;
  const {
    first_name, middle_name, last_name,
    email, password, contact_number,
    address, zone, barangay
  } = req.body;
  const image = req.file ? req.file.filename : null;

  const updatedData = {
    first_name,
    middle_name,
    last_name,
    email,
    password,
    contact_number,
    address,
    zone,
    barangay
  };

  if (image) {
    updatedData.image = image;
  }

  User.updateUser(id, updatedData, (err, result) => {
    if (err) {
      console.error('Update error:', err);
      return res.status(500).json({ error: 'Failed to update user' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully!' });
  });
};

// 🔐 User Login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  User.loginUser(email, password, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user: results[0] });
  });
};



// ❌ Delete schedule
exports.deleteUser = (req, res) => {
    const id = req.params.id;

    User.deleteUser(id, (err, result) => {
        if (err) {
            console.error('Delete error:', err);
            return res.status(500).json({ error: 'Failed to delete user' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Resident deleted successfully!' });
    });
};