const Schedule = require('../models/ScheduleModel');

// 📥 Get all schedules
exports.getSchedule = (req, res) => {
    Schedule.getSchedules(req.params.admin_id,(err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};



// 🔍 Get a specific schedule by ID
exports.getScheduleById = (req, res) => {
    const scheduleId = req.params.id;

    Schedule.getScheduleById(scheduleId, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.status(200).json(result[0]);
    });
};

// ➕ Add a schedule
exports.addSchedule = (req, res) => {
    console.log('Request body:', req.body); // Log the entire request body

    try {
        const {
            admin_id,
            zone,
            barangay,
            collection_date,
            collection_time,
            notes
        } = req.body;

        // Validation
        if (!admin_id || !zone || !barangay || !collection_date || !collection_time) {
            return res.status(400).json({ error: 'All required fields must be filled' });
        }

        console.log('Parsed schedule data:', {
            admin_id,
            zone,
            barangay,
            collection_date,
            collection_time,
            notes
        });

        const scheduleData = {
            admin_id,
            zone,
            barangay,
            collection_date,
            collection_time,
            notes
        };

        // Log the SQL query and values before executing
        const sql = `
            INSERT INTO tbl_schedule (
                admin_id, zone, barangay,
                collection_date, collection_time, notes
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            scheduleData.admin_id,
            scheduleData.zone,
            scheduleData.barangay,
            scheduleData.collection_date,
            scheduleData.collection_time,
            scheduleData.notes
        ];
        console.log('SQL Query:', sql);
        console.log('SQL Values:', values);

        Schedule.addSchedule(scheduleData, (err, result) => {
            if (err) {
                console.error('Database Error:', err); // Log any database error
                return res.status(500).json({ error: 'Database error occurred', details: err });
            }

            res.status(201).json({
                message: 'Schedule successfully created',
                id: result.insertId
            });
        });
    } catch (error) {
        console.error('Internal Server Error:', error); // Log internal server error
        res.status(500).json({ error: 'Server error occurred', details: error });
    }
};



// ✏️ Update schedule
exports.updateSchedule = (req, res) => {
    const id = req.params.id;
    const {
        admin_id,
        zone,
        barangay,
        collection_date,
        collection_time,
        notes
    } = req.body;

    const updatedData = {
        admin_id,
        zone,
        barangay,
        collection_date,
        collection_time,
        notes
    };

    Schedule.updateSchedule(id, updatedData, (err, result) => {
        if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ error: 'Failed to update schedule' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.json({ message: 'Schedule updated successfully!' });
    });
};


// ❌ Delete schedule
exports.deleteSchedule = (req, res) => {
    const id = req.params.id;

    Schedule.deleteSchedule(id, (err, result) => {
        if (err) {
            console.error('Delete error:', err);
            return res.status(500).json({ error: 'Failed to delete schedule' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.json({ message: 'Schedule deleted successfully!' });
    });
};