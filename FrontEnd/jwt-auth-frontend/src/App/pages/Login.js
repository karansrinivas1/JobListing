// src/pages/Login.js
import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/user/login', { username, password });

            // Save JWT token in localStorage
            localStorage.setItem('token', response.data.token);

            // Extract user details from response
            const { email, type, fullName } = response.data.user;

            // Dispatch user data to Redux store
            dispatch(setUser({ email, type, name: fullName }));

            // Redirect based on user role
            
            if (type === 2) {
                console.log(navigate('/admin/employees'));
                navigate('/admin/employees'); // Redirect admin to Employee List
            } else if (type === 1) {
                console.log(navigate('/'));
                navigate('/'); // Redirect employee to Job Listings
            } else {
                throw new Error('Invalid user type');
            }
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login to FindJob</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        className="login-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="login-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button">Login</button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default Login;
