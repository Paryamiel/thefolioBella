const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Import our custom middleware
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

// @route   GET /api/admin/users
// @desc    List all member accounts
// @access  Private (Admin Only)
router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        // Find all users but exclude their passwords from the result
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching users' });
    }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Toggle a member's active/inactive status
// @access  Private (Admin Only)
router.put('/users/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent the admin from deactivating themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot change your own admin status' });
        }

        // Toggle the status
        user.status = user.status === 'active' ? 'inactive' : 'active';
        await user.save();

        res.json({ 
            message: `User status successfully changed to ${user.status}`,
            _id: user._id,
            name: user.name,
            status: user.status 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating user status' });
    }
});

module.exports = router;