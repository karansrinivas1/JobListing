// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const User = require('../models/User');
const router = express.Router();


// JWT secret and expiration time
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
console.log("JWT_SECRET:", process.env.JWT_SECRET); // Should print the JWT secret
console.log("JWT_EXPIRATION:", process.env.JWT_EXPIRATION); // Should print "1h"

const jwt = require('jsonwebtoken');

// Configure multer for image uploads
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'uploads/');
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
   }
});
const upload = multer({
   storage: storage,
   fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
         cb(null, true);
      } else {
         cb(null, false);
      }
   }
});

// Helper function to validate email format
const isValidEmail = (email) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
};

// Helper function to validate full name
const isValidFullName = (fullName) => {
   return /^[a-zA-Z\s]+$/.test(fullName) && fullName.trim().length >= 2;
};

// Helper function to enforce a strong password rule
const isStrongPassword = (password) => {
   // Strong password: At least 8 characters, one uppercase, one lowercase, one digit, and one special character
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
   return passwordRegex.test(password);
};

// Create a new user with optional image upload
router.post('/create', upload.single('image'), async (req, res) => {
   try {
       const { fullName, email, password } = req.body;

       // Validate required fields
       if (!fullName || !email || !password) {
           return res.status(400).json({ message: 'Full name, email, and password are required.' });
       }

       // Validate email format
       if (!isValidEmail(email)) {
           return res.status(400).json({ message: 'Invalid email format.' });
       }

       // Validate full name
       if (!isValidFullName(fullName)) {
           return res.status(400).json({ message: 'Full name must contain only letters and be at least 2 characters long.' });
       }

       // Validate password strength
       if (!isStrongPassword(password)) {
           return res.status(400).json({ message: 'Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, one number, and one special character.' });
       }

       // Hash password
       const hashedPassword = await bcrypt.hash(password, 10);

       // Initialize new user data with the image path if an image is uploaded
       const newUser = new User({
           fullName,
           email,
           password: hashedPassword,
           imagePath: req.file ? req.file.path : undefined // Only set if image was uploaded
       });

       await newUser.save();
       res.status(201).json({ message: 'User created successfully.' });
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
});

// Update user details (full name and password only)
router.put('/edit', async (req, res) => {
   try {
      const { email, fullName, password } = req.body;

      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(404).json({ message: 'User not found.' });
      }

      // Validate full name if provided
      if (fullName && !isValidFullName(fullName)) {
         return res.status(400).json({ message: 'Full name must contain only letters and be at least 2 characters long.' });
      }

      // Validate password if provided
      if (password && !isStrongPassword(password)) {
         return res.status(400).json({ message: 'Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, one number, and one special character.' });
      }

      // Update full name if provided
      if (fullName) {
         user.fullName = fullName;
      }

      // Update password if provided
      if (password) {
         user.password = await bcrypt.hash(password, 10);
      }

      await user.save();
      res.json({ message: 'User updated successfully.' });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Delete a user
router.delete('/delete', async (req, res) => {
   try {
      const { email } = req.body;

      const user = await User.findOneAndDelete({ email });
      if (!user) return res.status(404).json({ message: 'User not found.' });

      res.json({ message: 'User deleted successfully.' });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Retrieve all users
router.get('/getAll', async (req, res) => {
   try {
      const users = await User.find().select('fullName email');
      res.json(users);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Upload an image separately
router.post('/uploadImage', upload.single('image'), async (req, res) => {
   try {
      const { email } = req.body;
      if (!req.file) return res.status(400).json({ message: 'Image file is required and must be in JPEG, PNG, or GIF format.' });

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found.' });

      user.imagePath = req.file.path;
      await user.save();

      res.json({ message: 'Image uploaded successfully.', path: req.file.path });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
   const token = req.headers['authorization']?.split(" ")[1];
   if (!token) return res.status(401).json({ message: 'Access Denied' });

   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
       if (err) return res.status(403).json({ message: 'Invalid Token' });
       req.user = decoded;
       next();
   });
};



// Login route to authenticate user and return JWT token
router.post('/login', async (req, res) => {
   const { username, password } = req.body;  // Accept username instead of email
   try {
      const user = await User.findOne({ email: username });  // Query based on username
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

      console.log("JWT_SECRET (inside login):", process.env.JWT_SECRET); // Ensure JWT_SECRET is accessible here

      const token = jwt.sign(
         { id: user._id, username: user.username }, // Token payload updated to include username
         process.env.JWT_SECRET,
         { expiresIn: process.env.JWT_EXPIRATION }
      );
      res.json({ message: 'Login successful', token });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});


// Protected route to retrieve user information
router.get('/profile', verifyToken, async (req, res) => {
   try {
      const user = await User.findById(req.user.id).select('fullName email imagePath');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

module.exports = router;
