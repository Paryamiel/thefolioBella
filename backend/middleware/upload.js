// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads/ folder if it does not exist yet
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Where and how to save files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Renames file to: fieldname-16823456789.jpg
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit to save server space
});

module.exports = upload;