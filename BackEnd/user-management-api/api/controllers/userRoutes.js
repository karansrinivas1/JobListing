const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


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

// Helper functions
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidFullName = (fullName) => /^[a-zA-Z\s]+$/.test(fullName) && fullName.trim().length >= 2;
const isStrongPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
const isValidUserType = (type) => [1, 2].includes(type); // 1 for employee, 2 for admin


const verifyToken = (req, res, next) => {
   const token = req.headers['authorization']?.split(' ')[1];  // Extract token from header
   console.log('Received token:', token);  // Log the received token to ensure it's being sent
   console.log("JWT_SECRET (verifying):", process.env.JWT_SECRET);

   console.log("JWT_SECRET (signing):", process.env.JWT_SECRET);


   if (!token) return res.status(401).json({ message: 'Access Denied' });  // Token missing

   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
       if (err) {
           console.log('Token verification failed:', err);  // Log any verification issues
           return res.status(403).json({ message: 'Invalid Token' });
       }
       console.log('Decoded token:', decoded);  // Log decoded user info to verify it's correct
       req.user = decoded;  // Store decoded user info for further use in routes
       next();  // Proceed to next middleware or route handler
   });
};

// Create a new user
router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const { fullName, email, password, type } = req.body;

        if (!fullName || !email || !password || type === undefined) {
            return res.status(400).json({ message: 'Full name, email, password, and type are required.' });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
        if (!isValidFullName(fullName)) {
            return res.status(400).json({ message: 'Full name must contain only letters and be at least 2 characters long.' });
        }
        if (!isStrongPassword(password)) {
            return res.status(400).json({ message: 'Password must be strong (8+ characters, uppercase, lowercase, number, special character).' });
        }
        if (!isValidUserType(parseInt(type, 10))) {
            return res.status(400).json({ message: 'Invalid type. Allowed values are 1 (employee) or 2 (admin).' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            type: parseInt(type, 10),
            imagePath: req.file ? req.file.path : undefined
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
   const { username, password } = req.body; // Assuming username is the email

   try {
       // Find the user by email
       const user = await User.findOne({ email: username });
       if (!user) {
           return res.status(404).json({ message: 'User not found' });
       }

       // Check if the password is correct
       const isPasswordValid = await bcrypt.compare(password, user.password);
       if (!isPasswordValid) {
           return res.status(401).json({ message: 'Invalid password' });
       }

       // Create the JWT token
       // Payload to include in the JWT (e.g., user info)
       const payload = { id: user._id, email: user.email, type: user.type };

// Signing the JWT with a secret and setting the expiration
       const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

       console.log("JWT_SECRET (signing):", process.env.JWT_SECRET);
       console.log("Token:", token);
       jwt.verify(token,  process.env.JWT_SECRET, (err, decoded) => {
         if (err) {
             console.error('Error verifying token:', err.message);
         } else {
             console.log('Decoded token:', decoded);
         }
     });

       // Send the response with the user details and token
       res.json({
           message: 'Login successful',
           token,
           user: {
               email: user.email,
               type: user.type, // 1 for employee, 2 for admin
               fullName: user.fullName, // Optional
           },
       });
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
});

// Retrieve authenticated user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            fullName: user.fullName,
            email: user.email,
            type: user.type === 1 ? 'employee' : 'admin',
            imagePath: user.imagePath
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user details
router.put('/edit', verifyToken, async (req, res) => {
    try {
        const { fullName, password, type } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (fullName && !isValidFullName(fullName)) {
            return res.status(400).json({ message: 'Invalid full name.' });
        }
        if (password && !isStrongPassword(password)) {
            return res.status(400).json({ message: 'Invalid password.' });
        }
        if (type !== undefined && !isValidUserType(parseInt(type, 10))) {
            return res.status(400).json({ message: 'Invalid type. Allowed values are 1 (employee) or 2 (admin).' });
        }

        if (fullName) user.fullName = fullName;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (type !== undefined) user.type = parseInt(type, 10);

        await user.save();
        res.json({ message: 'User updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve all users
router.get('/getAll', verifyToken, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users.map(user => ({
            ...user.toObject(),
            type: user.type === 1 ? 'employee' : 'admin'
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a user
router.delete('/delete', verifyToken, async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOneAndDelete({ email });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
