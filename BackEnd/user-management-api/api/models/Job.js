const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: Number, required: true },
    applyLink: { type: String, required: true },
    skills: { type: [String], required: true },
    companyName: { type: String, required: true }, // New field
    jobPostedDate: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
