const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. PROTECT MIDDLEWARE: Checks if the user is logged in
const protect = async (req, res, next) => {
    let token;

    // Check if the request has an authorization header that starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get the token from the header (format is "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key from your .env file
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user in the database using the ID from the token
            // .select('-password') ensures we don't accidentally send the password back
            req.user = await User.findById(decoded.id).select('-password');

            // Move on to the next function (the actual route)
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// 2. ADMIN MIDDLEWARE: Checks if the logged-in user is an admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // They are an admin, let them through
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };