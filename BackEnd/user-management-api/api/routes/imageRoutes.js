// routes/imageRoutes.js
const express = require('express');
const multer = require('multer');
const Image = require('../models/Image');
const router = express.Router();

// Configure multer to store images in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload image API
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const newImage = new Image({
            name: req.body.name,
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });

        await newImage.save();
        res.json({ message: 'Image uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve image API
router.get('/images', async (req, res) => {
    try {
        // Find all images and include both `name` and `image` fields
        const images = await Image.find({}, 'name image');
        
        // Format each image's binary data to base64 for easier display on frontend
        const formattedImages = images.map(image => ({
            name: image.name,
            image: {
                data: image.image.data.toString('base64'),  // Convert binary data to base64
                contentType: image.image.contentType
            }
        }));

        res.json(formattedImages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
