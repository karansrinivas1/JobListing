// controllers/jobController.js
const { fetchJobs } = require('../services/jobService');

const getJobs = async (req, res) => {
    try {
        const query = req.query.q || 'Software Developer';
        const jobs = await fetchJobs(query);
        res.json(jobs.map(job => ({
            id: job.id,
            title: job.title,
            description: job.description,
            lastUpdated: job.created,
            applyLink: job.redirect_url
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getJobs };
