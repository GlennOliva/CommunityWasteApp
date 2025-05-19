const PickupRequest = require('../models/PickupRequestModel');

// 📥 Get all pickup requests
exports.getPickupRequests = (req, res) => {
    PickupRequest.getPickupRequests((err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// 🔍 Get all pickup requests by User ID
exports.getPickupRequestByUserId = (req, res) => {
  const userId = req.params.user_id;

  PickupRequest.getPickupRequestsByUserId(userId, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No pickup requests found for this user' });
    }

    res.status(200).json(results);
  });
};


// 📄 Get a pickup request by ID
exports.getPickupRequestById = (req, res) => {
    const id = req.params.id;

    PickupRequest.getPickupRequestById(id, (err, result) => {
        if (err) {
            console.error('Error fetching pickup request:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Pickup request not found' });
        }

        res.status(200).json(result[0]); // Return the first matching row
    });
};


// ➕ Add a pickup request
exports.addPickupRequest = (req, res) => {
    console.log('Request body:', req.body); // Log the entire request body

    try {
        const {
            user_id,
            request_type,
            schedule_date,
            schedule_time,
            notes,
            status
        } = req.body;

        // Validation
        if (!user_id || !request_type || !schedule_date || !schedule_time) {
            return res.status(400).json({ error: 'All required fields must be filled' });
        }

        console.log('Parsed pickup request data:', {
            user_id,
            request_type,
            schedule_date,
            schedule_time,
            notes,
            status
        });

        const pickupRequestData = {
            user_id,
            request_type,
            schedule_date,
            schedule_time,
            notes,
            status
        };

        // Log the SQL query and values before executing
        const sql = `
            INSERT INTO tbl_pickup_requests (
                user_id, request_type, schedule_date,
                schedule_time, notes, status
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            pickupRequestData.user_id,
            pickupRequestData.request_type,
            pickupRequestData.schedule_date,
            pickupRequestData.schedule_time,
            pickupRequestData.notes,
            pickupRequestData.status
        ];
        console.log('SQL Query:', sql);
        console.log('SQL Values:', values);

        PickupRequest.addPickupRequest(pickupRequestData, (err, result) => {
            if (err) {
                console.error('Database Error:', err); // Log any database error
                return res.status(500).json({ error: 'Database error occurred', details: err });
            }

            res.status(201).json({
                message: 'Pickup request successfully created',
                id: result.insertId
            });
        });
    } catch (error) {
        console.error('Internal Server Error:', error); // Log internal server error
        res.status(500).json({ error: 'Server error occurred', details: error });
    }
};

// ✏️ Update pickup request
exports.updatePickupRequest = (req, res) => {
    const id = req.params.id;
    const {
        user_id,
        request_type,
        schedule_date,
        schedule_time,
        notes,
        status
    } = req.body;

    const updatedData = {
        user_id,
        request_type,
        schedule_date,
        schedule_time,
        notes,
        status
    };

    PickupRequest.updatePickupRequest(id, updatedData, (err, result) => {
        if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ error: 'Failed to update pickup request' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pickup request not found' });
        }

        res.json({ message: 'Pickup request updated successfully!' });
    });
};

// ❌ Delete pickup request
exports.deletePickupRequest = (req, res) => {
    const id = req.params.id;

    PickupRequest.deletePickupRequest(id, (err, result) => {
        if (err) {
            console.error('Delete error:', err);
            return res.status(500).json({ error: 'Failed to delete pickup request' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pickup request not found' });
        }

        res.json({ message: 'Pickup request deleted successfully!' });
    });
};
