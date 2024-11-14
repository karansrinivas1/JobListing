// services/jobService.js
const axios = require('axios');

const fetchJobs = async (query) => {
    const { APP_ID, APP_KEY } = process.env;
    const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=10&what=${query}`;

    try {
        const response = await axios.get(url);
        return response.data.results;
    } catch (error) {
        throw new Error('Error fetching jobs');
    }
};

module.exports = { fetchJobs };
