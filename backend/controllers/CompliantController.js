const Complaint = require('../models/CompliantModel');

// 📥 Get all Complaints
exports.getComplaints = (req, res) => {
  Complaint.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });

    console.log(results); // 👈 log the result
    res.json(results);
  });
};



exports.getComplaintsByUserId = (req, res) => {
    const userId = req.params.user_id;

    Complaint.getByUserId(userId, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'No complaints found for this user' });
        }

        res.status(200).json(result);
    });
};



// 🔍 Get Complaint by ID
exports.getComplaintById = (req, res) => {
    const complaintId = req.params.id;

    Complaint.getById(complaintId, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.status(200).json(result[0]);
    });
};

// ➕ Add Complaint
exports.addComplaint = (req, res) => {
    try {
        const { user_id, compliant_category, details, status } = req.body;
        const image_attach = req.file ? req.file.filename : null;

        if (!user_id || !compliant_category || !details || !status) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const complaintData = {
            user_id,
            compliant_category,
            details,
            status,
            image_attach
        };

        Complaint.create(complaintData, (err, result) => {
            if (err) {
                console.error('Database Error:', err);
                return res.status(500).json({ error: err });
            }
            res.status(201).json({
                message: 'Complaint successfully created',
                id: result.insertId
            });
        });
    } catch (error) {
        console.error('Internal Server Error:', error);
        res.status(500).json({ error: 'Server error occurred' });
    }
};



exports.updateComplaint = (req, res) => {
    const id = req.params.id;
    const { compliant_category, details, status, existing_image } = req.body; // <- include existing_image from frontend

    if (!compliant_category || !details || !status) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Fetch the complaint by ID
    Complaint.getById(id, (err, complaint) => {
        if (err) {
            console.error('Error fetching complaint:', err);
            return res.status(500).json({ error: 'Failed to fetch complaint' });
        }

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        let image_attach = complaint.image_attach;

        // If new file uploaded, use it
        if (req.file) {
            image_attach = req.file.filename;
        } else if (existing_image) {
            // If no new file, use the existing image from the form data
            image_attach = existing_image;
        }

        const updatedData = {
            compliant_category,
            details,
            status,
            image_attach,
        };

        Complaint.update(id, updatedData, (err, result) => {
            if (err) {
                console.error('Update error:', err);
                return res.status(500).json({ error: 'Failed to update complaint' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Complaint not found' });
            }

            res.json({ message: 'Complaint updated successfully!' });
        });
    });
};






// ❌ Delete Complaint
exports.deleteComplaint = (req, res) => {
    const id = req.params.id;

    Complaint.delete(id, (err, result) => {
        if (err) {
            console.error('Delete error:', err);
            return res.status(500).json({ error: 'Failed to delete complaint' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.json({ message: 'Complaint deleted successfully!' });
    });
};
