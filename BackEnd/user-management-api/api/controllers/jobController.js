const jobService = require('../services/jobService');
const Job = require('../models/Job');

// Controller to handle job creation
const createJob = async (req, res) => {
    try {
        // Destructure the new companyName along with other fields
        const { id, title, description, salary, applyLink, skills, companyName } = req.body;

        // Validate required fields including the new companyName
        if (!id || !title || !description || !salary || !applyLink || !skills || !companyName) {
            return res.status(400).json({ message: 'All fields are required: id, title, description, salary, applyLink, skills, companyName.' });
        }

        // Call the service to create a job with the new companyName field
        const job = await jobService.createJob({
            id,
            title,
            description,
            salary,
            applyLink,
            skills,  // Pass skills array to the service
            companyName,  // Include companyName
            jobPostedDate: new Date() // Set the jobPostedDate to the current date
        });

        res.status(201).json({ message: 'Job created successfully.', job });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to get all jobs
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find(); // Fetch all jobs from the database
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to get a single job by ID
const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findOne({ id }); // Fetch job by id

        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getJobs, getJobById, createJob };
