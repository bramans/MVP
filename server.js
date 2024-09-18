const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// Enable CORS to allow requests from the front-end if they are on a different port
app.use(cors());

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// Configure Multer to store uploaded files in the 'uploads' directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Handle POST request to /upload
app.post('/upload', upload.array('files'), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            console.error('No files uploaded');
            return res.status(400).json({ message: 'No files uploaded' });
        }

        console.log('Uploaded files:', req.files);
        res.status(200).json({ message: 'Files uploaded successfully!' });
    } catch (error) {
        console.error('Error during file upload:', error);
        res.status(500).json({ message: 'An error occurred during file upload' });
    }
});

// Start the server on port 3000
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
