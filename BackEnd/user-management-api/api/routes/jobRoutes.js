const express = require('express');
const jobController = require('../controllers/jobController');
const router = express.Router();

// Route to get all jobs
router.get('/jobs', jobController.getJobs);

// Route to get a job by ID
router.get('/jobs/:id', jobController.getJobById);

// Route to create a new job
router.post('/create/job', jobController.createJob);

module.exports = router;
