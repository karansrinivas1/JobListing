import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage from './App/HOME/HomePage';
import AboutPage from './App/ABOUT/AboutPage';
import JobListingsPage from './App/JOBLISTING/JobListingsPage';
import ContactPage from './App/CONTACT/ContactPage';
import CompanyShowcasePage from './App/COMPANYSHOWCASE/CompanyShowcasePage';
import Login from './App/pages/Login';
import AddJobPage from './App/ADMIN/AddJobPage';
import EmployeeListPage from './App/ADMIN/EmployeeListPage';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

function App() {
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return Boolean(token);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const { user } = useSelector((state) => state.user);

    console.log('App.js - Logged-in User:', user);

    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes under MainLayout */}
                <Route element={<MainLayout onLogout={handleLogout} />}>
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
                            <RoleBasedRoute allowedRoles={[1]}>
                                <JobListingsPage />
                            </RoleBasedRoute>
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

                    {/* Admin-Specific Routes */}
                    <Route
                        path="/admin/add-job"
                        element={
                            <RoleBasedRoute allowedRoles={[2]}>
                                <AddJobPage />
                            </RoleBasedRoute>
                        }
                    />
                    <Route
                        path="/admin/employees"
                        element={
                            <RoleBasedRoute allowedRoles={[2]}>
                                <EmployeeListPage />
                            </RoleBasedRoute>
                        }
                    />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
