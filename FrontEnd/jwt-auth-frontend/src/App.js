// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './App/HOME/HomePage';
import AboutPage from './App/ABOUT/AboutPage';
import JobListingsPage from './App/JOBLISTING/JobListingsPage';
import ContactPage from './App/CONTACT/ContactPage';
import CompanyShowcasePage from './App/COMPANYSHOWCASE/CompanyShowcasePage';
import Login from './App/pages/Login';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    // Function to check if user is authenticated by verifying the token in localStorage
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        // Add more checks if needed, like token expiration
        return Boolean(token);
    };

    // Function to log out by clearing the token and redirecting to login page
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from local storage
        window.location.href = '/login'; // Redirect to login page
    };

    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />
                
                {/* Routes under MainLayout */}
                <Route element={<MainLayout onLogout={handleLogout} />}>
                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/about"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <AboutPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/job-listings"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <JobListingsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/contact"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <ContactPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/company-showcase"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <CompanyShowcasePage />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
