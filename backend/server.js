require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allows React to connect
app.use(express.json()); // Parses incoming JSON data
app.use(express.urlencoded({ extended: true })); // Parses form data

// Expose the uploads folder so React can fetch images later
app.use('/uploads', express.static('uploads'));

// -------- NEW: API ROUTES --------
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/posts', require('./routes/post.routes'));
app.use('/api/comments', require('./routes/comment.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
// ---------------------------------

// Basic route to test the server
app.get('/', (req, res) => {
    res.send('TheFolio API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));