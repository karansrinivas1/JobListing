import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = ({ onLogout }) => {
    const navigate = useNavigate();

    // Access user data from Redux
    const { user } = useSelector((state) => state.user);

    const handleLogout = () => {
        onLogout(); // This function will remove the JWT token from localStorage
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Job Portal
                </Typography>

                {/* Render links based on user type */}
                {user?.type === 2 ? (
                    // Admin-specific links
                    <>
                        <Button color="inherit" component={Link} to="/admin/employees">Employee List</Button>
                        <Button color="inherit" component={Link} to="/admin/add-job">Add Job</Button>
                    </>
                ) : user?.type === 1 ? (
                    // Employee-specific links
                    <>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/about">About</Button>
                        <Button color="inherit" component={Link} to="/job-listings">Job Listings</Button>
                        <Button color="inherit" component={Link} to="/contact">Contact</Button>
                        <Button color="inherit" component={Link} to="/company-showcase">Company Showcase</Button>
                    </>
                ) : (
                    // Links for unauthenticated users
                    <>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/about">About</Button>
                        <Button color="inherit" component={Link} to="/contact">Contact</Button>
                        <Button color="inherit" component={Link} to="/company-showcase">Company Showcase</Button>
                    </>
                )}

                {/* Logout Button */}
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
