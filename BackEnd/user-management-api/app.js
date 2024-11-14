const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./api/controllers/userRoutes');
const jobRoutes = require('./api/routes/jobRoutes');
const imageRoutes = require('./api/routes/imageRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();  // Load environment variables
const cors = require('cors'); 
const Company = require('./api/models/Image');


// Allow CORS for your frontend's origin
app.use(cors({
    origin: 'http://localhost:3001', // Replace with your frontend URL
    credentials: true, // Enable if you need to include cookies with requests
}));


app.use(express.json()); // Parse JSON bodies
app.use('/user', userRoutes); // User routes
app.use('/api', jobRoutes);
app.use('/image',imageRoutes);
const uri = 'mongodb+srv://srinivaskar:Mongodb123@cluster0.eza4i.mongodb.net/myDatabase?retryWrites=true&w=majority';



mongoose.connect(uri)    
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
