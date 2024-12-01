import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid, Box, Chip, Divider } from '@mui/material';
import api from '../../services/api'; // Assuming you have an API service set up
import './JobList.css';

const JobListingsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch jobs on component mount
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get('job/jobs'); // Fetch jobs from backend API
                setJobs(response.data); // Update state with fetched jobs
            } catch (error) {
                setError('Failed to fetch job listings');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return <Typography variant="h6" align="center">Loading job listings...</Typography>;
    }

    if (error) {
        return <Typography variant="h6" align="center" color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Grid container spacing={3} justifyContent="center">
                {jobs.map((job) => (
                    <Grid item xs={12} sm={6} md={4} key={job.id}>
                        <Card sx={{ minHeight: 300, display: 'flex', flexDirection: 'column' }}>
                            <CardContent>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                    {job.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                                    {job.description.split("\n").map((line, index) => (
                                        <span key={index}>
                                            {line} <br />
                                        </span>
                                    ))}
                                </Typography>
                                <Divider sx={{ marginTop: 2 }} />
                                <Box sx={{ marginTop: 2 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Salary: ${job.salary.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        Company: {job.companyName}
                                    </Typography>
                                    <Box sx={{ marginTop: 1 }}>
                                        {job.skills.map((skill, index) => (
                                            <Chip label={skill} key={index} sx={{ marginRight: 1, marginBottom: 1 }} />
                                        ))}
                                    </Box>
                                </Box>
                            </CardContent>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: 2 }}
                                href={job.applyLink}
                                target="_blank"
                            >
                                Apply Now
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default JobListingsPage;
