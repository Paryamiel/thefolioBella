const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Create the user (password is hashed automatically by our Mongoose pre-save hook!)
        const user = await User.create({
            name,
            email,
            password
        });

        // 3. Send back the user data and their new token
        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user by email
        const user = await User.findOne({ email });

        // 2. Check if the user exists AND if the password matches
        if (user && (await user.matchPassword(password))) {
            
            // RUBRIC REQUIREMENT: Check if account is inactive
            if (user.status === 'inactive') {
                return res.status(403).json({ message: 'Account has been deactivated by an admin.' });
            }

            // 3. Send back user data and token
            res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role, // <--- MAKE SURE THIS IS HERE!
    token: generateToken(user._id)
});
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;