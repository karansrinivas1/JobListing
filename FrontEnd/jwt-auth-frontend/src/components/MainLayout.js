
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { Container, CssBaseline } from '@mui/material';

const MainLayout = ({ onLogout }) => {
    const location = useLocation();

    return (
        <>
            <CssBaseline />
            {/* Conditionally render Navbar based on the current path */}
            {location.pathname !== '/login' && <Navbar onLogout={onLogout} />}
            <Container>
                {/* Outlet renders child routes within the layout */}
                <Outlet />
            </Container>
        </>
    );
};

export default MainLayout;
