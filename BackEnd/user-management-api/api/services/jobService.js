const Job = require('../models/Job');

// Service to create a new job
const createJob = async (jobData) => {
    const job = new Job(jobData);
    return await job.save();
};

module.exports = { createJob };
