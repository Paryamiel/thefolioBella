const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Import your middleware for the Admin route
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware'); 

// @route   POST /api/contact
// @desc    Submit a new contact form / concern
// @access  Public (Anyone can reach out)
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please provide name, email, and message' });
        }

        const newContact = await Contact.create({
            name,
            email,
            message
        });

        res.status(201).json({ message: 'Message sent successfully!', contact: newContact });
    } catch (error) {
        res.status(500).json({ message: 'Server error submitting contact form' });
    }
});

// @route   GET /api/contact
// @desc    Get all contact form submissions
// @access  Private (Admin Only)
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        // Find all concerns and sort by newest first
        const concerns = await Contact.find({}).sort({ createdAt: -1 });
        res.json(concerns);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching concerns' });
    }
});

// @route   DELETE /api/contact/:id
// @desc    Delete a contact form submission
// @access  Private (Admin Only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const concern = await Contact.findById(req.params.id);
        
        if (!concern) {
            return res.status(404).json({ message: 'Concern not found' });
        }

        await concern.deleteOne();
        res.json({ message: 'Concern deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting concern' });
    }
});

// @route   PUT /api/contact/:id/read
// @desc    Mark a concern as read
// @access  Private (Admin Only)
router.put('/:id/read', protect, adminOnly, async (req, res) => {
    try {
        const concern = await Contact.findById(req.params.id);
        
        if (!concern) {
            return res.status(404).json({ message: 'Concern not found' });
        }

        concern.isRead = true; // Change the status
        await concern.save();  // Save it to the database
        
        res.json(concern);
    } catch (error) {
        res.status(500).json({ message: 'Server error marking concern as read' });
    }
});

module.exports = router;